import {
    GET_SETTINGS_REQUEST, GET_SETTINGS_SUCCESS, GET_SETTINGS_FAILURE
} from "./actionType";

export const getSettingsRequest = () => ({
    type: GET_SETTINGS_REQUEST,
});

export const getSettingsSuccess = (payload: any) => ({
    type: GET_SETTINGS_SUCCESS,
    payload,
});

export const getSettingsFailure = (payload: any) => ({
    type: GET_SETTINGS_FAILURE,
    payload,
});
