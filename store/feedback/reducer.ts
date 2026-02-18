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
  CLEAR_FEEDBACK,
} from "./actionType";

interface FeedbackState {
  feedbacks: any[];
  metrics: {
    total: number;
    by_type: {
      Bug: number;
      "Feature Request": number;
      General: number;
    };
    by_status: {
      Open: number;
      "In Review": number;
      Resolved: number;
      Closed: number;
    };
  } | null;

  createLoading: boolean;
  createSuccess: string | null;
  createError: string | null;

  listLoading: boolean;
  listSuccess: string | null;
  listError: string | null;

  updateLoading: boolean;
  updateSuccess: string | null;
  updateError: string | null;

  deleteLoading: boolean;
  deleteSuccess: string | null;
  deleteError: string | null;
}

const initialFeedbackState: FeedbackState = {
  feedbacks: [],
  metrics: null,

  createLoading: false,
  createSuccess: null,
  createError: null,

  listLoading: false,
  listSuccess: null,
  listError: null,

  updateLoading: false,
  updateSuccess: null,
  updateError: null,

  deleteLoading: false,
  deleteSuccess: null,
  deleteError: null,
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
        createLoading: true,
        createError: null,
        createSuccess: null,
      };
    case CREATE_FEEDBACK_SUCCESS:
      return {
        ...state,
        createLoading: false,
        createSuccess:
          action.payload.message || "Feedback submitted successfully",
        feedbacks: [action.payload.data, ...state.feedbacks],
      };
    case CREATE_FEEDBACK_FAILURE:
      return {
        ...state,
        createLoading: false,
        createError: action.payload,
      };

    // Get
    case GET_FEEDBACKS_REQUEST:
      return {
        ...state,
        listLoading: true,
        listError: null,
      };
    case GET_FEEDBACKS_SUCCESS:
      return {
        ...state,
        listLoading: false,
        feedbacks: action.payload.data,
        metrics: action.payload.meta,
      };
    case GET_FEEDBACKS_FAILURE:
      return {
        ...state,
        listLoading: false,
        listError: action.payload,
      };

    // Update
    case UPDATE_FEEDBACK_REQUEST:
      return {
        ...state,
        updateLoading: true,
        updateError: null,
        updateSuccess: null,
      };
    case UPDATE_FEEDBACK_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        updateSuccess:
          action.payload.message || "Feedback updated successfully",
        feedbacks: state.feedbacks.map((item) =>
          item.id === action.payload.data.id ? action.payload.data : item,
        ),
      };
    case UPDATE_FEEDBACK_FAILURE:
      return {
        ...state,
        updateLoading: false,
        updateError: action.payload,
      };

    // Delete
    case DELETE_FEEDBACK_REQUEST:
      return {
        ...state,
        deleteLoading: true,
        deleteError: null,
        deleteSuccess: null,
      };
    case DELETE_FEEDBACK_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        deleteSuccess:
          action.payload.message || "Feedback deleted successfully",
        feedbacks: state.feedbacks.filter(
          (item) => item.id !== action.payload.id,
        ),
      };
    case DELETE_FEEDBACK_FAILURE:
      return {
        ...state,
        deleteLoading: false,
        deleteError: action.payload,
      };

    case CLEAR_FEEDBACK:
      return {
        ...state,
        createLoading: false,
        createSuccess: null,
        createError: null,
        listLoading: false,
        listSuccess: null,
        listError: null,
        updateLoading: false,
        updateSuccess: null,
        updateError: null,
        deleteLoading: false,
        deleteSuccess: null,
        deleteError: null,
      };

    default:
      return state;
  }
};

export default feedbackReducer;
