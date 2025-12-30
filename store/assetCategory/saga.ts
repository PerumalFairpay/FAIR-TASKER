import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
    CREATE_ASSET_CATEGORY_REQUEST,
    GET_ASSET_CATEGORIES_REQUEST,
    GET_ASSET_CATEGORY_REQUEST,
    UPDATE_ASSET_CATEGORY_REQUEST,
    DELETE_ASSET_CATEGORY_REQUEST
} from "./actionType";
import {
    createAssetCategorySuccess, createAssetCategoryFailure,
    getAssetCategoriesSuccess, getAssetCategoriesFailure,
    getAssetCategorySuccess, getAssetCategoryFailure,
    updateAssetCategorySuccess, updateAssetCategoryFailure,
    deleteAssetCategorySuccess, deleteAssetCategoryFailure
} from "./action";
import api from "../api";

// API Functions
function createAssetCategoryApi(payload: any) {
    return api.post("/asset-categories/", payload);
}

function getAssetCategoriesApi() {
    return api.get("/asset-categories/all");
}

function getAssetCategoryApi(id: string) {
    return api.get(`/asset-categories/${id}`);
}

function updateAssetCategoryApi(id: string, payload: any) {
    return api.put(`/asset-categories/${id}`, payload);
}

function deleteAssetCategoryApi(id: string) {
    return api.delete(`/asset-categories/${id}`);
}

// Sagas
function* onCreateAssetCategory({ payload }: any): SagaIterator {
    try {
        const response = yield call(createAssetCategoryApi, payload);
        yield put(createAssetCategorySuccess(response.data));
    } catch (error: any) {
        yield put(createAssetCategoryFailure(error.response?.data?.detail || "Failed to create asset category"));
    }
}

function* onGetAssetCategories(): SagaIterator {
    try {
        const response = yield call(getAssetCategoriesApi);
        yield put(getAssetCategoriesSuccess(response.data));
    } catch (error: any) {
        yield put(getAssetCategoriesFailure(error.response?.data?.detail || "Failed to fetch asset categories"));
    }
}

function* onGetAssetCategory({ payload }: any): SagaIterator {
    try {
        const response = yield call(getAssetCategoryApi, payload);
        yield put(getAssetCategorySuccess(response.data));
    } catch (error: any) {
        yield put(getAssetCategoryFailure(error.response?.data?.detail || "Failed to fetch asset category"));
    }
}

function* onUpdateAssetCategory({ payload }: any): SagaIterator {
    try {
        const { id, payload: data } = payload;
        const response = yield call(updateAssetCategoryApi, id, data);
        yield put(updateAssetCategorySuccess(response.data));
    } catch (error: any) {
        yield put(updateAssetCategoryFailure(error.response?.data?.detail || "Failed to update asset category"));
    }
}

function* onDeleteAssetCategory({ payload }: any): SagaIterator {
    try {
        const response = yield call(deleteAssetCategoryApi, payload);
        yield put(deleteAssetCategorySuccess({ ...response.data, id: payload }));
    } catch (error: any) {
        yield put(deleteAssetCategoryFailure(error.response?.data?.detail || "Failed to delete asset category"));
    }
}

export default function* assetCategorySaga(): SagaIterator {
    yield takeEvery(CREATE_ASSET_CATEGORY_REQUEST, onCreateAssetCategory);
    yield takeEvery(GET_ASSET_CATEGORIES_REQUEST, onGetAssetCategories);
    yield takeEvery(GET_ASSET_CATEGORY_REQUEST, onGetAssetCategory);
    yield takeEvery(UPDATE_ASSET_CATEGORY_REQUEST, onUpdateAssetCategory);
    yield takeEvery(DELETE_ASSET_CATEGORY_REQUEST, onDeleteAssetCategory);
}
