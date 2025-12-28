import {
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
    REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE,
    LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE,
    CLEAR_AUTH
} from "./actionType";

interface AuthState {
    loginLoading: boolean;
    registerLoading: boolean;
    logoutLoading: boolean;

    loginError: string | null;
    registerError: string | null;
    logoutError: string | null;

    loginSuccess: string | null;
    registerSuccess: string | null;
    logoutSuccess: string | null;

    user: any | null;
    token: string | null;
}

const initialAuthState: AuthState = {
    loginLoading: false,
    registerLoading: false,
    logoutLoading: false,

    loginError: null,
    registerError: null,
    logoutError: null,

    loginSuccess: null,
    registerSuccess: null,
    logoutSuccess: null,

    user: null,
    token: null,
};

const authReducer = (state: AuthState = initialAuthState, action: any): AuthState => {
    switch (action.type) {
        // Login
        case LOGIN_REQUEST:
            return {
                ...state,
                loginLoading: true,
                loginError: null,
                loginSuccess: null,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                loginLoading: false,
                loginSuccess: action.payload.message,
                token: action.payload.token,
                // Note: User might need to be fetched separately or included in login response
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                loginLoading: false,
                loginError: action.payload,
            };

        // Register
        case REGISTER_REQUEST:
            return {
                ...state,
                registerLoading: true,
                registerError: null,
                registerSuccess: null,
            };
        case REGISTER_SUCCESS:
            return {
                ...state,
                registerLoading: false,
                registerSuccess: action.payload.message,
            };
        case REGISTER_FAILURE:
            return {
                ...state,
                registerLoading: false,
                registerError: action.payload,
            };

        // Logout
        case LOGOUT_REQUEST:
            return {
                ...state,
                logoutLoading: true,
                logoutError: null,
                logoutSuccess: null,
            };
        case LOGOUT_SUCCESS:
            return {
                ...state,
                logoutLoading: false,
                logoutSuccess: action.payload.message,
                user: null,
                token: null,
            };
        case LOGOUT_FAILURE:
            return {
                ...state,
                logoutLoading: false,
                logoutError: action.payload,
            };

        case CLEAR_AUTH:
            return {
                ...state,
                loginError: null,
                registerError: null,
                logoutError: null,
                loginSuccess: null,
                registerSuccess: null,
                logoutSuccess: null,
            };

        default:
            return state;
    }
};

export default authReducer;
