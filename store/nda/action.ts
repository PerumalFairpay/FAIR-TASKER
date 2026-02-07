import {
  GENERATE_NDA_REQUEST,
  GENERATE_NDA_SUCCESS,
  GENERATE_NDA_FAILURE,
  GET_NDA_LIST_REQUEST,
  GET_NDA_LIST_SUCCESS,
  GET_NDA_LIST_FAILURE,
  GET_NDA_BY_TOKEN_REQUEST,
  GET_NDA_BY_TOKEN_SUCCESS,
  GET_NDA_BY_TOKEN_FAILURE,
  UPLOAD_NDA_DOCUMENTS_REQUEST,
  UPLOAD_NDA_DOCUMENTS_SUCCESS,
  UPLOAD_NDA_DOCUMENTS_FAILURE,
  SIGN_NDA_REQUEST,
  SIGN_NDA_SUCCESS,
  SIGN_NDA_FAILURE,
  REGENERATE_NDA_REQUEST,
  REGENERATE_NDA_SUCCESS,
  REGENERATE_NDA_FAILURE,
  CLEAR_NDA_STATE,
} from "./actionType";

// Generate NDA Link
export const generateNDARequest = (payload: {
  employee_name: string;
  email: string;
  mobile: string;
  role: string;
  address: string;
  residential_address: string;
  expires_in_hours: number;
  required_documents: string[];
}) => ({
  type: GENERATE_NDA_REQUEST,
  payload,
});
export const generateNDASuccess = (response: any) => ({
  type: GENERATE_NDA_SUCCESS,
  payload: response,
});
export const generateNDAFailure = (error: any) => ({
  type: GENERATE_NDA_FAILURE,
  payload: error,
});

// Get NDA List
export const getNDAListRequest = (
  payload: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string | null;
  } = { page: 1, limit: 10 },
) => ({
  type: GET_NDA_LIST_REQUEST,
  payload,
});
export const getNDAListSuccess = (response: any) => ({
  type: GET_NDA_LIST_SUCCESS,
  payload: response,
});
export const getNDAListFailure = (error: any) => ({
  type: GET_NDA_LIST_FAILURE,
  payload: error,
});

// Get NDA by Token
export const getNDAByTokenRequest = (token: string) => ({
  type: GET_NDA_BY_TOKEN_REQUEST,
  payload: token,
});
export const getNDAByTokenSuccess = (response: any) => ({
  type: GET_NDA_BY_TOKEN_SUCCESS,
  payload: response,
});
export const getNDAByTokenFailure = (error: any) => ({
  type: GET_NDA_BY_TOKEN_FAILURE,
  payload: error,
});

// Upload Documents
export const uploadNDADocumentsRequest = (
  token: string,
  formData: FormData,
) => ({
  type: UPLOAD_NDA_DOCUMENTS_REQUEST,
  payload: { token, formData },
});
export const uploadNDADocumentsSuccess = (response: any) => ({
  type: UPLOAD_NDA_DOCUMENTS_SUCCESS,
  payload: response,
});
export const uploadNDADocumentsFailure = (error: any) => ({
  type: UPLOAD_NDA_DOCUMENTS_FAILURE,
  payload: error,
});

// Sign NDA
export const signNDARequest = (
  token: string,
  signature: string,
  deviceDetails?: any,
) => ({
  type: SIGN_NDA_REQUEST,
  payload: { token, signature, ...deviceDetails },
});
export const signNDASuccess = (response: any) => ({
  type: SIGN_NDA_SUCCESS,
  payload: response,
});
export const signNDAFailure = (error: any) => ({
  type: SIGN_NDA_FAILURE,
  payload: error,
});

// Regenerate NDA Link
// Regenerate NDA Link
export const regenerateNDARequest = (payload: {
  ndaId: string;
  expires_in_hours: number;
}) => ({
  type: REGENERATE_NDA_REQUEST,
  payload,
});
export const regenerateNDASuccess = (response: any) => ({
  type: REGENERATE_NDA_SUCCESS,
  payload: response,
});
export const regenerateNDAFailure = (error: any) => ({
  type: REGENERATE_NDA_FAILURE,
  payload: error,
});

// Clear State
export const clearNDAState = () => ({
  type: CLEAR_NDA_STATE,
});
