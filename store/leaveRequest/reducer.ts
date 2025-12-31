import {
    CREATE_LEAVE_REQUEST_REQUEST, CREATE_LEAVE_REQUEST_SUCCESS, CREATE_LEAVE_REQUEST_FAILURE,
    GET_LEAVE_REQUESTS_REQUEST, GET_LEAVE_REQUESTS_SUCCESS, GET_LEAVE_REQUESTS_FAILURE,
    GET_LEAVE_REQUEST_REQUEST, GET_LEAVE_REQUEST_SUCCESS, GET_LEAVE_REQUEST_FAILURE,
    UPDATE_LEAVE_REQUEST_REQUEST, UPDATE_LEAVE_REQUEST_SUCCESS, UPDATE_LEAVE_REQUEST_FAILURE,
    UPDATE_LEAVE_STATUS_REQUEST, UPDATE_LEAVE_STATUS_SUCCESS, UPDATE_LEAVE_STATUS_FAILURE,
    DELETE_LEAVE_REQUEST_REQUEST, DELETE_LEAVE_REQUEST_SUCCESS, DELETE_LEAVE_REQUEST_FAILURE,
    CLEAR_LEAVE_REQUEST_DETAILS
} from "./actionType";

interface LeaveRequestState {
    leaveRequests: any[];
    leaveRequest: any | null;
    loading: boolean;
    error: string | null;
    success: string | null;
}

const initialLeaveRequestState: LeaveRequestState = {
    leaveRequests: [],
    leaveRequest: null,
    loading: false,
    error: null,
    success: null,
};

const leaveRequestReducer = (state: LeaveRequestState = initialLeaveRequestState, action: any): LeaveRequestState => {
    switch (action.type) {
        case CREATE_LEAVE_REQUEST_REQUEST:
        case GET_LEAVE_REQUESTS_REQUEST:
        case GET_LEAVE_REQUEST_REQUEST:
        case UPDATE_LEAVE_REQUEST_REQUEST:
        case UPDATE_LEAVE_STATUS_REQUEST:
        case DELETE_LEAVE_REQUEST_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: null,
            };

        case CREATE_LEAVE_REQUEST_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.message,
                leaveRequests: [action.payload.data, ...state.leaveRequests],
            };

        case GET_LEAVE_REQUESTS_SUCCESS:
            return {
                ...state,
                loading: false,
                leaveRequests: action.payload.data,
            };

        case GET_LEAVE_REQUEST_SUCCESS:
            return {
                ...state,
                loading: false,
                leaveRequest: action.payload.data,
            };

        case UPDATE_LEAVE_REQUEST_SUCCESS:
        case UPDATE_LEAVE_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.message,
                leaveRequests: state.leaveRequests.map(lr =>
                    lr.id === action.payload.data.id ? action.payload.data : lr
                ),
                leaveRequest: action.payload.data,
            };

        case DELETE_LEAVE_REQUEST_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.message,
                leaveRequests: state.leaveRequests.filter(lr => lr.id !== action.payload.id),
            };

        case CREATE_LEAVE_REQUEST_FAILURE:
        case GET_LEAVE_REQUESTS_FAILURE:
        case GET_LEAVE_REQUEST_FAILURE:
        case UPDATE_LEAVE_REQUEST_FAILURE:
        case UPDATE_LEAVE_STATUS_FAILURE:
        case DELETE_LEAVE_REQUEST_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case CLEAR_LEAVE_REQUEST_DETAILS:
            return {
                ...state,
                error: null,
                success: null,
                leaveRequest: null,
            };

        default:
            return state;
    }
};

export default leaveRequestReducer;
