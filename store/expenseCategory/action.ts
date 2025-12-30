import {
    CREATE_EXPENSE_CATEGORY_REQUEST, CREATE_EXPENSE_CATEGORY_SUCCESS, CREATE_EXPENSE_CATEGORY_FAILURE,
    GET_EXPENSE_CATEGORIES_REQUEST, GET_EXPENSE_CATEGORIES_SUCCESS, GET_EXPENSE_CATEGORIES_FAILURE,
    GET_EXPENSE_CATEGORY_REQUEST, GET_EXPENSE_CATEGORY_SUCCESS, GET_EXPENSE_CATEGORY_FAILURE,
    UPDATE_EXPENSE_CATEGORY_REQUEST, UPDATE_EXPENSE_CATEGORY_SUCCESS, UPDATE_EXPENSE_CATEGORY_FAILURE,
    DELETE_EXPENSE_CATEGORY_REQUEST, DELETE_EXPENSE_CATEGORY_SUCCESS, DELETE_EXPENSE_CATEGORY_FAILURE,
    CLEAR_EXPENSE_CATEGORY_DETAILS
} from "./actionType";

// Create Expense Category
export const createExpenseCategoryRequest = (payload: any) => ({
    type: CREATE_EXPENSE_CATEGORY_REQUEST,
    payload,
});
export const createExpenseCategorySuccess = (response: any) => ({
    type: CREATE_EXPENSE_CATEGORY_SUCCESS,
    payload: response,
});
export const createExpenseCategoryFailure = (error: any) => ({
    type: CREATE_EXPENSE_CATEGORY_FAILURE,
    payload: error,
});

// Get All Expense Categories
export const getExpenseCategoriesRequest = () => ({
    type: GET_EXPENSE_CATEGORIES_REQUEST,
});
export const getExpenseCategoriesSuccess = (response: any) => ({
    type: GET_EXPENSE_CATEGORIES_SUCCESS,
    payload: response,
});
export const getExpenseCategoriesFailure = (error: any) => ({
    type: GET_EXPENSE_CATEGORIES_FAILURE,
    payload: error,
});

// Get Single Expense Category
export const getExpenseCategoryRequest = (id: string) => ({
    type: GET_EXPENSE_CATEGORY_REQUEST,
    payload: id,
});
export const getExpenseCategorySuccess = (response: any) => ({
    type: GET_EXPENSE_CATEGORY_SUCCESS,
    payload: response,
});
export const getExpenseCategoryFailure = (error: any) => ({
    type: GET_EXPENSE_CATEGORY_FAILURE,
    payload: error,
});

// Update Expense Category
export const updateExpenseCategoryRequest = (id: string, payload: any) => ({
    type: UPDATE_EXPENSE_CATEGORY_REQUEST,
    payload: { id, payload },
});
export const updateExpenseCategorySuccess = (response: any) => ({
    type: UPDATE_EXPENSE_CATEGORY_SUCCESS,
    payload: response,
});
export const updateExpenseCategoryFailure = (error: any) => ({
    type: UPDATE_EXPENSE_CATEGORY_FAILURE,
    payload: error,
});

// Delete Expense Category
export const deleteExpenseCategoryRequest = (id: string) => ({
    type: DELETE_EXPENSE_CATEGORY_REQUEST,
    payload: id,
});
export const deleteExpenseCategorySuccess = (response: any) => ({
    type: DELETE_EXPENSE_CATEGORY_SUCCESS,
    payload: response,
});
export const deleteExpenseCategoryFailure = (error: any) => ({
    type: DELETE_EXPENSE_CATEGORY_FAILURE,
    payload: error,
});

// Clear Details
export const clearExpenseCategoryDetails = () => ({
    type: CLEAR_EXPENSE_CATEGORY_DETAILS,
});
