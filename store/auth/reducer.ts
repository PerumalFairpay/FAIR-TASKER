import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    CLEAR_AUTH
} from "./actionType";

const initialState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    message: null,
};

const authReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                message: null,
            };
        case REGISTER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                message: null,
            };
        case LOGOUT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                message: null,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload.data,
                message: action.payload.message, // Assuming message works this way or is part of payload
                error: null,
            };
        case REGISTER_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload, // Register API returns full user object
                error: null,
            };
        case LOGOUT_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                message: "Logout successful",
                error: null,
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case REGISTER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case LOGOUT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case CLEAR_AUTH:
            return {
                ...state,
                error: null,
                message: null,
                loading: false
            };
        default:
            return state;
    }
};

export default authReducer;
