import {
    CREATE_EXPENSE_CATEGORY_REQUEST, CREATE_EXPENSE_CATEGORY_SUCCESS, CREATE_EXPENSE_CATEGORY_FAILURE,
    GET_EXPENSE_CATEGORIES_REQUEST, GET_EXPENSE_CATEGORIES_SUCCESS, GET_EXPENSE_CATEGORIES_FAILURE,
    GET_EXPENSE_CATEGORY_REQUEST, GET_EXPENSE_CATEGORY_SUCCESS, GET_EXPENSE_CATEGORY_FAILURE,
    UPDATE_EXPENSE_CATEGORY_REQUEST, UPDATE_EXPENSE_CATEGORY_SUCCESS, UPDATE_EXPENSE_CATEGORY_FAILURE,
    DELETE_EXPENSE_CATEGORY_REQUEST, DELETE_EXPENSE_CATEGORY_SUCCESS, DELETE_EXPENSE_CATEGORY_FAILURE,
    CLEAR_EXPENSE_CATEGORY_DETAILS
} from "./actionType";

const initialState = {
    loading: false,
    expenseCategories: [],
    expenseCategory: null,
    error: null,
    success: false,
    message: null,
};

const expenseCategoryReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case CREATE_EXPENSE_CATEGORY_REQUEST:
        case GET_EXPENSE_CATEGORIES_REQUEST:
        case GET_EXPENSE_CATEGORY_REQUEST:
        case UPDATE_EXPENSE_CATEGORY_REQUEST:
        case DELETE_EXPENSE_CATEGORY_REQUEST:
            return { ...state, loading: true, error: null, success: false, message: null };

        case CREATE_EXPENSE_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                message: action.payload.message,
                expenseCategories: [...state.expenseCategories, action.payload.data]
            };
        case GET_EXPENSE_CATEGORIES_SUCCESS:
            return {
                ...state,
                loading: false,
                expenseCategories: action.payload.data,
                error: null,
            };
        case GET_EXPENSE_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                expenseCategory: action.payload.data,
                error: null,
            };
        case UPDATE_EXPENSE_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                message: action.payload.message,
                expenseCategories: state.expenseCategories.map((cat: any) =>
                    cat.id === action.payload.data.id ? action.payload.data : cat
                ),
                expenseCategory: action.payload.data
            };
        case DELETE_EXPENSE_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                message: action.payload.message,
                expenseCategories: state.expenseCategories.filter((cat: any) => cat.id !== action.payload.id),
            };
        case CREATE_EXPENSE_CATEGORY_FAILURE:
        case GET_EXPENSE_CATEGORIES_FAILURE:
        case GET_EXPENSE_CATEGORY_FAILURE:
        case UPDATE_EXPENSE_CATEGORY_FAILURE:
        case DELETE_EXPENSE_CATEGORY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false
            };

        case CLEAR_EXPENSE_CATEGORY_DETAILS:
            return {
                ...state,
                expenseCategory: null,
                error: null,
                success: false,
                message: null
            };

        default:
            return state;
    }
};

export default expenseCategoryReducer;
