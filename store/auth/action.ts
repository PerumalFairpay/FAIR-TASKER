import {
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
    REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE,
    LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE,
    CLEAR_AUTH,
    GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAILURE
} from "./actionType";

export const loginRequest = (payload: any) => ({
    type: LOGIN_REQUEST,
    payload,
});
export const loginSuccess = (payload: any) => ({
    type: LOGIN_SUCCESS,
    payload,
});
export const loginFailure = (payload: any) => ({
    type: LOGIN_FAILURE,
    payload,
});

export const registerRequest = (payload: any) => ({
    type: REGISTER_REQUEST,
    payload,
});
export const registerSuccess = (payload: any) => ({
    type: REGISTER_SUCCESS,
    payload,
});
export const registerFailure = (payload: any) => ({
    type: REGISTER_FAILURE,
    payload,
});

export const logoutRequest = () => ({
    type: LOGOUT_REQUEST,
});
export const logoutSuccess = (payload: any) => ({
    type: LOGOUT_SUCCESS,
    payload,
});
export const logoutFailure = (payload: any) => ({
    type: LOGOUT_FAILURE,
    payload,
});

export const clearAuth = () => ({
    type: CLEAR_AUTH,
});

export const getUserRequest = () => ({
    type: GET_USER_REQUEST,
});
export const getUserSuccess = (payload: any) => ({
    type: GET_USER_SUCCESS,
    payload,
});
export const getUserFailure = (payload: any) => ({
    type: GET_USER_FAILURE,
    payload,
});
