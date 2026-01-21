import {
    CREATE_ASSET_REQUEST, CREATE_ASSET_SUCCESS, CREATE_ASSET_FAILURE,
    GET_ASSETS_REQUEST, GET_ASSETS_SUCCESS, GET_ASSETS_FAILURE,
    GET_ASSET_REQUEST, GET_ASSET_SUCCESS, GET_ASSET_FAILURE,
    UPDATE_ASSET_REQUEST, UPDATE_ASSET_SUCCESS, UPDATE_ASSET_FAILURE,
    DELETE_ASSET_REQUEST, DELETE_ASSET_SUCCESS, DELETE_ASSET_FAILURE,
    ASSIGN_ASSET_REQUEST, ASSIGN_ASSET_SUCCESS, ASSIGN_ASSET_FAILURE,
    GET_ASSETS_BY_EMPLOYEE_REQUEST, GET_ASSETS_BY_EMPLOYEE_SUCCESS, GET_ASSETS_BY_EMPLOYEE_FAILURE,
    CLEAR_ASSET_DETAILS
} from "./actionType";

// Create Asset
export const createAssetRequest = (payload: any) => ({
    type: CREATE_ASSET_REQUEST,
    payload,
});
export const createAssetSuccess = (response: any) => ({
    type: CREATE_ASSET_SUCCESS,
    payload: response,
});
export const createAssetFailure = (response: any) => ({
    type: CREATE_ASSET_FAILURE,
    payload: response,
});

// Get All Assets
export const getAssetsRequest = () => ({
    type: GET_ASSETS_REQUEST,
});
export const getAssetsSuccess = (response: any) => ({
    type: GET_ASSETS_SUCCESS,
    payload: response,
});
export const getAssetsFailure = (response: any) => ({
    type: GET_ASSETS_FAILURE,
    payload: response,
});

// Get Single Asset
export const getAssetRequest = (id: string) => ({
    type: GET_ASSET_REQUEST,
    payload: id,
});
export const getAssetSuccess = (response: any) => ({
    type: GET_ASSET_SUCCESS,
    payload: response,
});
export const getAssetFailure = (response: any) => ({
    type: GET_ASSET_FAILURE,
    payload: response,
});

// Update Asset
export const updateAssetRequest = (id: string, payload: any) => ({
    type: UPDATE_ASSET_REQUEST,
    payload: { id, payload },
});
export const updateAssetSuccess = (response: any) => ({
    type: UPDATE_ASSET_SUCCESS,
    payload: response,
});
export const updateAssetFailure = (response: any) => ({
    type: UPDATE_ASSET_FAILURE,
    payload: response,
});

// Delete Asset
export const deleteAssetRequest = (id: string) => ({
    type: DELETE_ASSET_REQUEST,
    payload: id,
});
export const deleteAssetSuccess = (response: any) => ({
    type: DELETE_ASSET_SUCCESS,
    payload: response,
});
export const deleteAssetFailure = (response: any) => ({
    type: DELETE_ASSET_FAILURE,
    payload: response,
});

// Assign/Unassign Asset
export const assignAssetRequest = (assetId: string, employeeId: string | null) => ({
    type: ASSIGN_ASSET_REQUEST,
    payload: { assetId, employeeId },
});
export const assignAssetSuccess = (response: any) => ({
    type: ASSIGN_ASSET_SUCCESS,
    payload: response,
});
export const assignAssetFailure = (response: any) => ({
    type: ASSIGN_ASSET_FAILURE,
    payload: response,
});

// Get Assets by Employee
export const getAssetsByEmployeeRequest = (employeeId: string) => ({
    type: GET_ASSETS_BY_EMPLOYEE_REQUEST,
    payload: employeeId,
});
export const getAssetsByEmployeeSuccess = (response: any) => ({
    type: GET_ASSETS_BY_EMPLOYEE_SUCCESS,
    payload: response,
});
export const getAssetsByEmployeeFailure = (response: any) => ({
    type: GET_ASSETS_BY_EMPLOYEE_FAILURE,
    payload: response,
});

export const clearAssetDetails = () => ({
    type: CLEAR_ASSET_DETAILS,
});
