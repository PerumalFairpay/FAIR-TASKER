import { call, put, takeLatest, take } from "redux-saga/effects";
import { eventChannel, END } from "redux-saga";
import { SEND_CHAT_QUERY } from "./actionType";
import {
  sendChatQuerySuccess,
  sendChatQueryFailure,
  chatChunkReceived,
} from "./action";

function createChatChannel(query: string) {
  return eventChannel((emitter) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const fetchStream = async () => {
      try {
        const response = await fetch(`${apiUrl}/ai/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
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
    return () => {
      // Unsubscribe logic if needed (e.g., abort controller)
    };
  });
}

function* workSendChatQuery(action: any): Generator<any, void, any> {
  const channel = yield call(createChatChannel, action.payload.query);
  try {
    while (true) {
      const { chunk, error } = yield take(channel);
      if (chunk) {
        yield put(chatChunkReceived(chunk));
      }
      if (error) {
        yield put(sendChatQueryFailure(error));
        break; // Stop listening if an error occurs
      }
    }
  } catch (e) {
    console.error("Chat Saga Error:", e);
    yield put(
      sendChatQueryFailure("An unexpected error occurred in the chat saga."),
    );
  } finally {
    yield put(sendChatQuerySuccess()); // Indicate the chat stream has ended successfully or with an error
  }
}

function* aiAssistantSaga() {
  yield takeLatest(SEND_CHAT_QUERY, workSendChatQuery);
}

export default aiAssistantSaga;
