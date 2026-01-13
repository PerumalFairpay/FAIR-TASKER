import {
    GET_PROFILE_REQUEST, GET_PROFILE_SUCCESS, GET_PROFILE_FAILURE,
    UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS, UPDATE_PROFILE_FAILURE,
    CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE
} from "./actionType";

const initialState = {
    profile: null,
    loading: false,
    error: null,
    successMessage: null,
};

const profileReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case GET_PROFILE_REQUEST:
        case UPDATE_PROFILE_REQUEST:
        case CHANGE_PASSWORD_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                successMessage: null,
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
                profile: action.payload.data, // Update profile with new data
                successMessage: action.payload.message || "Profile updated successfully",
                error: null,
            };
        case CHANGE_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                successMessage: action.payload,
                error: null,
            };
        case GET_PROFILE_FAILURE:
        case UPDATE_PROFILE_FAILURE:
        case CHANGE_PASSWORD_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                successMessage: null,
            };
        default:
            return state;
    }
};

export default profileReducer;
