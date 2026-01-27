import {
  CREATE_LEAVE_REQUEST_REQUEST,
  CREATE_LEAVE_REQUEST_SUCCESS,
  CREATE_LEAVE_REQUEST_FAILURE,
  GET_LEAVE_REQUESTS_REQUEST,
  GET_LEAVE_REQUESTS_SUCCESS,
  GET_LEAVE_REQUESTS_FAILURE,
  GET_LEAVE_REQUEST_REQUEST,
  GET_LEAVE_REQUEST_SUCCESS,
  GET_LEAVE_REQUEST_FAILURE,
  UPDATE_LEAVE_REQUEST_REQUEST,
  UPDATE_LEAVE_REQUEST_SUCCESS,
  UPDATE_LEAVE_REQUEST_FAILURE,
  UPDATE_LEAVE_STATUS_REQUEST,
  UPDATE_LEAVE_STATUS_SUCCESS,
  UPDATE_LEAVE_STATUS_FAILURE,
  DELETE_LEAVE_REQUEST_REQUEST,
  DELETE_LEAVE_REQUEST_SUCCESS,
  DELETE_LEAVE_REQUEST_FAILURE,
  CLEAR_LEAVE_REQUEST_DETAILS,
} from "./actionType";

interface LeaveRequestState {
  leaveRequests: any[];
  leaveMetrics: any[];
  leaveRequest: any | null;

  createLoading: boolean;
  createSuccess: string | null;
  createError: string | null;

  updateLoading: boolean;
  updateSuccess: string | null;
  updateError: string | null;

  deleteLoading: boolean;
  deleteSuccess: string | null;
  deleteError: string | null;

  statusLoading: boolean;
  statusSuccess: string | null;
  statusError: string | null;

  getRequestsLoading: boolean;
  getRequestsError: string | null;

  getRequestLoading: boolean;
  getRequestError: string | null;
}

const initialLeaveRequestState: LeaveRequestState = {
  leaveRequests: [],
  leaveMetrics: [],
  leaveRequest: null,

  createLoading: false,
  createSuccess: null,
  createError: null,

  updateLoading: false,
  updateSuccess: null,
  updateError: null,

  deleteLoading: false,
  deleteSuccess: null,
  deleteError: null,

  statusLoading: false,
  statusSuccess: null,
  statusError: null,

  getRequestsLoading: false,
  getRequestsError: null,

  getRequestLoading: false,
  getRequestError: null,
};

const leaveRequestReducer = (
  state: LeaveRequestState = initialLeaveRequestState,
  action: any,
): LeaveRequestState => {
  switch (action.type) {
    // Create Leave Request
    case CREATE_LEAVE_REQUEST_REQUEST:
      return {
        ...state,
        createLoading: true,
        createSuccess: null,
        createError: null,
      };
    case CREATE_LEAVE_REQUEST_SUCCESS:
      return {
        ...state,
        createLoading: false,
        createSuccess: action.payload.message,
        leaveRequests: [action.payload.data, ...state.leaveRequests],
      };
    case CREATE_LEAVE_REQUEST_FAILURE:
      return {
        ...state,
        createLoading: false,
        createError: action.payload,
      };

    // Get Leave Requests (List)
    case GET_LEAVE_REQUESTS_REQUEST:
      return {
        ...state,
        getRequestsLoading: true,
        getRequestsError: null,
      };
    case GET_LEAVE_REQUESTS_SUCCESS:
      return {
        ...state,
        getRequestsLoading: false,
        leaveRequests: action.payload.data,
        leaveMetrics: action.payload.metrics || [],
      };
    case GET_LEAVE_REQUESTS_FAILURE:
      return {
        ...state,
        getRequestsLoading: false,
        getRequestsError: action.payload,
      };

    // Get Leave Request (Single)
    case GET_LEAVE_REQUEST_REQUEST:
      return {
        ...state,
        getRequestLoading: true,
        getRequestError: null,
      };
    case GET_LEAVE_REQUEST_SUCCESS:
      return {
        ...state,
        getRequestLoading: false,
        leaveRequest: action.payload.data,
      };
    case GET_LEAVE_REQUEST_FAILURE:
      return {
        ...state,
        getRequestLoading: false,
        getRequestError: action.payload,
      };

    // Update Leave Request
    case UPDATE_LEAVE_REQUEST_REQUEST:
      return {
        ...state,
        updateLoading: true,
        updateSuccess: null,
        updateError: null,
      };
    case UPDATE_LEAVE_REQUEST_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        updateSuccess: action.payload.message,
        leaveRequests: state.leaveRequests.map((lr) =>
          lr.id === action.payload.data.id ? action.payload.data : lr,
        ),
        leaveRequest: action.payload.data,
      };
    case UPDATE_LEAVE_REQUEST_FAILURE:
      return {
        ...state,
        updateLoading: false,
        updateError: action.payload,
      };

    // Update Leave Status
    case UPDATE_LEAVE_STATUS_REQUEST:
      return {
        ...state,
        statusLoading: true,
        statusSuccess: null,
        statusError: null,
      };
    case UPDATE_LEAVE_STATUS_SUCCESS:
      return {
        ...state,
        statusLoading: false,
        statusSuccess: action.payload.message,
        leaveRequests: state.leaveRequests.map((lr) =>
          lr.id === action.payload.data.id ? action.payload.data : lr,
        ),
        leaveRequest: action.payload.data,
      };
    case UPDATE_LEAVE_STATUS_FAILURE:
      return {
        ...state,
        statusLoading: false,
        statusError: action.payload,
      };

    // Delete Leave Request
    case DELETE_LEAVE_REQUEST_REQUEST:
      return {
        ...state,
        deleteLoading: true,
        deleteSuccess: null,
        deleteError: null,
      };
    case DELETE_LEAVE_REQUEST_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        deleteSuccess: action.payload.message,
        leaveRequests: state.leaveRequests.filter(
          (lr) => lr.id !== action.payload.id,
        ),
      };
    case DELETE_LEAVE_REQUEST_FAILURE:
      return {
        ...state,
        deleteLoading: false,
        deleteError: action.payload,
      };

    case CLEAR_LEAVE_REQUEST_DETAILS:
      return {
        ...state,
        leaveRequest: null,
        createSuccess: null,
        createError: null,
        updateSuccess: null,
        updateError: null,
        deleteSuccess: null,
        deleteError: null,
        statusSuccess: null,
        statusError: null,
        getRequestsError: null,
        getRequestError: null,
      };

    default:
      return state;
  }
};

export default leaveRequestReducer;
