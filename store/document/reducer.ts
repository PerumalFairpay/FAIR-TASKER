import {
    CREATE_DOCUMENT_REQUEST, CREATE_DOCUMENT_SUCCESS, CREATE_DOCUMENT_FAILURE,
    GET_DOCUMENTS_REQUEST, GET_DOCUMENTS_SUCCESS, GET_DOCUMENTS_FAILURE,
    GET_DOCUMENT_REQUEST, GET_DOCUMENT_SUCCESS, GET_DOCUMENT_FAILURE,
    UPDATE_DOCUMENT_REQUEST, UPDATE_DOCUMENT_SUCCESS, UPDATE_DOCUMENT_FAILURE,
    DELETE_DOCUMENT_REQUEST, DELETE_DOCUMENT_SUCCESS, DELETE_DOCUMENT_FAILURE,
    CLEAR_DOCUMENT_DETAILS
} from "./actionType";

const initialState = {
    loading: false,
    documents: [],
    document: null,
    error: null,
    success: false,
    message: null,
};

const documentReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case CREATE_DOCUMENT_REQUEST:
        case GET_DOCUMENTS_REQUEST:
        case GET_DOCUMENT_REQUEST:
        case UPDATE_DOCUMENT_REQUEST:
        case DELETE_DOCUMENT_REQUEST:
            return { ...state, loading: true, error: null, success: false, message: null };

        case CREATE_DOCUMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                message: action.payload.message,
                documents: [...state.documents, action.payload.data]
            };
        case GET_DOCUMENTS_SUCCESS:
            return {
                ...state,
                loading: false,
                documents: action.payload.data,
                error: null,
            };
        case GET_DOCUMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                document: action.payload.data,
                error: null,
            };
        case UPDATE_DOCUMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                message: action.payload.message,
                documents: state.documents.map((doc: any) =>
                    doc.id === action.payload.data.id ? action.payload.data : doc
                ),
                document: action.payload.data
            };
        case DELETE_DOCUMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                message: action.payload.message,
                documents: state.documents.filter((doc: any) => doc.id !== action.payload.id),
            };
        case CREATE_DOCUMENT_FAILURE:
        case GET_DOCUMENTS_FAILURE:
        case GET_DOCUMENT_FAILURE:
        case UPDATE_DOCUMENT_FAILURE:
        case DELETE_DOCUMENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false
            };

        case CLEAR_DOCUMENT_DETAILS:
            return {
                ...state,
                document: null,
                error: null,
                success: false,
                message: null
            };

        default:
            return state;
    }
};

export default documentReducer;
