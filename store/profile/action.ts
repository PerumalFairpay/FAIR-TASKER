import {
    GET_PROFILE_REQUEST, GET_PROFILE_SUCCESS, GET_PROFILE_FAILURE,
    UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS, UPDATE_PROFILE_FAILURE,
    CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE,
    RESET_PROFILE_MESSAGES
} from "./actionType";

// Get Profile
export const getProfile = () => ({
    type: GET_PROFILE_REQUEST,
});

export const getProfileSuccess = (data: any) => ({
    type: GET_PROFILE_SUCCESS,
    payload: data,
});

export const getProfileFailure = (error: string) => ({
    type: GET_PROFILE_FAILURE,
    payload: error,
});

// Update Profile
export const updateProfile = (data: FormData) => ({
    type: UPDATE_PROFILE_REQUEST,
    payload: data,
});

export const updateProfileSuccess = (data: any) => ({
    type: UPDATE_PROFILE_SUCCESS,
    payload: data,
});

export const updateProfileFailure = (error: string) => ({
    type: UPDATE_PROFILE_FAILURE,
    payload: error,
});

// Change Password
export const changePassword = (data: any) => ({
    type: CHANGE_PASSWORD_REQUEST,
    payload: data,
});

export const changePasswordSuccess = (message: string) => ({
    type: CHANGE_PASSWORD_SUCCESS,
    payload: message,
});

export const changePasswordFailure = (error: string) => ({
    type: CHANGE_PASSWORD_FAILURE,
    payload: error,
});

export const resetProfileMessages = () => ({
    type: RESET_PROFILE_MESSAGES,
});
