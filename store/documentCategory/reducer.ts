import {
    CREATE_DOCUMENT_CATEGORY_REQUEST, CREATE_DOCUMENT_CATEGORY_SUCCESS, CREATE_DOCUMENT_CATEGORY_FAILURE,
    GET_DOCUMENT_CATEGORIES_REQUEST, GET_DOCUMENT_CATEGORIES_SUCCESS, GET_DOCUMENT_CATEGORIES_FAILURE,
    GET_DOCUMENT_CATEGORY_REQUEST, GET_DOCUMENT_CATEGORY_SUCCESS, GET_DOCUMENT_CATEGORY_FAILURE,
    UPDATE_DOCUMENT_CATEGORY_REQUEST, UPDATE_DOCUMENT_CATEGORY_SUCCESS, UPDATE_DOCUMENT_CATEGORY_FAILURE,
    DELETE_DOCUMENT_CATEGORY_REQUEST, DELETE_DOCUMENT_CATEGORY_SUCCESS, DELETE_DOCUMENT_CATEGORY_FAILURE,
    CLEAR_DOCUMENT_CATEGORY_DETAILS
} from "./actionType";

const initialState = {
    loading: false,
    documentCategories: [],
    documentCategory: null,
    error: null,
    success: false,
    message: null,
};

const documentCategoryReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case CREATE_DOCUMENT_CATEGORY_REQUEST:
        case GET_DOCUMENT_CATEGORIES_REQUEST:
        case GET_DOCUMENT_CATEGORY_REQUEST:
        case UPDATE_DOCUMENT_CATEGORY_REQUEST:
        case DELETE_DOCUMENT_CATEGORY_REQUEST:
            return { ...state, loading: true, error: null, success: false, message: null };

        case CREATE_DOCUMENT_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                message: action.payload.message,
                documentCategories: [...state.documentCategories, action.payload.data]
            };
        case GET_DOCUMENT_CATEGORIES_SUCCESS:
            return {
                ...state,
                loading: false,
                documentCategories: action.payload.data,
                error: null,
            };
        case GET_DOCUMENT_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                documentCategory: action.payload.data,
                error: null,
            };
        case UPDATE_DOCUMENT_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                message: action.payload.message,
                documentCategories: state.documentCategories.map((cat: any) =>
                    cat.id === action.payload.data.id ? action.payload.data : cat
                ),
                documentCategory: action.payload.data
            };
        case DELETE_DOCUMENT_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                message: action.payload.message,
                documentCategories: state.documentCategories.filter((cat: any) => cat.id !== action.payload.id),
            };
        case CREATE_DOCUMENT_CATEGORY_FAILURE:
        case GET_DOCUMENT_CATEGORIES_FAILURE:
        case GET_DOCUMENT_CATEGORY_FAILURE:
        case UPDATE_DOCUMENT_CATEGORY_FAILURE:
        case DELETE_DOCUMENT_CATEGORY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false
            };

        case CLEAR_DOCUMENT_CATEGORY_DETAILS:
            return {
                ...state,
                documentCategory: null,
                error: null,
                success: false,
                message: null
            };

        default:
            return state;
    }
};

export default documentCategoryReducer;
