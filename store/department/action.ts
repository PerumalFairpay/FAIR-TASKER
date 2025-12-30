import {
    CREATE_DEPARTMENT_REQUEST, CREATE_DEPARTMENT_SUCCESS, CREATE_DEPARTMENT_FAILURE,
    GET_DEPARTMENTS_REQUEST, GET_DEPARTMENTS_SUCCESS, GET_DEPARTMENTS_FAILURE,
    GET_DEPARTMENT_REQUEST, GET_DEPARTMENT_SUCCESS, GET_DEPARTMENT_FAILURE,
    UPDATE_DEPARTMENT_REQUEST, UPDATE_DEPARTMENT_SUCCESS, UPDATE_DEPARTMENT_FAILURE,
    DELETE_DEPARTMENT_REQUEST, DELETE_DEPARTMENT_SUCCESS, DELETE_DEPARTMENT_FAILURE
} from "./actionType";

// Create Department
export const createDepartmentRequest = (payload: any) => ({
    type: CREATE_DEPARTMENT_REQUEST,
    payload,
});
export const createDepartmentSuccess = (payload: any) => ({
    type: CREATE_DEPARTMENT_SUCCESS,
    payload,
});
export const createDepartmentFailure = (payload: any) => ({
    type: CREATE_DEPARTMENT_FAILURE,
    payload,
});

// Get All Departments
export const getDepartmentsRequest = () => ({
    type: GET_DEPARTMENTS_REQUEST,
});
export const getDepartmentsSuccess = (payload: any) => ({
    type: GET_DEPARTMENTS_SUCCESS,
    payload,
});
export const getDepartmentsFailure = (payload: any) => ({
    type: GET_DEPARTMENTS_FAILURE,
    payload,
});

// Get Single Department
export const getDepartmentRequest = (id: string) => ({
    type: GET_DEPARTMENT_REQUEST,
    payload: id,
});
export const getDepartmentSuccess = (payload: any) => ({
    type: GET_DEPARTMENT_SUCCESS,
    payload,
});
export const getDepartmentFailure = (payload: any) => ({
    type: GET_DEPARTMENT_FAILURE,
    payload,
});

// Update Department
export const updateDepartmentRequest = (id: string, payload: any) => ({
    type: UPDATE_DEPARTMENT_REQUEST,
    payload: { id, payload },
});
export const updateDepartmentSuccess = (payload: any) => ({
    type: UPDATE_DEPARTMENT_SUCCESS,
    payload,
});
export const updateDepartmentFailure = (payload: any) => ({
    type: UPDATE_DEPARTMENT_FAILURE,
    payload,
});

// Delete Department
export const deleteDepartmentRequest = (id: string) => ({
    type: DELETE_DEPARTMENT_REQUEST,
    payload: id,
});
export const deleteDepartmentSuccess = (payload: any) => ({
    type: DELETE_DEPARTMENT_SUCCESS,
    payload,
});
export const deleteDepartmentFailure = (payload: any) => ({
    type: DELETE_DEPARTMENT_FAILURE,
    payload,
});
