import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
    CREATE_ASSET_REQUEST,
    GET_ASSETS_REQUEST,
    GET_ASSET_REQUEST,
    UPDATE_ASSET_REQUEST,
    DELETE_ASSET_REQUEST
} from "./actionType";
import {
    createAssetSuccess, createAssetFailure,
    getAssetsSuccess, getAssetsFailure,
    getAssetSuccess, getAssetFailure,
    updateAssetSuccess, updateAssetFailure,
    deleteAssetSuccess, deleteAssetFailure
} from "./action";
import api from "../api";

// API Functions
function createAssetApi(payload: FormData) {
    return api.post("/assets/", payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

function getAssetsApi() {
    return api.get("/assets/all");
}

function getAssetApi(id: string) {
    return api.get(`/assets/${id}`);
}

function updateAssetApi(id: string, payload: FormData) {
    return api.put(`/assets/${id}`, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

function deleteAssetApi(id: string) {
    return api.delete(`/assets/${id}`);
}

// Sagas
function* onCreateAsset({ payload }: any): SagaIterator {
    try {
        const response = yield call(createAssetApi, payload);
        yield put(createAssetSuccess(response.data));
    } catch (error: any) {
        yield put(createAssetFailure(error.response?.data?.detail || "Failed to create asset"));
    }
}

function* onGetAssets(): SagaIterator {
    try {
        const response = yield call(getAssetsApi);
        yield put(getAssetsSuccess(response.data));
    } catch (error: any) {
        yield put(getAssetsFailure(error.response?.data?.detail || "Failed to fetch assets"));
    }
}

function* onGetAsset({ payload }: any): SagaIterator {
    try {
        const response = yield call(getAssetApi, payload);
        yield put(getAssetSuccess(response.data));
    } catch (error: any) {
        yield put(getAssetFailure(error.response?.data?.detail || "Failed to fetch asset"));
    }
}

function* onUpdateAsset({ payload }: any): SagaIterator {
    try {
        const { id, payload: data } = payload;
        const response = yield call(updateAssetApi, id, data);
        yield put(updateAssetSuccess(response.data));
    } catch (error: any) {
        yield put(updateAssetFailure(error.response?.data?.detail || "Failed to update asset"));
    }
}

function* onDeleteAsset({ payload }: any): SagaIterator {
    try {
        const response = yield call(deleteAssetApi, payload);
        yield put(deleteAssetSuccess({ ...response.data, id: payload }));
    } catch (error: any) {
        yield put(deleteAssetFailure(error.response?.data?.detail || "Failed to delete asset"));
    }
}

export default function* assetSaga(): SagaIterator {
    yield takeEvery(CREATE_ASSET_REQUEST, onCreateAsset);
    yield takeEvery(GET_ASSETS_REQUEST, onGetAssets);
    yield takeEvery(GET_ASSET_REQUEST, onGetAsset);
    yield takeEvery(UPDATE_ASSET_REQUEST, onUpdateAsset);
    yield takeEvery(DELETE_ASSET_REQUEST, onDeleteAsset);
}
