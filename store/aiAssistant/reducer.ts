import {
  SEND_CHAT_QUERY,
  SEND_CHAT_QUERY_SUCCESS,
  SEND_CHAT_QUERY_FAILURE,
  CHAT_CHUNK_RECEIVED,
  CLEAR_CHAT_HISTORY,
} from "./actionType";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIAssistantState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: AIAssistantState = {
  messages: [
    { role: "assistant", content: "Hello! How can I help you today?" },
  ],
  loading: false,
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
        ...initialState,
      };
    default:
      return state;
  }
};

export default aiAssistantReducer;
