import {
    GET_EMPLOYEE_LIST_REQUEST,
    GET_EMPLOYEE_LIST_SUCCESS,
    GET_EMPLOYEE_LIST_FAILURE,
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
