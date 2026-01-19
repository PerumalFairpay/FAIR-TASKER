import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
    CREATE_LEAVE_REQUEST_REQUEST,
    GET_LEAVE_REQUESTS_REQUEST,
    GET_LEAVE_REQUEST_REQUEST,
    UPDATE_LEAVE_REQUEST_REQUEST,
    UPDATE_LEAVE_STATUS_REQUEST,
    DELETE_LEAVE_REQUEST_REQUEST
} from "./actionType";
import {
    createLeaveRequestSuccess, createLeaveRequestFailure,
    getLeaveRequestsSuccess, getLeaveRequestsFailure,
    getLeaveRequestSuccess, getLeaveRequestFailure,
    updateLeaveRequestSuccess, updateLeaveRequestFailure,
    updateLeaveStatusSuccess, updateLeaveStatusFailure,
    deleteLeaveRequestSuccess, deleteLeaveRequestFailure
} from "./action";
import api from "../api";

// API Functions
function createLeaveRequestApi(payload: FormData) {
    return api.post("/leave-requests/create", payload, {
        headers: { "Content-Type": "multipart/form-data" }
    });
}

function getLeaveRequestsApi(payload?: { id?: string; status?: string } | string) {
    let url = "/leave-requests/all";
    const params = new URLSearchParams();

    if (typeof payload === "string") {
        params.append("id", payload);
    } else if (payload && typeof payload === "object") {
        if (payload.id) params.append("id", payload.id);
        if (payload.status && payload.status !== "All") params.append("status", payload.status);
    }

    const queryString = params.toString();
    if (queryString) {
        url += `?${queryString}`;
    }

    return api.get(url);
}

function getLeaveRequestApi(id: string) {
    return api.get(`/leave-requests/${id}`);
}

function updateLeaveRequestApi(id: string, payload: FormData) {
    return api.put(`/leave-requests/update/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" }
    });
}

function updateLeaveStatusApi(id: string, status: string, rejection_reason?: string) {
    const data: any = { status };
    if (rejection_reason) {
        data.rejection_reason = rejection_reason;
    }
    return api.patch(`/leave-requests/status/${id}`, data);
}


function deleteLeaveRequestApi(id: string) {
    return api.delete(`/leave-requests/delete/${id}`);
}

// Sagas
function* onCreateLeaveRequest({ payload }: any): SagaIterator {
    try {
        const response = yield call(createLeaveRequestApi, payload);
        if (response.data.success) {
            yield put(createLeaveRequestSuccess(response.data));
        } else {
            yield put(createLeaveRequestFailure(response.data.message || "Failed to submit leave request"));
        }
    } catch (error: any) {
        yield put(createLeaveRequestFailure(error.response?.data?.message || "Failed to submit leave request"));
    }
}

function* onGetLeaveRequests({ payload }: any): SagaIterator {
    try {
        const response = yield call(getLeaveRequestsApi, payload);
        if (response.data.success) {
            yield put(getLeaveRequestsSuccess(response.data));
        } else {
            yield put(getLeaveRequestsFailure(response.data.message || "Failed to fetch leave requests"));
        }
    } catch (error: any) {
        yield put(getLeaveRequestsFailure(error.response?.data?.message || "Failed to fetch leave requests"));
    }
}

function* onGetLeaveRequest({ payload }: any): SagaIterator {
    try {
        const response = yield call(getLeaveRequestApi, payload);
        if (response.data.success) {
            yield put(getLeaveRequestSuccess(response.data));
        } else {
            yield put(getLeaveRequestFailure(response.data.message || "Failed to fetch leave request"));
        }
    } catch (error: any) {
        yield put(getLeaveRequestFailure(error.response?.data?.message || "Failed to fetch leave request"));
    }
}

function* onUpdateLeaveRequest({ payload }: any): SagaIterator {
    try {
        const { id, payload: data } = payload;
        const response = yield call(updateLeaveRequestApi, id, data);
        if (response.data.success) {
            yield put(updateLeaveRequestSuccess(response.data));
        } else {
            yield put(updateLeaveRequestFailure(response.data.message || "Failed to update leave request"));
        }
    } catch (error: any) {
        yield put(updateLeaveRequestFailure(error.response?.data?.message || "Failed to update leave request"));
    }
}

function* onUpdateLeaveStatus({ payload }: any): SagaIterator {
    try {
        const { id, status, rejection_reason } = payload;
        const response = yield call(updateLeaveStatusApi, id, status, rejection_reason);
        if (response.data.success) {
            yield put(updateLeaveStatusSuccess(response.data));
        } else {
            yield put(updateLeaveStatusFailure(response.data.message || "Failed to update status"));
        }
    } catch (error: any) {
        yield put(updateLeaveStatusFailure(error.response?.data?.message || "Failed to update status"));
    }
}

function* onDeleteLeaveRequest({ payload }: any): SagaIterator {
    try {
        const response = yield call(deleteLeaveRequestApi, payload);
        if (response.data.success) {
            yield put(deleteLeaveRequestSuccess({ ...response.data, id: payload }));
        } else {
            yield put(deleteLeaveRequestFailure(response.data.message || "Failed to delete leave request"));
        }
    } catch (error: any) {
        yield put(deleteLeaveRequestFailure(error.response?.data?.message || "Failed to delete leave request"));
    }
}

export default function* leaveRequestSaga(): SagaIterator {
    yield takeEvery(CREATE_LEAVE_REQUEST_REQUEST, onCreateLeaveRequest);
    yield takeEvery(GET_LEAVE_REQUESTS_REQUEST, onGetLeaveRequests);
    yield takeEvery(GET_LEAVE_REQUEST_REQUEST, onGetLeaveRequest);
    yield takeEvery(UPDATE_LEAVE_REQUEST_REQUEST, onUpdateLeaveRequest);
    yield takeEvery(UPDATE_LEAVE_STATUS_REQUEST, onUpdateLeaveStatus);
    yield takeEvery(DELETE_LEAVE_REQUEST_REQUEST, onDeleteLeaveRequest);
}
