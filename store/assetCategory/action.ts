import {
    CREATE_ASSET_CATEGORY_REQUEST, CREATE_ASSET_CATEGORY_SUCCESS, CREATE_ASSET_CATEGORY_FAILURE,
    GET_ASSET_CATEGORIES_REQUEST, GET_ASSET_CATEGORIES_SUCCESS, GET_ASSET_CATEGORIES_FAILURE,
    GET_ASSET_CATEGORY_REQUEST, GET_ASSET_CATEGORY_SUCCESS, GET_ASSET_CATEGORY_FAILURE,
    UPDATE_ASSET_CATEGORY_REQUEST, UPDATE_ASSET_CATEGORY_SUCCESS, UPDATE_ASSET_CATEGORY_FAILURE,
    DELETE_ASSET_CATEGORY_REQUEST, DELETE_ASSET_CATEGORY_SUCCESS, DELETE_ASSET_CATEGORY_FAILURE,
    CLEAR_ASSET_CATEGORY_DETAILS
} from "./actionType";

// Create Asset Category
export const createAssetCategoryRequest = (payload: any) => ({
    type: CREATE_ASSET_CATEGORY_REQUEST,
    payload,
});
export const createAssetCategorySuccess = (payload: any) => ({
    type: CREATE_ASSET_CATEGORY_SUCCESS,
    payload,
});
export const createAssetCategoryFailure = (payload: any) => ({
    type: CREATE_ASSET_CATEGORY_FAILURE,
    payload,
});

// Get All Asset Categories
export const getAssetCategoriesRequest = () => ({
    type: GET_ASSET_CATEGORIES_REQUEST,
});
export const getAssetCategoriesSuccess = (payload: any) => ({
    type: GET_ASSET_CATEGORIES_SUCCESS,
    payload,
});
export const getAssetCategoriesFailure = (payload: any) => ({
    type: GET_ASSET_CATEGORIES_FAILURE,
    payload,
});

// Get Single Asset Category
export const getAssetCategoryRequest = (id: string) => ({
    type: GET_ASSET_CATEGORY_REQUEST,
    payload: id,
});
export const getAssetCategorySuccess = (payload: any) => ({
    type: GET_ASSET_CATEGORY_SUCCESS,
    payload,
});
export const getAssetCategoryFailure = (payload: any) => ({
    type: GET_ASSET_CATEGORY_FAILURE,
    payload,
});

// Update Asset Category
export const updateAssetCategoryRequest = (id: string, payload: any) => ({
    type: UPDATE_ASSET_CATEGORY_REQUEST,
    payload: { id, payload },
});
export const updateAssetCategorySuccess = (payload: any) => ({
    type: UPDATE_ASSET_CATEGORY_SUCCESS,
    payload,
});
export const updateAssetCategoryFailure = (payload: any) => ({
    type: UPDATE_ASSET_CATEGORY_FAILURE,
    payload,
});

// Delete Asset Category
export const deleteAssetCategoryRequest = (id: string) => ({
    type: DELETE_ASSET_CATEGORY_REQUEST,
    payload: id,
});
export const deleteAssetCategorySuccess = (payload: any) => ({
    type: DELETE_ASSET_CATEGORY_SUCCESS,
    payload,
});
export const deleteAssetCategoryFailure = (payload: any) => ({
    type: DELETE_ASSET_CATEGORY_FAILURE,
    payload,
});

export const clearAssetCategoryDetails = () => ({
    type: CLEAR_ASSET_CATEGORY_DETAILS,
});
