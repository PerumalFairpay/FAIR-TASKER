import {
    CREATE_EMPLOYEE_REQUEST, CREATE_EMPLOYEE_SUCCESS, CREATE_EMPLOYEE_FAILURE,
    GET_EMPLOYEES_REQUEST, GET_EMPLOYEES_SUCCESS, GET_EMPLOYEES_FAILURE,
    GET_EMPLOYEE_REQUEST, GET_EMPLOYEE_SUCCESS, GET_EMPLOYEE_FAILURE,
    UPDATE_EMPLOYEE_REQUEST, UPDATE_EMPLOYEE_SUCCESS, UPDATE_EMPLOYEE_FAILURE,
    DELETE_EMPLOYEE_REQUEST, DELETE_EMPLOYEE_SUCCESS, DELETE_EMPLOYEE_FAILURE,
    CLEAR_EMPLOYEE_DETAILS
} from "./actionType";

// Create Employee
export const createEmployeeRequest = (payload: FormData) => ({
    type: CREATE_EMPLOYEE_REQUEST,
    payload,
});
export const createEmployeeSuccess = (response: any) => ({
    type: CREATE_EMPLOYEE_SUCCESS,
    payload: response,
});
export const createEmployeeFailure = (error: any) => ({
    type: CREATE_EMPLOYEE_FAILURE,
    payload: error,
});

// Get All Employees
export const getEmployeesRequest = () => ({
    type: GET_EMPLOYEES_REQUEST,
});
export const getEmployeesSuccess = (response: any) => ({
    type: GET_EMPLOYEES_SUCCESS,
    payload: response,
});
export const getEmployeesFailure = (error: any) => ({
    type: GET_EMPLOYEES_FAILURE,
    payload: error,
});

// Get Single Employee
export const getEmployeeRequest = (id: string) => ({
    type: GET_EMPLOYEE_REQUEST,
    payload: id,
});
export const getEmployeeSuccess = (response: any) => ({
    type: GET_EMPLOYEE_SUCCESS,
    payload: response,
});
export const getEmployeeFailure = (error: any) => ({
    type: GET_EMPLOYEE_FAILURE,
    payload: error,
});

// Update Employee
export const updateEmployeeRequest = (id: string, payload: FormData) => ({
    type: UPDATE_EMPLOYEE_REQUEST,
    payload: { id, payload },
});
export const updateEmployeeSuccess = (response: any) => ({
    type: UPDATE_EMPLOYEE_SUCCESS,
    payload: response,
});
export const updateEmployeeFailure = (error: any) => ({
    type: UPDATE_EMPLOYEE_FAILURE,
    payload: error,
});

// Delete Employee
export const deleteEmployeeRequest = (id: string) => ({
    type: DELETE_EMPLOYEE_REQUEST,
    payload: id,
});
export const deleteEmployeeSuccess = (response: any) => ({
    type: DELETE_EMPLOYEE_SUCCESS,
    payload: response,
});
export const deleteEmployeeFailure = (error: any) => ({
    type: DELETE_EMPLOYEE_FAILURE,
    payload: error,
});

// Clear Details
export const clearEmployeeDetails = () => ({
    type: CLEAR_EMPLOYEE_DETAILS,
});
