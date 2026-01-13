import {
    CREATE_EXPENSE_REQUEST, CREATE_EXPENSE_SUCCESS, CREATE_EXPENSE_FAILURE,
    GET_EXPENSES_REQUEST, GET_EXPENSES_SUCCESS, GET_EXPENSES_FAILURE,
    GET_EXPENSE_REQUEST, GET_EXPENSE_SUCCESS, GET_EXPENSE_FAILURE,
    UPDATE_EXPENSE_REQUEST, UPDATE_EXPENSE_SUCCESS, UPDATE_EXPENSE_FAILURE,
    DELETE_EXPENSE_REQUEST, DELETE_EXPENSE_SUCCESS, DELETE_EXPENSE_FAILURE,
    CLEAR_EXPENSE_DETAILS
} from "./actionType";

// Create Expense
export const createExpenseRequest = (payload: FormData) => ({
    type: CREATE_EXPENSE_REQUEST,
    payload,
});
export const createExpenseSuccess = (response: any) => ({
    type: CREATE_EXPENSE_SUCCESS,
    payload: response,
});
export const createExpenseFailure = (error: any) => ({
    type: CREATE_EXPENSE_FAILURE,
    payload: error,
});

// Get All Expenses
export const getExpensesRequest = () => ({
    type: GET_EXPENSES_REQUEST,
});
export const getExpensesSuccess = (response: any) => ({
    type: GET_EXPENSES_SUCCESS,
    payload: response,
});
export const getExpensesFailure = (error: any) => ({
    type: GET_EXPENSES_FAILURE,
    payload: error,
});

// Get Single Expense
export const getExpenseRequest = (id: string) => ({
    type: GET_EXPENSE_REQUEST,
    payload: id,
});
export const getExpenseSuccess = (response: any) => ({
    type: GET_EXPENSE_SUCCESS,
    payload: response,
});
export const getExpenseFailure = (error: any) => ({
    type: GET_EXPENSE_FAILURE,
    payload: error,
});

// Update Expense
export const updateExpenseRequest = (id: string, payload: FormData) => ({
    type: UPDATE_EXPENSE_REQUEST,
    payload: { id, payload },
});
export const updateExpenseSuccess = (response: any) => ({
    type: UPDATE_EXPENSE_SUCCESS,
    payload: response,
});
export const updateExpenseFailure = (error: any) => ({
    type: UPDATE_EXPENSE_FAILURE,
    payload: error,
});

// Delete Expense
export const deleteExpenseRequest = (id: string) => ({
    type: DELETE_EXPENSE_REQUEST,
    payload: id,
});
export const deleteExpenseSuccess = (response: any) => ({
    type: DELETE_EXPENSE_SUCCESS,
    payload: response,
});
export const deleteExpenseFailure = (error: any) => ({
    type: DELETE_EXPENSE_FAILURE,
    payload: error,
});

// Clear Details
export const clearExpenseDetails = () => ({
    type: CLEAR_EXPENSE_DETAILS,
});
