import { call, put, takeLatest, take, all } from "redux-saga/effects";
import { eventChannel, END } from "redux-saga";
import { 
  SEND_CHAT_QUERY, 
  FETCH_SESSIONS, 
  FETCH_SESSION_MESSAGES, 
  DELETE_SESSION, 
  RENAME_SESSION 
} from "./actionType";
import {
  sendChatQuerySuccess,
  sendChatQueryFailure,
  chatChunkReceived,
  fetchSessionsSuccess,
  fetchSessionsFailure,
  fetchSessionMessagesSuccess,
  fetchSessionMessagesFailure,
  deleteSessionSuccess,
  deleteSessionFailure,
  renameSessionSuccess,
  renameSessionFailure,
  fetchSessions as fetchSessionsAction,
} from "./action";

function createChatChannel(
  query: string,
  history: { role: string; content: string }[] = [],
  sessionId?: string,
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
          body: JSON.stringify({ query, history, session_id: sessionId }),
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

        // Get the session ID from headers if it was a new session
        const newSessionId = response.headers.get("X-Session-ID");
        if (newSessionId) {
            emitter({ sessionId: newSessionId });
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

function* workSendChatQuery(action: any): Generator<any, void, any> {
  const channel = yield call(
    createChatChannel,
    action.payload.query,
    action.payload.history || [],
    action.payload.sessionId
  );
  let finalSessionId = action.payload.sessionId;
  
  try {
    while (true) {
      const { chunk, error, sessionId } = yield take(channel);
      if (sessionId) {
          finalSessionId = sessionId;
      }
      if (chunk) {
        yield put(chatChunkReceived(chunk));
      }
      if (error) {
        yield put(sendChatQueryFailure(error));
        break;
      }
    }
  } catch (e) {
    yield put(sendChatQueryFailure("An unexpected error occurred in the chat saga."));
  } finally {
    yield put(sendChatQuerySuccess(finalSessionId));
    yield put(fetchSessionsAction()); // Refresh sessions list to show new chat or update title
  }
}

function* workFetchSessions(): Generator<any, void, any> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = yield call(fetch, `${apiUrl}/ai/sessions`, { credentials: "include" });
        if (response.ok) {
            const data = yield response.json();
            yield put(fetchSessionsSuccess(data));
        } else {
            yield put(fetchSessionsFailure("Failed to fetch sessions"));
        }
    } catch (e: any) {
        yield put(fetchSessionsFailure(e.message));
    }
}

function* workFetchSessionMessages(action: any): Generator<any, void, any> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = yield call(fetch, `${apiUrl}/ai/sessions/${action.payload}/messages`, { credentials: "include" });
        if (response.ok) {
            const data = yield response.json();
            yield put(fetchSessionMessagesSuccess(data));
        } else {
            yield put(fetchSessionMessagesFailure("Failed to fetch messages"));
        }
    } catch (e: any) {
        yield put(fetchSessionMessagesFailure(e.message));
    }
}

function* workDeleteSession(action: any): Generator<any, void, any> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = yield call(fetch, `${apiUrl}/ai/sessions/${action.payload}`, { 
            method: "DELETE",
            credentials: "include" 
        });
        if (response.ok) {
            yield put(deleteSessionSuccess(action.payload));
        } else {
            yield put(deleteSessionFailure("Failed to delete session"));
        }
    } catch (e: any) {
        yield put(deleteSessionFailure(e.message));
    }
}

function* workRenameSession(action: any): Generator<any, void, any> {
    try {
        const { sessionId, title } = action.payload;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = yield call(fetch, `${apiUrl}/ai/sessions/${sessionId}`, { 
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
            credentials: "include" 
        });
        if (response.ok) {
            yield put(renameSessionSuccess(sessionId, title));
        } else {
            yield put(renameSessionFailure("Failed to rename session"));
        }
    } catch (e: any) {
        yield put(renameSessionFailure(e.message));
    }
}

function* aiAssistantSaga() {
  yield all([
    takeLatest(SEND_CHAT_QUERY, workSendChatQuery),
    takeLatest(FETCH_SESSIONS, workFetchSessions),
    takeLatest(FETCH_SESSION_MESSAGES, workFetchSessionMessages),
    takeLatest(DELETE_SESSION, workDeleteSession),
    takeLatest(RENAME_SESSION, workRenameSession),
  ]);
}

export default aiAssistantSaga;
