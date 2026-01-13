import {
    CREATE_EXPENSE_REQUEST, CREATE_EXPENSE_SUCCESS, CREATE_EXPENSE_FAILURE,
    GET_EXPENSES_REQUEST, GET_EXPENSES_SUCCESS, GET_EXPENSES_FAILURE,
    GET_EXPENSE_REQUEST, GET_EXPENSE_SUCCESS, GET_EXPENSE_FAILURE,
    UPDATE_EXPENSE_REQUEST, UPDATE_EXPENSE_SUCCESS, UPDATE_EXPENSE_FAILURE,
    DELETE_EXPENSE_REQUEST, DELETE_EXPENSE_SUCCESS, DELETE_EXPENSE_FAILURE,
    CLEAR_EXPENSE_DETAILS
} from "./actionType";

const initialState = {
    loading: false,
    expenses: [],
    expense: null,
    error: null,
    success: false,
    message: null,
};

const expenseReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case CREATE_EXPENSE_REQUEST:
        case GET_EXPENSES_REQUEST:
        case GET_EXPENSE_REQUEST:
        case UPDATE_EXPENSE_REQUEST:
        case DELETE_EXPENSE_REQUEST:
            return { ...state, loading: true, error: null, success: false, message: null };

        case CREATE_EXPENSE_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                message: action.payload.message,
                expenses: [...state.expenses, action.payload.data]
            };
        case GET_EXPENSES_SUCCESS:
            return {
                ...state,
                loading: false,
                expenses: action.payload.data,
                error: null,
            };
        case GET_EXPENSE_SUCCESS:
            return {
                ...state,
                loading: false,
                expense: action.payload.data,
                error: null,
            };
        case UPDATE_EXPENSE_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                message: action.payload.message,
                expenses: state.expenses.map((exp: any) =>
                    exp.id === action.payload.data.id ? action.payload.data : exp
                ),
                expense: action.payload.data
            };
        case DELETE_EXPENSE_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                message: action.payload.message,
                expenses: state.expenses.filter((exp: any) => exp.id !== action.payload.id),
            };
        case CREATE_EXPENSE_FAILURE:
        case GET_EXPENSES_FAILURE:
        case GET_EXPENSE_FAILURE:
        case UPDATE_EXPENSE_FAILURE:
        case DELETE_EXPENSE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false
            };
        case CLEAR_EXPENSE_DETAILS:
            return {
                ...state,
                expense: null,
                error: null,
                success: false,
                message: null
            };
        default:
            return state;
    }
};

export default expenseReducer;
