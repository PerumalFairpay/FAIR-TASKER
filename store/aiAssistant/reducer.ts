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
  DELETE_CHAT_SESSION_SUCCESS,
  RENAME_CHAT_SESSION_SUCCESS,
} from "./actionType";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  updated_at: string;
  last_message?: string;
}

interface AIAssistantState {
  messages: Message[];
  sessions: ChatSession[];
  currentSessionId: string | null;
  loading: boolean;
  sessionsLoading: boolean;
  messagesLoading: boolean;
  error: string | null;
}

const initialState: AIAssistantState = {
  messages: [],
  sessions: [],
  currentSessionId: null,
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
        // Append to existing assistant message
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
        // Start a new assistant message
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
        currentSessionId: null,
      };

    case FETCH_CHAT_SESSIONS:
      return {
        ...state,
        sessionsLoading: true,
      };
    case FETCH_CHAT_SESSIONS_SUCCESS:
      return {
        ...state,
        sessionsLoading: false,
        sessions: action.payload,
      };
    case FETCH_CHAT_SESSIONS_FAILURE:
      return {
        ...state,
        sessionsLoading: false,
        error: action.payload,
      };

    case FETCH_SESSION_MESSAGES:
      return {
        ...state,
        messagesLoading: true,
        messages: [], // Clear current messages while loading history
      };
    case FETCH_SESSION_MESSAGES_SUCCESS:
      return {
        ...state,
        messagesLoading: false,
        messages: action.payload,
      };
    case FETCH_SESSION_MESSAGES_FAILURE:
      return {
        ...state,
        messagesLoading: false,
        error: action.payload,
      };

    case SET_CURRENT_SESSION_ID:
      return {
        ...state,
        currentSessionId: action.payload,
        messages: action.payload === null ? [] : state.messages,
      };

    case UPDATE_SESSION_ID:
      return {
        ...state,
        currentSessionId: action.payload,
      };

    case DELETE_CHAT_SESSION_SUCCESS:
      return {
        ...state,
        sessions: state.sessions.filter(s => s.id !== action.payload),
        currentSessionId: state.currentSessionId === action.payload ? null : state.currentSessionId,
        messages: state.currentSessionId === action.payload ? [] : state.messages,
      };

    case RENAME_CHAT_SESSION_SUCCESS:
      return {
        ...state,
        sessions: state.sessions.map(s => 
          s.id === action.payload.sessionId ? { ...s, title: action.payload.title } : s
        ),
      };

    default:
      return state;
  }
};

export default aiAssistantReducer;
