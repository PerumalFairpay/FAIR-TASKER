import {
    CREATE_DOCUMENT_REQUEST, CREATE_DOCUMENT_SUCCESS, CREATE_DOCUMENT_FAILURE,
    GET_DOCUMENTS_REQUEST, GET_DOCUMENTS_SUCCESS, GET_DOCUMENTS_FAILURE,
    GET_DOCUMENT_REQUEST, GET_DOCUMENT_SUCCESS, GET_DOCUMENT_FAILURE,
    UPDATE_DOCUMENT_REQUEST, UPDATE_DOCUMENT_SUCCESS, UPDATE_DOCUMENT_FAILURE,
    DELETE_DOCUMENT_REQUEST, DELETE_DOCUMENT_SUCCESS, DELETE_DOCUMENT_FAILURE,
    CLEAR_DOCUMENT_DETAILS
} from "./actionType";

// Create Document
export const createDocumentRequest = (payload: FormData) => ({
    type: CREATE_DOCUMENT_REQUEST,
    payload,
});
export const createDocumentSuccess = (response: any) => ({
    type: CREATE_DOCUMENT_SUCCESS,
    payload: response,
});
export const createDocumentFailure = (error: any) => ({
    type: CREATE_DOCUMENT_FAILURE,
    payload: error,
});

// Get All Documents
export const getDocumentsRequest = () => ({
    type: GET_DOCUMENTS_REQUEST,
});
export const getDocumentsSuccess = (response: any) => ({
    type: GET_DOCUMENTS_SUCCESS,
    payload: response,
});
export const getDocumentsFailure = (error: any) => ({
    type: GET_DOCUMENTS_FAILURE,
    payload: error,
});

// Get Single Document
export const getDocumentRequest = (id: string) => ({
    type: GET_DOCUMENT_REQUEST,
    payload: id,
});
export const getDocumentSuccess = (response: any) => ({
    type: GET_DOCUMENT_SUCCESS,
    payload: response,
});
export const getDocumentFailure = (error: any) => ({
    type: GET_DOCUMENT_FAILURE,
    payload: error,
});

// Update Document
export const updateDocumentRequest = (id: string, payload: FormData) => ({
    type: UPDATE_DOCUMENT_REQUEST,
    payload: { id, payload },
});
export const updateDocumentSuccess = (response: any) => ({
    type: UPDATE_DOCUMENT_SUCCESS,
    payload: response,
});
export const updateDocumentFailure = (error: any) => ({
    type: UPDATE_DOCUMENT_FAILURE,
    payload: error,
});

// Delete Document
export const deleteDocumentRequest = (id: string) => ({
    type: DELETE_DOCUMENT_REQUEST,
    payload: id,
});
export const deleteDocumentSuccess = (response: any) => ({
    type: DELETE_DOCUMENT_SUCCESS,
    payload: response,
});
export const deleteDocumentFailure = (error: any) => ({
    type: DELETE_DOCUMENT_FAILURE,
    payload: error,
});

// Clear Details
export const clearDocumentDetails = () => ({
    type: CLEAR_DOCUMENT_DETAILS,
});
