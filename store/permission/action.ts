import * as actionType from "./actionType";

export const createPermissionRequest = (permission: any) => ({
    type: actionType.CREATE_PERMISSION_REQUEST,
    payload: permission,
});

export const createPermissionSuccess = (permission: any) => ({
    type: actionType.CREATE_PERMISSION_SUCCESS,
    payload: permission,
});

export const createPermissionFailure = (error: string) => ({
    type: actionType.CREATE_PERMISSION_FAILURE,
    payload: error,
});

export const getPermissionsRequest = () => ({
    type: actionType.GET_PERMISSIONS_REQUEST,
});

export const getPermissionsSuccess = (permissions: any[]) => ({
    type: actionType.GET_PERMISSIONS_SUCCESS,
    payload: permissions,
});

export const getPermissionsFailure = (error: string) => ({
    type: actionType.GET_PERMISSIONS_FAILURE,
    payload: error,
});

export const getPermissionRequest = (id: string) => ({
    type: actionType.GET_PERMISSION_REQUEST,
    payload: id,
});

export const getPermissionSuccess = (permission: any) => ({
    type: actionType.GET_PERMISSION_SUCCESS,
    payload: permission,
});

export const getPermissionFailure = (error: string) => ({
    type: actionType.GET_PERMISSION_FAILURE,
    payload: error,
});

export const updatePermissionRequest = (id: string, permission: any) => ({
    type: actionType.UPDATE_PERMISSION_REQUEST,
    payload: { id, permission },
});

export const updatePermissionSuccess = (permission: any) => ({
    type: actionType.UPDATE_PERMISSION_SUCCESS,
    payload: permission,
});

export const updatePermissionFailure = (error: string) => ({
    type: actionType.UPDATE_PERMISSION_FAILURE,
    payload: error,
});

export const deletePermissionRequest = (id: string) => ({
    type: actionType.DELETE_PERMISSION_REQUEST,
    payload: id,
});

export const deletePermissionSuccess = (id: string) => ({
    type: actionType.DELETE_PERMISSION_SUCCESS,
    payload: id,
});

export const deletePermissionFailure = (error: string) => ({
    type: actionType.DELETE_PERMISSION_FAILURE,
    payload: error,
});

export const clearPermissionDetails = () => ({
    type: actionType.CLEAR_PERMISSION_DETAILS,
});
