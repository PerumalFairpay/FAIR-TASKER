import {
    CREATE_DOCUMENT_CATEGORY_REQUEST, CREATE_DOCUMENT_CATEGORY_SUCCESS, CREATE_DOCUMENT_CATEGORY_FAILURE,
    GET_DOCUMENT_CATEGORIES_REQUEST, GET_DOCUMENT_CATEGORIES_SUCCESS, GET_DOCUMENT_CATEGORIES_FAILURE,
    GET_DOCUMENT_CATEGORY_REQUEST, GET_DOCUMENT_CATEGORY_SUCCESS, GET_DOCUMENT_CATEGORY_FAILURE,
    UPDATE_DOCUMENT_CATEGORY_REQUEST, UPDATE_DOCUMENT_CATEGORY_SUCCESS, UPDATE_DOCUMENT_CATEGORY_FAILURE,
    DELETE_DOCUMENT_CATEGORY_REQUEST, DELETE_DOCUMENT_CATEGORY_SUCCESS, DELETE_DOCUMENT_CATEGORY_FAILURE,
    CLEAR_DOCUMENT_CATEGORY_DETAILS
} from "./actionType";

// Create Document Category
export const createDocumentCategoryRequest = (payload: any) => ({
    type: CREATE_DOCUMENT_CATEGORY_REQUEST,
    payload,
});
export const createDocumentCategorySuccess = (response: any) => ({
    type: CREATE_DOCUMENT_CATEGORY_SUCCESS,
    payload: response,
});
export const createDocumentCategoryFailure = (error: any) => ({
    type: CREATE_DOCUMENT_CATEGORY_FAILURE,
    payload: error,
});

// Get All Document Categories
export const getDocumentCategoriesRequest = () => ({
    type: GET_DOCUMENT_CATEGORIES_REQUEST,
});
export const getDocumentCategoriesSuccess = (response: any) => ({
    type: GET_DOCUMENT_CATEGORIES_SUCCESS,
    payload: response,
});
export const getDocumentCategoriesFailure = (error: any) => ({
    type: GET_DOCUMENT_CATEGORIES_FAILURE,
    payload: error,
});

// Get Single Document Category
export const getDocumentCategoryRequest = (id: string) => ({
    type: GET_DOCUMENT_CATEGORY_REQUEST,
    payload: id,
});
export const getDocumentCategorySuccess = (response: any) => ({
    type: GET_DOCUMENT_CATEGORY_SUCCESS,
    payload: response,
});
export const getDocumentCategoryFailure = (error: any) => ({
    type: GET_DOCUMENT_CATEGORY_FAILURE,
    payload: error,
});

// Update Document Category
export const updateDocumentCategoryRequest = (id: string, payload: any) => ({
    type: UPDATE_DOCUMENT_CATEGORY_REQUEST,
    payload: { id, payload },
});
export const updateDocumentCategorySuccess = (response: any) => ({
    type: UPDATE_DOCUMENT_CATEGORY_SUCCESS,
    payload: response,
});
export const updateDocumentCategoryFailure = (error: any) => ({
    type: UPDATE_DOCUMENT_CATEGORY_FAILURE,
    payload: error,
});

// Delete Document Category
export const deleteDocumentCategoryRequest = (id: string) => ({
    type: DELETE_DOCUMENT_CATEGORY_REQUEST,
    payload: id,
});
export const deleteDocumentCategorySuccess = (response: any) => ({
    type: DELETE_DOCUMENT_CATEGORY_SUCCESS,
    payload: response,
});
export const deleteDocumentCategoryFailure = (error: any) => ({
    type: DELETE_DOCUMENT_CATEGORY_FAILURE,
    payload: error,
});

// Clear Details
export const clearDocumentCategoryDetails = () => ({
    type: CLEAR_DOCUMENT_CATEGORY_DETAILS,
});
