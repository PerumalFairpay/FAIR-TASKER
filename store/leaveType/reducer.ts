import {
    CREATE_LEAVE_TYPE_REQUEST, CREATE_LEAVE_TYPE_SUCCESS, CREATE_LEAVE_TYPE_FAILURE,
    GET_LEAVE_TYPES_REQUEST, GET_LEAVE_TYPES_SUCCESS, GET_LEAVE_TYPES_FAILURE,
    GET_LEAVE_TYPE_REQUEST, GET_LEAVE_TYPE_SUCCESS, GET_LEAVE_TYPE_FAILURE,
    UPDATE_LEAVE_TYPE_REQUEST, UPDATE_LEAVE_TYPE_SUCCESS, UPDATE_LEAVE_TYPE_FAILURE,
    DELETE_LEAVE_TYPE_REQUEST, DELETE_LEAVE_TYPE_SUCCESS, DELETE_LEAVE_TYPE_FAILURE,
    CLEAR_LEAVE_TYPE_DETAILS
} from "./actionType";

interface LeaveTypeState {
    leaveTypes: any[];
    leaveType: any | null;
    loading: boolean;
    error: string | null;
    success: string | null;
}

const initialLeaveTypeState: LeaveTypeState = {
    leaveTypes: [],
    leaveType: null,
    loading: false,
    error: null,
    success: null,
};

const leaveTypeReducer = (state: LeaveTypeState = initialLeaveTypeState, action: any): LeaveTypeState => {
    switch (action.type) {
        // Create
        case CREATE_LEAVE_TYPE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: null,
            };
        case CREATE_LEAVE_TYPE_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.message,
                leaveTypes: [...state.leaveTypes, action.payload.data],
            };
        case CREATE_LEAVE_TYPE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Get All
        case GET_LEAVE_TYPES_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_LEAVE_TYPES_SUCCESS:
            return {
                ...state,
                loading: false,
                leaveTypes: action.payload.data,
            };
        case GET_LEAVE_TYPES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Get Single
        case GET_LEAVE_TYPE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                leaveType: null,
            };
        case GET_LEAVE_TYPE_SUCCESS:
            return {
                ...state,
                loading: false,
                leaveType: action.payload.data,
            };
        case GET_LEAVE_TYPE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Update
        case UPDATE_LEAVE_TYPE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: null,
            };
        case UPDATE_LEAVE_TYPE_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.message,
                leaveTypes: state.leaveTypes.map(lt =>
                    lt.id === action.payload.data.id ? action.payload.data : lt
                ),
                leaveType: action.payload.data,
            };
        case UPDATE_LEAVE_TYPE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Delete
        case DELETE_LEAVE_TYPE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: null,
            };
        case DELETE_LEAVE_TYPE_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.message,
                leaveTypes: state.leaveTypes.filter(lt => lt.id !== action.payload.id),
            };
        case DELETE_LEAVE_TYPE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case CLEAR_LEAVE_TYPE_DETAILS:
            return {
                ...state,
                error: null,
                success: null,
                leaveType: null,
            };

        default:
            return state;
    }
};

export default leaveTypeReducer;
