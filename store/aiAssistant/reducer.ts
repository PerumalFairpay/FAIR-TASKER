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

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Session {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface AIAssistantState {
  messages: Message[];
  sessions: Session[];
  activeSessionId: string | null;
  loading: boolean;
  sessionsLoading: boolean;
  messagesLoading: boolean;
  error: string | null;
}

const initialState: AIAssistantState = {
  messages: [],
  sessions: [],
  activeSessionId: null,
  loading: false,
  sessionsLoading: false,
  messagesLoading: false,
  error: null,
};

const aiAssistantReducer = (
  state = initialState,
  action: any,
): AIAssistantState => {
  switch (action.type) {
    case SEND_CHAT_QUERY:
      return {
        ...state,
        loading: true,
        error: null,
        messages: [
          ...state.messages,
          { role: "user", content: action.payload.query },
        ],
      };
    case SEND_CHAT_QUERY_SUCCESS:
      return {
        ...state,
        loading: false,
        activeSessionId: action.payload || state.activeSessionId,
      };
    case SEND_CHAT_QUERY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CHAT_CHUNK_RECEIVED: {
      const lastMessage = state.messages[state.messages.length - 1];
      if (lastMessage && lastMessage.role === "assistant" && state.loading) {
        const newMessages = [...state.messages];
        newMessages[newMessages.length - 1] = {
          ...lastMessage,
          content: lastMessage.content + action.payload,
        };
        return {
          ...state,
          messages: newMessages,
        };
      } else {
        return {
          ...state,
          messages: [
            ...state.messages,
            { role: "assistant", content: action.payload },
          ],
        };
      }
    }
    case CLEAR_CHAT_HISTORY:
      return {
        ...state,
        messages: [],
        activeSessionId: null,
      };
    
    // History Management
    case FETCH_SESSIONS:
      return { ...state, sessionsLoading: true };
    case FETCH_SESSIONS_SUCCESS:
      return { ...state, sessionsLoading: false, sessions: action.payload };
    case FETCH_SESSIONS_FAILURE:
      return { ...state, sessionsLoading: false, error: action.payload };

    case FETCH_SESSION_MESSAGES:
      return { ...state, messagesLoading: true, activeSessionId: action.payload };
    case FETCH_SESSION_MESSAGES_SUCCESS:
      return { ...state, messagesLoading: false, messages: action.payload };
    case FETCH_SESSION_MESSAGES_FAILURE:
      return { ...state, messagesLoading: false, error: action.payload };

    case DELETE_SESSION_SUCCESS:
      return {
        ...state,
        sessions: state.sessions.filter(s => s.id !== action.payload),
        activeSessionId: state.activeSessionId === action.payload ? null : state.activeSessionId,
        messages: state.activeSessionId === action.payload ? [] : state.messages,
      };

    case RENAME_SESSION_SUCCESS:
      return {
        ...state,
        sessions: state.sessions.map(s => 
          s.id === action.payload.sessionId ? { ...s, title: action.payload.title } : s
        ),
      };

    case SET_ACTIVE_SESSION:
      return { ...state, activeSessionId: action.payload };

    case START_NEW_CHAT:
      return { ...state, activeSessionId: null, messages: [] };

    default:
      return state;
  }
};

export default aiAssistantReducer;
