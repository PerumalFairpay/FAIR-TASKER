import {
    GET_PROFILE_REQUEST, GET_PROFILE_SUCCESS, GET_PROFILE_FAILURE,
    UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS, UPDATE_PROFILE_FAILURE,
    CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE
} from "./actionType";

const initialState = {
    profile: null,
    loading: false,
    error: null,
    profileSuccess: null,
    profileError: null,
    passwordSuccess: null,
    passwordError: null,
};

const profileReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case GET_PROFILE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case UPDATE_PROFILE_REQUEST:
            return {
                ...state,
                loading: true,
                profileSuccess: null,
                profileError: null,
            };
        case CHANGE_PASSWORD_REQUEST:
            return {
                ...state,
                loading: true,
                passwordSuccess: null,
                passwordError: null,
            };
        case GET_PROFILE_SUCCESS:
            return {
                ...state,
                loading: false,
                profile: action.payload.data,
                error: null,
            };
        case UPDATE_PROFILE_SUCCESS:
            return {
                ...state,
                loading: false,
                profile: action.payload.data,
                profileSuccess: action.payload.message || "Profile updated successfully",
                profileError: null,
            };
        case CHANGE_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                passwordSuccess: action.payload,
                passwordError: null,
            };
        case GET_PROFILE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case UPDATE_PROFILE_FAILURE:
            return {
                ...state,
                loading: false,
                profileError: action.payload,
            };
        case CHANGE_PASSWORD_FAILURE:
            return {
                ...state,
                loading: false,
                passwordError: action.payload,
            };
        default:
            return state;
    }
};

export default profileReducer;
