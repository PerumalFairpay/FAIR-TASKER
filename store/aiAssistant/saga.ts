import { call, put, takeLatest, take, all } from "redux-saga/effects";
import { eventChannel, END, SagaIterator } from "redux-saga";
import { 
  SEND_CHAT_QUERY, 
  FETCH_CHAT_SESSIONS, 
  FETCH_SESSION_MESSAGES,
  DELETE_CHAT_SESSION,
  RENAME_CHAT_SESSION
} from "./actionType";
import {
  sendChatQuerySuccess,
  sendChatQueryFailure,
  chatChunkReceived,
  updateSessionId,
  fetchChatSessionsSuccess,
  fetchChatSessionsFailure,
  fetchSessionMessagesSuccess,
  fetchSessionMessagesFailure,
  deleteChatSessionSuccess,
  deleteChatSessionFailure,
  renameChatSessionSuccess,
  renameChatSessionFailure,
  fetchChatSessions as fetchChatSessionsAction
} from "./action";
import api from "../api";

// API Functions
const fetchChatSessionsApi = () => api.get("/ai/sessions");
const fetchSessionMessagesApi = (sessionId: string) => api.get(`/ai/sessions/${sessionId}/messages`);
const deleteChatSessionApi = (sessionId: string) => api.delete(`/ai/sessions/${sessionId}`);
const renameChatSessionApi = (sessionId: string, title: string) => api.patch(`/ai/sessions/${sessionId}`, { title });

function createChatChannel(
  query: string,
  sessionId?: string | null,
) {
  return eventChannel((emitter) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const fetchStream = async () => {
      try {
        const response = await fetch(`${apiUrl}/ai/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query, session_id: sessionId }),
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: response.statusText }));
          emitter({
            error: errorData.message || "Failed to connect to AI assistant",
          });
          emitter(END);
          return;
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            emitter({ chunk });
          }
        }
        emitter(END);
      } catch (error: any) {
        emitter({
          error:
            error.message ||
            "An error occurred while communicating with the AI.",
        });
        emitter(END);
      }
    };

    fetchStream();
    return () => {};
  });
}

// Sagas
function* onSendChatQuery(action: any): Generator<any, void, any> {
  const channel = yield call(
    createChatChannel,
    action.payload.query,
    action.payload.sessionId,
  );
  try {
    while (true) {
      const { chunk, error } = yield take(channel);
      if (chunk) {
        if (chunk.startsWith("__SESSION_ID__: ")) {
            const newSessionId = chunk.replace("__SESSION_ID__:", "").trim();
            yield put(updateSessionId(newSessionId));
            yield put(fetchChatSessionsAction());
        } else {
            yield put(chatChunkReceived(chunk));
        }
      }
      if (error) {
        yield put(sendChatQueryFailure(error));
        break; 
      }
    }
  } catch (e) {
    console.error("Chat Saga Error:", e);
    yield put(sendChatQueryFailure("An unexpected error occurred."));
  } finally {
    yield put(sendChatQuerySuccess());
    yield put(fetchChatSessionsAction());
  }
}

function* onFetchChatSessions(): SagaIterator {
    try {
        const response = yield call(fetchChatSessionsApi);
        yield put(fetchChatSessionsSuccess(response.data));
    } catch (error: any) {
        yield put(fetchChatSessionsFailure(error.response?.data?.message || "Failed to fetch sessions"));
    }
}

function* onFetchSessionMessages({ payload }: any): SagaIterator {
    try {
        const response = yield call(fetchSessionMessagesApi, payload);
        yield put(fetchSessionMessagesSuccess(response.data));
    } catch (error: any) {
        yield put(fetchSessionMessagesFailure(error.response?.data?.message || "Failed to fetch messages"));
    }
}

function* onDeleteSession({ payload }: any): SagaIterator {
    try {
        yield call(deleteChatSessionApi, payload);
        yield put(deleteChatSessionSuccess(payload));
    } catch (error: any) {
        yield put(deleteChatSessionFailure(error.response?.data?.message || "Failed to delete session"));
    }
}

function* onRenameSession({ payload }: any): SagaIterator {
    try {
        yield call(renameChatSessionApi, payload.sessionId, payload.title);
        yield put(renameChatSessionSuccess(payload.sessionId, payload.title));
    } catch (error: any) {
        yield put(renameChatSessionFailure(error.response?.data?.message || "Failed to rename session"));
    }
}

export default function* aiAssistantSaga(): SagaIterator {
    yield takeLatest(SEND_CHAT_QUERY, onSendChatQuery);
    yield takeLatest(FETCH_CHAT_SESSIONS, onFetchChatSessions);
    yield takeLatest(FETCH_SESSION_MESSAGES, onFetchSessionMessages);
    yield takeLatest(DELETE_CHAT_SESSION, onDeleteSession);
    yield takeLatest(RENAME_CHAT_SESSION, onRenameSession);
}
