import {
  CREATE_NDA_REQUEST,
  CREATE_NDA_SUCCESS,
  CREATE_NDA_FAILURE,
  GET_NDA_REQUEST,
  GET_NDA_SUCCESS,
  GET_NDA_FAILURE,
  SIGN_NDA_REQUEST,
  SIGN_NDA_SUCCESS,
  SIGN_NDA_FAILURE,
  CLEAR_NDA,
} from "./actionType";

// Create NDA
export const createNdaRequest = (payload: any) => ({
  type: CREATE_NDA_REQUEST,
  payload,
});
export const createNdaSuccess = (payload: any) => ({
  type: CREATE_NDA_SUCCESS,
  payload,
});
export const createNdaFailure = (payload: any) => ({
  type: CREATE_NDA_FAILURE,
  payload,
});

// Get NDA
export const getNdaRequest = (payload: any) => ({
  type: GET_NDA_REQUEST,
  payload,
});
export const getNdaSuccess = (payload: any) => ({
  type: GET_NDA_SUCCESS,
  payload,
});
export const getNdaFailure = (payload: any) => ({
  type: GET_NDA_FAILURE,
  payload,
});

// Sign NDA
export const signNdaRequest = (payload: any) => ({
  type: SIGN_NDA_REQUEST,
  payload,
});
export const signNdaSuccess = (payload: any) => ({
  type: SIGN_NDA_SUCCESS,
  payload,
});
export const signNdaFailure = (payload: any) => ({
  type: SIGN_NDA_FAILURE,
  payload,
});

// Clear
export const clearNda = () => ({
  type: CLEAR_NDA,
});
