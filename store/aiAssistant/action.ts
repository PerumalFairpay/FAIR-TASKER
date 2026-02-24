import {
  SEND_CHAT_QUERY,
  SEND_CHAT_QUERY_SUCCESS,
  SEND_CHAT_QUERY_FAILURE,
  CHAT_CHUNK_RECEIVED,
  CLEAR_CHAT_HISTORY,
} from "./actionType";

export const sendChatQuery = (query: string) => ({
  type: SEND_CHAT_QUERY,
  payload: { query },
});

export const sendChatQuerySuccess = () => ({
  type: SEND_CHAT_QUERY_SUCCESS,
});

export const sendChatQueryFailure = (error: string) => ({
  type: SEND_CHAT_QUERY_FAILURE,
  payload: error,
});

export const chatChunkReceived = (chunk: string) => ({
  type: CHAT_CHUNK_RECEIVED,
  payload: chunk,
});

export const clearChatHistory = () => ({
  type: CLEAR_CHAT_HISTORY,
});
