import {
    GET_EMPLOYEE_LIST_REQUEST,
    GET_EMPLOYEE_LIST_SUCCESS,
    GET_EMPLOYEE_LIST_FAILURE,
    ADD_EMPLOYEE_REQUEST,
    ADD_EMPLOYEE_SUCCESS,
    ADD_EMPLOYEE_FAILURE,
    VIEW_EMPLOYEE_REQUEST,
    VIEW_EMPLOYEE_SUCCESS,
    VIEW_EMPLOYEE_FAILURE,
    UPDATE_EMPLOYEE_REQUEST,
    UPDATE_EMPLOYEE_SUCCESS,
    UPDATE_EMPLOYEE_FAILURE,
    DELETE_EMPLOYEE_REQUEST,
    DELETE_EMPLOYEE_SUCCESS,
    DELETE_EMPLOYEE_FAILURE,
} from "./actionType";

export const getEmployeeListRequest = (page: number = 1, perPage: number = 50) => ({
    type: GET_EMPLOYEE_LIST_REQUEST,
    payload: { page, perPage },
});

export const getEmployeeListSuccess = (data: any) => ({
    type: GET_EMPLOYEE_LIST_SUCCESS,
    payload: data,
});

export const getEmployeeListFailure = (error: string) => ({
    type: GET_EMPLOYEE_LIST_FAILURE,
    payload: error,
});

export const addEmployeeRequest = (data: FormData) => ({
    type: ADD_EMPLOYEE_REQUEST,
    payload: data,
});

export const addEmployeeSuccess = (message: string) => ({
    type: ADD_EMPLOYEE_SUCCESS,
    payload: message,
});

export const addEmployeeFailure = (error: string) => ({
    type: ADD_EMPLOYEE_FAILURE,
    payload: error,
});

export const viewEmployeeRequest = (id: string | number) => ({
    type: VIEW_EMPLOYEE_REQUEST,
    payload: id,
});

export const viewEmployeeSuccess = (data: any) => ({
    type: VIEW_EMPLOYEE_SUCCESS,
    payload: data,
});

export const viewEmployeeFailure = (error: string) => ({
    type: VIEW_EMPLOYEE_FAILURE,
    payload: error,
});

export const updateEmployeeRequest = (id: string | number, data: FormData) => ({
    type: UPDATE_EMPLOYEE_REQUEST,
    payload: { id, data },
});

export const updateEmployeeSuccess = (message: string) => ({
    type: UPDATE_EMPLOYEE_SUCCESS,
    payload: message,
});

export const updateEmployeeFailure = (error: string) => ({
    type: UPDATE_EMPLOYEE_FAILURE,
    payload: error,
});

export const deleteEmployeeRequest = (id: string | number) => ({
    type: DELETE_EMPLOYEE_REQUEST,
    payload: id,
});

export const deleteEmployeeSuccess = (message: string) => ({
    type: DELETE_EMPLOYEE_SUCCESS,
    payload: message,
});

export const deleteEmployeeFailure = (error: string) => ({
    type: DELETE_EMPLOYEE_FAILURE,
    payload: error,
});
