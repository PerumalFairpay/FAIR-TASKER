import {
  SEND_CHAT_QUERY,
  SEND_CHAT_QUERY_SUCCESS,
  SEND_CHAT_QUERY_FAILURE,
  CHAT_CHUNK_RECEIVED,
  CLEAR_CHAT_HISTORY,
  FETCH_CHAT_SESSIONS,
  FETCH_CHAT_SESSIONS_SUCCESS,
  FETCH_CHAT_SESSIONS_FAILURE,
  FETCH_SESSION_MESSAGES,
  FETCH_SESSION_MESSAGES_SUCCESS,
  FETCH_SESSION_MESSAGES_FAILURE,
  SET_CURRENT_SESSION_ID,
  UPDATE_SESSION_ID,
  DELETE_CHAT_SESSION,
  DELETE_CHAT_SESSION_SUCCESS,
  DELETE_CHAT_SESSION_FAILURE,
  RENAME_CHAT_SESSION,
  RENAME_CHAT_SESSION_SUCCESS,
  RENAME_CHAT_SESSION_FAILURE,
} from "./actionType";

export const sendChatQuery = (
  query: string,
  sessionId?: string | null,
) => ({
  type: SEND_CHAT_QUERY,
  payload: { query, sessionId },
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

// Session Actions
export const fetchChatSessions = () => ({
  type: FETCH_CHAT_SESSIONS,
});

export const fetchChatSessionsSuccess = (sessions: any[]) => ({
  type: FETCH_CHAT_SESSIONS_SUCCESS,
  payload: sessions,
});

export const fetchChatSessionsFailure = (error: string) => ({
  type: FETCH_CHAT_SESSIONS_FAILURE,
  payload: error,
});

export const fetchSessionMessages = (sessionId: string) => ({
  type: FETCH_SESSION_MESSAGES,
  payload: sessionId,
});

export const fetchSessionMessagesSuccess = (messages: any[]) => ({
  type: FETCH_SESSION_MESSAGES_SUCCESS,
  payload: messages,
});

export const fetchSessionMessagesFailure = (error: string) => ({
  type: FETCH_SESSION_MESSAGES_FAILURE,
  payload: error,
});

export const setCurrentSessionId = (sessionId: string | null) => ({
  type: SET_CURRENT_SESSION_ID,
  payload: sessionId,
});

export const updateSessionId = (sessionId: string) => ({
  type: UPDATE_SESSION_ID,
  payload: sessionId,
});

export const deleteChatSession = (sessionId: string) => ({
  type: DELETE_CHAT_SESSION,
  payload: sessionId,
});

export const deleteChatSessionSuccess = (sessionId: string) => ({
  type: DELETE_CHAT_SESSION_SUCCESS,
  payload: sessionId,
});

export const deleteChatSessionFailure = (error: string) => ({
  type: DELETE_CHAT_SESSION_FAILURE,
  payload: error,
});

export const renameChatSession = (sessionId: string, title: string) => ({
  type: RENAME_CHAT_SESSION,
  payload: { sessionId, title },
});

export const renameChatSessionSuccess = (sessionId: string, title: string) => ({
  type: RENAME_CHAT_SESSION_SUCCESS,
  payload: { sessionId, title },
});

export const renameChatSessionFailure = (error: string) => ({
  type: RENAME_CHAT_SESSION_FAILURE,
  payload: error,
});
