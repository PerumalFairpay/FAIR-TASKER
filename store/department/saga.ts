import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
    CREATE_DEPARTMENT_REQUEST,
    GET_DEPARTMENTS_REQUEST,
    GET_DEPARTMENT_REQUEST,
    UPDATE_DEPARTMENT_REQUEST,
    DELETE_DEPARTMENT_REQUEST
} from "./actionType";
import {
    createDepartmentSuccess, createDepartmentFailure,
    getDepartmentsSuccess, getDepartmentsFailure,
    getDepartmentSuccess, getDepartmentFailure,
    updateDepartmentSuccess, updateDepartmentFailure,
    deleteDepartmentSuccess, deleteDepartmentFailure
} from "./action";
import api from "../api";

// API Functions
function createDepartmentApi(payload: any) {
    return api.post("/departments/create", payload);
}

function getDepartmentsApi() {
    return api.get("/departments/all");
}

function getDepartmentApi(id: string) {
    return api.get(`/departments/${id}`);
}

function updateDepartmentApi(id: string, payload: any) {
    return api.put(`/departments/update/${id}`, payload);
}

function deleteDepartmentApi(id: string) {
    return api.delete(`/departments/delete/${id}`);
}

// Sagas
function* onCreateDepartment({ payload }: any): SagaIterator {
    try {
        const response = yield call(createDepartmentApi, payload);
        if (response.data.success) {
            yield put(createDepartmentSuccess(response.data));
        } else {
            yield put(createDepartmentFailure(response.data.message || "Failed to create department"));
        }
    } catch (error: any) {
        yield put(createDepartmentFailure(error.response?.data?.message || "Failed to create department"));
    }
}

function* onGetDepartments(): SagaIterator {
    try {
        const response = yield call(getDepartmentsApi);
        if (response.data.success) {
            yield put(getDepartmentsSuccess(response.data));
        } else {
            yield put(getDepartmentsFailure(response.data.message || "Failed to fetch departments"));
        }
    } catch (error: any) {
        yield put(getDepartmentsFailure(error.response?.data?.message || "Failed to fetch departments"));
    }
}

function* onGetDepartment({ payload }: any): SagaIterator {
    try {
        const response = yield call(getDepartmentApi, payload);
        if (response.data.success) {
            yield put(getDepartmentSuccess(response.data));
        } else {
            yield put(getDepartmentFailure(response.data.message || "Failed to fetch department"));
        }
    } catch (error: any) {
        yield put(getDepartmentFailure(error.response?.data?.message || "Failed to fetch department"));
    }
}

function* onUpdateDepartment({ payload }: any): SagaIterator {
    try {
        const { id, payload: data } = payload;
        const response = yield call(updateDepartmentApi, id, data);
        if (response.data.success) {
            yield put(updateDepartmentSuccess(response.data));
        } else {
            yield put(updateDepartmentFailure(response.data.message || "Failed to update department"));
        }
    } catch (error: any) {
        yield put(updateDepartmentFailure(error.response?.data?.message || "Failed to update department"));
    }
}

function* onDeleteDepartment({ payload }: any): SagaIterator {
    try {
        const response = yield call(deleteDepartmentApi, payload);
        if (response.data.success) {
            // Append ID to payload for reducer to filter out
            yield put(deleteDepartmentSuccess({ ...response.data, id: payload }));
        } else {
            yield put(deleteDepartmentFailure(response.data.message || "Failed to delete department"));
        }
    } catch (error: any) {
        yield put(deleteDepartmentFailure(error.response?.data?.message || "Failed to delete department"));
    }
}

export default function* departmentSaga(): SagaIterator {
    yield takeEvery(CREATE_DEPARTMENT_REQUEST, onCreateDepartment);
    yield takeEvery(GET_DEPARTMENTS_REQUEST, onGetDepartments);
    yield takeEvery(GET_DEPARTMENT_REQUEST, onGetDepartment);
    yield takeEvery(UPDATE_DEPARTMENT_REQUEST, onUpdateDepartment);
    yield takeEvery(DELETE_DEPARTMENT_REQUEST, onDeleteDepartment);
}
