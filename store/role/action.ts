import {
    CREATE_ROLE_REQUEST, CREATE_ROLE_SUCCESS, CREATE_ROLE_FAILURE,
    GET_ROLES_REQUEST, GET_ROLES_SUCCESS, GET_ROLES_FAILURE,
    GET_ROLE_REQUEST, GET_ROLE_SUCCESS, GET_ROLE_FAILURE,
    UPDATE_ROLE_REQUEST, UPDATE_ROLE_SUCCESS, UPDATE_ROLE_FAILURE,
    DELETE_ROLE_REQUEST, DELETE_ROLE_SUCCESS, DELETE_ROLE_FAILURE,
    CLEAR_ROLE_DETAILS
} from "./actionType";

// Create Role
export const createRoleRequest = (payload: any) => ({
    type: CREATE_ROLE_REQUEST,
    payload,
});
export const createRoleSuccess = (payload: any) => ({
    type: CREATE_ROLE_SUCCESS,
    payload,
});
export const createRoleFailure = (payload: any) => ({
    type: CREATE_ROLE_FAILURE,
    payload,
});

// Get All Roles
export const getRolesRequest = () => ({
    type: GET_ROLES_REQUEST,
});
export const getRolesSuccess = (payload: any) => ({
    type: GET_ROLES_SUCCESS,
    payload,
});
export const getRolesFailure = (payload: any) => ({
    type: GET_ROLES_FAILURE,
    payload,
});

// Get Single Role
export const getRoleRequest = (id: string) => ({
    type: GET_ROLE_REQUEST,
    payload: id,
});
export const getRoleSuccess = (payload: any) => ({
    type: GET_ROLE_SUCCESS,
    payload,
});
export const getRoleFailure = (payload: any) => ({
    type: GET_ROLE_FAILURE,
    payload,
});

// Update Role
export const updateRoleRequest = (id: string, payload: any) => ({
    type: UPDATE_ROLE_REQUEST,
    payload: { id, payload },
});
export const updateRoleSuccess = (payload: any) => ({
    type: UPDATE_ROLE_SUCCESS,
    payload,
});
export const updateRoleFailure = (payload: any) => ({
    type: UPDATE_ROLE_FAILURE,
    payload,
});

// Delete Role
export const deleteRoleRequest = (id: string) => ({
    type: DELETE_ROLE_REQUEST,
    payload: id,
});
export const deleteRoleSuccess = (payload: any) => ({
    type: DELETE_ROLE_SUCCESS,
    payload,
});
export const deleteRoleFailure = (payload: any) => ({
    type: DELETE_ROLE_FAILURE,
    payload,
});

// Clear Details
export const clearRoleDetails = () => ({
    type: CLEAR_ROLE_DETAILS,
});
