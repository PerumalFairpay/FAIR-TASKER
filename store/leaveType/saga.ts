import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
    CREATE_LEAVE_TYPE_REQUEST,
    GET_LEAVE_TYPES_REQUEST,
    GET_LEAVE_TYPE_REQUEST,
    UPDATE_LEAVE_TYPE_REQUEST,
    DELETE_LEAVE_TYPE_REQUEST
} from "./actionType";
import {
    createLeaveTypeSuccess, createLeaveTypeFailure,
    getLeaveTypesSuccess, getLeaveTypesFailure,
    getLeaveTypeSuccess, getLeaveTypeFailure,
    updateLeaveTypeSuccess, updateLeaveTypeFailure,
    deleteLeaveTypeSuccess, deleteLeaveTypeFailure
} from "./action";
import api from "../api";

// API Functions
function createLeaveTypeApi(payload: any) {
    return api.post("/leave-types/create", payload);
}

function getLeaveTypesApi() {
    return api.get("/leave-types/all");
}

function getLeaveTypeApi(id: string) {
    return api.get(`/leave-types/${id}`);
}

function updateLeaveTypeApi(id: string, payload: any) {
    return api.put(`/leave-types/update/${id}`, payload);
}

function deleteLeaveTypeApi(id: string) {
    return api.delete(`/leave-types/delete/${id}`);
}

// Sagas
function* onCreateLeaveType({ payload }: any): SagaIterator {
    try {
        const response = yield call(createLeaveTypeApi, payload);
        if (response.data.success) {
            yield put(createLeaveTypeSuccess(response.data));
        } else {
            yield put(createLeaveTypeFailure(response.data.message || "Failed to create leave type"));
        }
    } catch (error: any) {
        yield put(createLeaveTypeFailure(error.response?.data?.message || "Failed to create leave type"));
    }
}

function* onGetLeaveTypes(): SagaIterator {
    try {
        const response = yield call(getLeaveTypesApi);
        if (response.data.success) {
            yield put(getLeaveTypesSuccess(response.data));
        } else {
            yield put(getLeaveTypesFailure(response.data.message || "Failed to fetch leave types"));
        }
    } catch (error: any) {
        yield put(getLeaveTypesFailure(error.response?.data?.message || "Failed to fetch leave types"));
    }
}

function* onGetLeaveType({ payload }: any): SagaIterator {
    try {
        const response = yield call(getLeaveTypeApi, payload);
        if (response.data.success) {
            yield put(getLeaveTypeSuccess(response.data));
        } else {
            yield put(getLeaveTypeFailure(response.data.message || "Failed to fetch leave type"));
        }
    } catch (error: any) {
        yield put(getLeaveTypeFailure(error.response?.data?.message || "Failed to fetch leave type"));
    }
}

function* onUpdateLeaveType({ payload }: any): SagaIterator {
    try {
        const { id, payload: data } = payload;
        const response = yield call(updateLeaveTypeApi, id, data);
        if (response.data.success) {
            yield put(updateLeaveTypeSuccess(response.data));
        } else {
            yield put(updateLeaveTypeFailure(response.data.message || "Failed to update leave type"));
        }
    } catch (error: any) {
        yield put(updateLeaveTypeFailure(error.response?.data?.message || "Failed to update leave type"));
    }
}

function* onDeleteLeaveType({ payload }: any): SagaIterator {
    try {
        const response = yield call(deleteLeaveTypeApi, payload);
        if (response.data.success) {
            yield put(deleteLeaveTypeSuccess({ ...response.data, id: payload }));
        } else {
            yield put(deleteLeaveTypeFailure(response.data.message || "Failed to delete leave type"));
        }
    } catch (error: any) {
        yield put(deleteLeaveTypeFailure(error.response?.data?.message || "Failed to delete leave type"));
    }
}

export default function* leaveTypeSaga(): SagaIterator {
    yield takeEvery(CREATE_LEAVE_TYPE_REQUEST, onCreateLeaveType);
    yield takeEvery(GET_LEAVE_TYPES_REQUEST, onGetLeaveTypes);
    yield takeEvery(GET_LEAVE_TYPE_REQUEST, onGetLeaveType);
    yield takeEvery(UPDATE_LEAVE_TYPE_REQUEST, onUpdateLeaveType);
    yield takeEvery(DELETE_LEAVE_TYPE_REQUEST, onDeleteLeaveType);
}
