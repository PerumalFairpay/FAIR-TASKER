import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
    CREATE_PERMISSION_REQUEST,
    GET_PERMISSIONS_REQUEST,
    GET_PERMISSION_REQUEST,
    UPDATE_PERMISSION_REQUEST,
    DELETE_PERMISSION_REQUEST
} from "./actionType";
import {
    createPermissionSuccess, createPermissionFailure,
    getPermissionsSuccess, getPermissionsFailure,
    getPermissionSuccess, getPermissionFailure,
    updatePermissionSuccess, updatePermissionFailure,
    deletePermissionSuccess, deletePermissionFailure
} from "./action";
import api from "../api";

// API Functions
function createPermissionApi(payload: any) {
    return api.post("/permissions/", payload);
}

function getPermissionsApi() {
    return api.get("/permissions/");
}

function getPermissionApi(id: string) {
    return api.get(`/permissions/${id}`);
}

function updatePermissionApi(id: string, payload: any) {
    return api.put(`/permissions/${id}`, payload);
}

function deletePermissionApi(id: string) {
    return api.delete(`/permissions/${id}`);
}

// Sagas
function* onCreatePermission({ payload }: any): SagaIterator {
    try {
        const response = yield call(createPermissionApi, payload);
        yield put(createPermissionSuccess(response.data));
    } catch (error: any) {
        yield put(createPermissionFailure(error.response?.data?.detail || "Failed to create permission"));
    }
}

function* onGetPermissions(): SagaIterator {
    try {
        const response = yield call(getPermissionsApi);
        yield put(getPermissionsSuccess(response.data));
    } catch (error: any) {
        yield put(getPermissionsFailure(error.response?.data?.detail || "Failed to fetch permissions"));
    }
}

function* onGetPermission({ payload }: any): SagaIterator {
    try {
        const response = yield call(getPermissionApi, payload);
        yield put(getPermissionSuccess(response.data));
    } catch (error: any) {
        yield put(getPermissionFailure(error.response?.data?.detail || "Failed to fetch permission"));
    }
}

function* onUpdatePermission({ payload }: any): SagaIterator {
    try {
        const { id, permission } = payload;
        const response = yield call(updatePermissionApi, id, permission);
        yield put(updatePermissionSuccess(response.data));
    } catch (error: any) {
        yield put(updatePermissionFailure(error.response?.data?.detail || "Failed to update permission"));
    }
}

function* onDeletePermission({ payload }: any): SagaIterator {
    try {
        yield call(deletePermissionApi, payload);
        yield put(deletePermissionSuccess(payload));
    } catch (error: any) {
        yield put(deletePermissionFailure(error.response?.data?.detail || "Failed to delete permission"));
    }
}

export default function* permissionSaga(): SagaIterator {
    yield takeEvery(CREATE_PERMISSION_REQUEST, onCreatePermission);
    yield takeEvery(GET_PERMISSIONS_REQUEST, onGetPermissions);
    yield takeEvery(GET_PERMISSION_REQUEST, onGetPermission);
    yield takeEvery(UPDATE_PERMISSION_REQUEST, onUpdatePermission);
    yield takeEvery(DELETE_PERMISSION_REQUEST, onDeletePermission);
}
