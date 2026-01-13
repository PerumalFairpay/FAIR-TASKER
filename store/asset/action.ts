import {
    CREATE_ASSET_REQUEST, CREATE_ASSET_SUCCESS, CREATE_ASSET_FAILURE,
    GET_ASSETS_REQUEST, GET_ASSETS_SUCCESS, GET_ASSETS_FAILURE,
    GET_ASSET_REQUEST, GET_ASSET_SUCCESS, GET_ASSET_FAILURE,
    UPDATE_ASSET_REQUEST, UPDATE_ASSET_SUCCESS, UPDATE_ASSET_FAILURE,
    DELETE_ASSET_REQUEST, DELETE_ASSET_SUCCESS, DELETE_ASSET_FAILURE,
    CLEAR_ASSET_DETAILS
} from "./actionType";

// Create Asset
export const createAssetRequest = (payload: any) => ({
    type: CREATE_ASSET_REQUEST,
    payload,
});
export const createAssetSuccess = (payload: any) => ({
    type: CREATE_ASSET_SUCCESS,
    payload,
});
export const createAssetFailure = (payload: any) => ({
    type: CREATE_ASSET_FAILURE,
    payload,
});

// Get All Assets
export const getAssetsRequest = () => ({
    type: GET_ASSETS_REQUEST,
});
export const getAssetsSuccess = (payload: any) => ({
    type: GET_ASSETS_SUCCESS,
    payload,
});
export const getAssetsFailure = (payload: any) => ({
    type: GET_ASSETS_FAILURE,
    payload,
});

// Get Single Asset
export const getAssetRequest = (id: string) => ({
    type: GET_ASSET_REQUEST,
    payload: id,
});
export const getAssetSuccess = (payload: any) => ({
    type: GET_ASSET_SUCCESS,
    payload,
});
export const getAssetFailure = (payload: any) => ({
    type: GET_ASSET_FAILURE,
    payload,
});

// Update Asset
export const updateAssetRequest = (id: string, payload: any) => ({
    type: UPDATE_ASSET_REQUEST,
    payload: { id, payload },
});
export const updateAssetSuccess = (payload: any) => ({
    type: UPDATE_ASSET_SUCCESS,
    payload,
});
export const updateAssetFailure = (payload: any) => ({
    type: UPDATE_ASSET_FAILURE,
    payload,
});

// Delete Asset
export const deleteAssetRequest = (id: string) => ({
    type: DELETE_ASSET_REQUEST,
    payload: id,
});
export const deleteAssetSuccess = (payload: any) => ({
    type: DELETE_ASSET_SUCCESS,
    payload,
});
export const deleteAssetFailure = (payload: any) => ({
    type: DELETE_ASSET_FAILURE,
    payload,
});

export const clearAssetDetails = () => ({
    type: CLEAR_ASSET_DETAILS,
});
