import {
  SEND_CHAT_QUERY,
  SEND_CHAT_QUERY_SUCCESS,
  SEND_CHAT_QUERY_FAILURE,
  CHAT_CHUNK_RECEIVED,
  CLEAR_CHAT_HISTORY,
  FETCH_SESSIONS,
  FETCH_SESSIONS_SUCCESS,
  FETCH_SESSIONS_FAILURE,
  FETCH_SESSION_MESSAGES,
  FETCH_SESSION_MESSAGES_SUCCESS,
  FETCH_SESSION_MESSAGES_FAILURE,
  DELETE_SESSION,
  DELETE_SESSION_SUCCESS,
  DELETE_SESSION_FAILURE,
  RENAME_SESSION,
  RENAME_SESSION_SUCCESS,
  RENAME_SESSION_FAILURE,
  SET_ACTIVE_SESSION,
  START_NEW_CHAT,
} from "./actionType";

export const sendChatQuery = (
  query: string,
  history: { role: string; content: string }[] = [],
  sessionId?: string,
) => ({
  type: SEND_CHAT_QUERY,
  payload: { query, history, sessionId },
});

export const sendChatQuerySuccess = (sessionId?: string) => ({
  type: SEND_CHAT_QUERY_SUCCESS,
  payload: sessionId
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

// History Management
export const fetchSessions = () => ({
  type: FETCH_SESSIONS,
});

export const fetchSessionsSuccess = (sessions: any[]) => ({
  type: FETCH_SESSIONS_SUCCESS,
  payload: sessions,
});

export const fetchSessionsFailure = (error: string) => ({
  type: FETCH_SESSIONS_FAILURE,
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

export const deleteSession = (sessionId: string) => ({
  type: DELETE_SESSION,
  payload: sessionId,
});

export const deleteSessionSuccess = (sessionId: string) => ({
  type: DELETE_SESSION_SUCCESS,
  payload: sessionId,
});

export const deleteSessionFailure = (error: string) => ({
  type: DELETE_SESSION_FAILURE,
  payload: error,
});

export const renameSession = (sessionId: string, title: string) => ({
  type: RENAME_SESSION,
  payload: { sessionId, title },
});

export const renameSessionSuccess = (sessionId: string, title: string) => ({
  type: RENAME_SESSION_SUCCESS,
  payload: { sessionId, title },
});

export const renameSessionFailure = (error: string) => ({
  type: RENAME_SESSION_FAILURE,
  payload: error,
});

export const setActiveSession = (sessionId: string) => ({
  type: SET_ACTIVE_SESSION,
  payload: sessionId,
});

export const startNewChat = () => ({
  type: START_NEW_CHAT,
});
