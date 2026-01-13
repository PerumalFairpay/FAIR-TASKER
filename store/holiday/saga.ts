import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
    CREATE_HOLIDAY_REQUEST,
    GET_HOLIDAYS_REQUEST,
    GET_HOLIDAY_REQUEST,
    UPDATE_HOLIDAY_REQUEST,
    DELETE_HOLIDAY_REQUEST
} from "./actionType";
import {
    createHolidaySuccess, createHolidayFailure,
    getHolidaysSuccess, getHolidaysFailure,
    getHolidaySuccess, getHolidayFailure,
    updateHolidaySuccess, updateHolidayFailure,
    deleteHolidaySuccess, deleteHolidayFailure
} from "./action";
import api from "../api";

// API Functions
function createHolidayApi(payload: any) {
    return api.post("/holidays/create", payload);
}

function getHolidaysApi() {
    return api.get("/holidays/all");
}

function getHolidayApi(id: string) {
    return api.get(`/holidays/${id}`);
}

function updateHolidayApi(id: string, payload: any) {
    return api.put(`/holidays/update/${id}`, payload);
}

function deleteHolidayApi(id: string) {
    return api.delete(`/holidays/delete/${id}`);
}

// Sagas
function* onCreateHoliday({ payload }: any): SagaIterator {
    try {
        const response = yield call(createHolidayApi, payload);
        if (response.data.success) {
            yield put(createHolidaySuccess(response.data));
        } else {
            yield put(createHolidayFailure(response.data.message || "Failed to create holiday"));
        }
    } catch (error: any) {
        yield put(createHolidayFailure(error.response?.data?.message || "Failed to create holiday"));
    }
}

function* onGetHolidays(): SagaIterator {
    try {
        const response = yield call(getHolidaysApi);
        if (response.data.success) {
            yield put(getHolidaysSuccess(response.data));
        } else {
            yield put(getHolidaysFailure(response.data.message || "Failed to fetch holidays"));
        }
    } catch (error: any) {
        yield put(getHolidaysFailure(error.response?.data?.message || "Failed to fetch holidays"));
    }
}

function* onGetHoliday({ payload }: any): SagaIterator {
    try {
        const response = yield call(getHolidayApi, payload);
        if (response.data.success) {
            yield put(getHolidaySuccess(response.data));
        } else {
            yield put(getHolidayFailure(response.data.message || "Failed to fetch holiday"));
        }
    } catch (error: any) {
        yield put(getHolidayFailure(error.response?.data?.message || "Failed to fetch holiday"));
    }
}

function* onUpdateHoliday({ payload }: any): SagaIterator {
    try {
        const { id, payload: data } = payload;
        const response = yield call(updateHolidayApi, id, data);
        if (response.data.success) {
            yield put(updateHolidaySuccess(response.data));
        } else {
            yield put(updateHolidayFailure(response.data.message || "Failed to update holiday"));
        }
    } catch (error: any) {
        yield put(updateHolidayFailure(error.response?.data?.message || "Failed to update holiday"));
    }
}

function* onDeleteHoliday({ payload }: any): SagaIterator {
    try {
        const response = yield call(deleteHolidayApi, payload);
        if (response.data.success) {
            yield put(deleteHolidaySuccess({ ...response.data, id: payload }));
        } else {
            yield put(deleteHolidayFailure(response.data.message || "Failed to delete holiday"));
        }
    } catch (error: any) {
        yield put(deleteHolidayFailure(error.response?.data?.message || "Failed to delete holiday"));
    }
}

export default function* holidaySaga(): SagaIterator {
    yield takeEvery(CREATE_HOLIDAY_REQUEST, onCreateHoliday);
    yield takeEvery(GET_HOLIDAYS_REQUEST, onGetHolidays);
    yield takeEvery(GET_HOLIDAY_REQUEST, onGetHoliday);
    yield takeEvery(UPDATE_HOLIDAY_REQUEST, onUpdateHoliday);
    yield takeEvery(DELETE_HOLIDAY_REQUEST, onDeleteHoliday);
}
