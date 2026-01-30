import {
  GET_SETTINGS_REQUEST,
  GET_SETTINGS_SUCCESS,
  GET_SETTINGS_FAILURE,
  GET_PUBLIC_SETTINGS_REQUEST,
  GET_PUBLIC_SETTINGS_SUCCESS,
  GET_PUBLIC_SETTINGS_FAILURE,
  UPDATE_SETTINGS_REQUEST,
  UPDATE_SETTINGS_SUCCESS,
  UPDATE_SETTINGS_FAILURE,
} from "./actionType";

// Get Settings
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

// Get Public Settings
export const getPublicSettingsRequest = () => ({
  type: GET_PUBLIC_SETTINGS_REQUEST,
});

export const getPublicSettingsSuccess = (payload: any) => ({
  type: GET_PUBLIC_SETTINGS_SUCCESS,
  payload,
});

export const getPublicSettingsFailure = (payload: any) => ({
  type: GET_PUBLIC_SETTINGS_FAILURE,
  payload,
});

// Update Settings
export const updateSettingsRequest = (payload: any) => ({
  type: UPDATE_SETTINGS_REQUEST,
  payload,
});

export const updateSettingsSuccess = (payload: any) => ({
  type: UPDATE_SETTINGS_SUCCESS,
  payload,
});

export const updateSettingsFailure = (payload: any) => ({
  type: UPDATE_SETTINGS_FAILURE,
  payload,
});
