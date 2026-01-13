import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
    CREATE_ROLE_REQUEST,
    GET_ROLES_REQUEST,
    GET_ROLE_REQUEST,
    UPDATE_ROLE_REQUEST,
    DELETE_ROLE_REQUEST
} from "./actionType";
import {
    createRoleSuccess, createRoleFailure,
    getRolesSuccess, getRolesFailure,
    getRoleSuccess, getRoleFailure,
    updateRoleSuccess, updateRoleFailure,
    deleteRoleSuccess, deleteRoleFailure
} from "./action";
import api from "../api";

// API Functions
function createRoleApi(payload: any) {
    return api.post("/roles/", payload);
}

function getRolesApi() {
    return api.get("/roles/");
}

function getRoleApi(id: string) {
    return api.get(`/roles/${id}`);
}

function updateRoleApi(id: string, payload: any) {
    return api.put(`/roles/${id}`, payload);
}

function deleteRoleApi(id: string) {
    return api.delete(`/roles/${id}`);
}

// Sagas
function* onCreateRole({ payload }: any): SagaIterator {
    try {
        const response = yield call(createRoleApi, payload);
        yield put(createRoleSuccess(response.data));
    } catch (error: any) {
        yield put(createRoleFailure(error.response?.data?.detail || "Failed to create role"));
    }
}

function* onGetRoles(): SagaIterator {
    try {
        const response = yield call(getRolesApi);
        yield put(getRolesSuccess(response.data));
    } catch (error: any) {
        yield put(getRolesFailure(error.response?.data?.detail || "Failed to fetch roles"));
    }
}

function* onGetRole({ payload }: any): SagaIterator {
    try {
        const response = yield call(getRoleApi, payload);
        yield put(getRoleSuccess(response.data));
    } catch (error: any) {
        yield put(getRoleFailure(error.response?.data?.detail || "Failed to fetch role"));
    }
}

function* onUpdateRole({ payload }: any): SagaIterator {
    try {
        const { id, payload: data } = payload;
        const response = yield call(updateRoleApi, id, data);
        yield put(updateRoleSuccess(response.data));
    } catch (error: any) {
        yield put(updateRoleFailure(error.response?.data?.detail || "Failed to update role"));
    }
}

function* onDeleteRole({ payload }: any): SagaIterator {
    try {
        yield call(deleteRoleApi, payload);
        // Payload is the ID
        yield put(deleteRoleSuccess({ id: payload }));
    } catch (error: any) {
        yield put(deleteRoleFailure(error.response?.data?.detail || "Failed to delete role"));
    }
}

export default function* roleSaga(): SagaIterator {
    yield takeEvery(CREATE_ROLE_REQUEST, onCreateRole);
    yield takeEvery(GET_ROLES_REQUEST, onGetRoles);
    yield takeEvery(GET_ROLE_REQUEST, onGetRole);
    yield takeEvery(UPDATE_ROLE_REQUEST, onUpdateRole);
    yield takeEvery(DELETE_ROLE_REQUEST, onDeleteRole);
}
