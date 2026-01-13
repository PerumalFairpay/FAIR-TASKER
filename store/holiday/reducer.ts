import {
    CREATE_HOLIDAY_REQUEST, CREATE_HOLIDAY_SUCCESS, CREATE_HOLIDAY_FAILURE,
    GET_HOLIDAYS_REQUEST, GET_HOLIDAYS_SUCCESS, GET_HOLIDAYS_FAILURE,
    GET_HOLIDAY_REQUEST, GET_HOLIDAY_SUCCESS, GET_HOLIDAY_FAILURE,
    UPDATE_HOLIDAY_REQUEST, UPDATE_HOLIDAY_SUCCESS, UPDATE_HOLIDAY_FAILURE,
    DELETE_HOLIDAY_REQUEST, DELETE_HOLIDAY_SUCCESS, DELETE_HOLIDAY_FAILURE,
    CLEAR_HOLIDAY_DETAILS
} from "./actionType";

interface HolidayState {
    holidays: any[];
    holiday: any | null;
    loading: boolean;
    error: string | null;
    success: string | null;
}

const initialHolidayState: HolidayState = {
    holidays: [],
    holiday: null,
    loading: false,
    error: null,
    success: null,
};

const holidayReducer = (state: HolidayState = initialHolidayState, action: any): HolidayState => {
    switch (action.type) {
        // Create
        case CREATE_HOLIDAY_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: null,
            };
        case CREATE_HOLIDAY_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.message,
                holidays: [...state.holidays, action.payload.data],
            };
        case CREATE_HOLIDAY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Get All
        case GET_HOLIDAYS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_HOLIDAYS_SUCCESS:
            return {
                ...state,
                loading: false,
                holidays: action.payload.data,
            };
        case GET_HOLIDAYS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Get Single
        case GET_HOLIDAY_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                holiday: null,
            };
        case GET_HOLIDAY_SUCCESS:
            return {
                ...state,
                loading: false,
                holiday: action.payload.data,
            };
        case GET_HOLIDAY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Update
        case UPDATE_HOLIDAY_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: null,
            };
        case UPDATE_HOLIDAY_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.message,
                holidays: state.holidays.map(h =>
                    h.id === action.payload.data.id ? action.payload.data : h
                ),
                holiday: action.payload.data,
            };
        case UPDATE_HOLIDAY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Delete
        case DELETE_HOLIDAY_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: null,
            };
        case DELETE_HOLIDAY_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.message,
                holidays: state.holidays.filter(h => h.id !== action.payload.id),
            };
        case DELETE_HOLIDAY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case CLEAR_HOLIDAY_DETAILS:
            return {
                ...state,
                error: null,
                success: null,
                holiday: null,
            };

        default:
            return state;
    }
};

export default holidayReducer;
