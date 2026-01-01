import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
    CLOCK_IN_REQUEST,
    CLOCK_OUT_REQUEST,
    GET_MY_ATTENDANCE_HISTORY_REQUEST,
    GET_ALL_ATTENDANCE_REQUEST
} from "./actionType";
import {
    clockInSuccess, clockInFailure,
    clockOutSuccess, clockOutFailure,
    getMyAttendanceHistorySuccess, getMyAttendanceHistoryFailure,
    getAllAttendanceSuccess, getAllAttendanceFailure
} from "./action";
import api from "../api";

// API Functions
function clockInApi(payload: any) {
    return api.post("/attendance/clock-in", payload);
}

function clockOutApi(payload: any) {
    return api.put("/attendance/clock-out", payload);
}

function getMyAttendanceHistoryApi() {
    return api.get("/attendance/my-history");
}

function getAllAttendanceApi(date?: string) {
    let url = "/attendance/";
    if (date) {
        url += `?date=${date}`;
    }
    return api.get(url);
}

// Sagas
function* onClockIn({ payload }: any): SagaIterator {
    try {
        const response = yield call(clockInApi, payload);
        yield put(clockInSuccess(response.data));
    } catch (error: any) {
        yield put(clockInFailure(error.response?.data?.message || "Failed to clock in"));
    }
}

function* onClockOut({ payload }: any): SagaIterator {
    try {
        const response = yield call(clockOutApi, payload);
        yield put(clockOutSuccess(response.data));
    } catch (error: any) {
        yield put(clockOutFailure(error.response?.data?.message || "Failed to clock out"));
    }
}

function* onGetMyAttendanceHistory(): SagaIterator {
    try {
        const response = yield call(getMyAttendanceHistoryApi);
        yield put(getMyAttendanceHistorySuccess(response.data));
    } catch (error: any) {
        yield put(getMyAttendanceHistoryFailure(error.response?.data?.message || "Failed to fetch history"));
    }
}

function* onGetAllAttendance({ payload }: any): SagaIterator {
    try {
        const response = yield call(getAllAttendanceApi, payload);
        yield put(getAllAttendanceSuccess(response.data));
    } catch (error: any) {
        yield put(getAllAttendanceFailure(error.response?.data?.message || "Failed to fetch attendance records"));
    }
}

export default function* attendanceSaga(): SagaIterator {
    yield takeEvery(CLOCK_IN_REQUEST, onClockIn);
    yield takeEvery(CLOCK_OUT_REQUEST, onClockOut);
    yield takeEvery(GET_MY_ATTENDANCE_HISTORY_REQUEST, onGetMyAttendanceHistory);
    yield takeEvery(GET_ALL_ATTENDANCE_REQUEST, onGetAllAttendance);
}
