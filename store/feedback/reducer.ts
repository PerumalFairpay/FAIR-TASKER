import {
  CREATE_FEEDBACK_REQUEST,
  CREATE_FEEDBACK_SUCCESS,
  CREATE_FEEDBACK_FAILURE,
  GET_FEEDBACKS_REQUEST,
  GET_FEEDBACKS_SUCCESS,
  GET_FEEDBACKS_FAILURE,
  UPDATE_FEEDBACK_REQUEST,
  UPDATE_FEEDBACK_SUCCESS,
  UPDATE_FEEDBACK_FAILURE,
  DELETE_FEEDBACK_REQUEST,
  DELETE_FEEDBACK_SUCCESS,
  DELETE_FEEDBACK_FAILURE,
  CLEAR_FEEDBACK_DETAILS,
} from "./actionType";

interface FeedbackState {
  feedbacks: any[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialFeedbackState: FeedbackState = {
  feedbacks: [],
  loading: false,
  error: null,
  success: null,
};

const feedbackReducer = (
  state: FeedbackState = initialFeedbackState,
  action: any,
): FeedbackState => {
  switch (action.type) {
    // Create
    case CREATE_FEEDBACK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: null,
      };
    case CREATE_FEEDBACK_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload.message,
        feedbacks: [action.payload.data, ...state.feedbacks],
      };
    case CREATE_FEEDBACK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get All
    case GET_FEEDBACKS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_FEEDBACKS_SUCCESS:
      return {
        ...state,
        loading: false,
        feedbacks: action.payload.data,
      };
    case GET_FEEDBACKS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Update
    case UPDATE_FEEDBACK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: null,
      };
    case UPDATE_FEEDBACK_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload.message,
        feedbacks: state.feedbacks.map((item) =>
          item.id === action.payload.data.id ? action.payload.data : item,
        ),
      };
    case UPDATE_FEEDBACK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Delete
    case DELETE_FEEDBACK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: null,
      };
    case DELETE_FEEDBACK_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload.message,
        feedbacks: state.feedbacks.filter(
          (item) => item.id !== action.payload.id,
        ),
      };
    case DELETE_FEEDBACK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_FEEDBACK_DETAILS:
      return {
        ...state,
        error: null,
        success: null,
      };

    default:
      return state;
  }
};

export default feedbackReducer;
