import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
  CLOCK_IN_REQUEST,
  CLOCK_OUT_REQUEST,
  GET_MY_ATTENDANCE_HISTORY_REQUEST,
  GET_ALL_ATTENDANCE_REQUEST,
  IMPORT_ATTENDANCE_REQUEST,
  EDIT_ATTENDANCE_REQUEST,
} from "./actionType";
import {
  clockInSuccess,
  clockInFailure,
  clockOutSuccess,
  clockOutFailure,
  getMyAttendanceHistorySuccess,
  getMyAttendanceHistoryFailure,
  getAllAttendanceSuccess,
  getAllAttendanceFailure,
  importAttendanceSuccess,
  importAttendanceFailure,
  editAttendanceSuccess,
  editAttendanceFailure,
} from "./action";
import api from "../api";

// API Functions
function clockInApi(payload: any) {
  return api.post("/attendance/clock-in", payload);
}

function clockOutApi(payload: any) {
  return api.put("/attendance/clock-out", payload);
}

function importAttendanceApi(payload: any) {
  const formData = new FormData();
  formData.append("file", payload);
  return api.post("/attendance/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function getMyAttendanceHistoryApi(filters?: any) {
  let url = "/attendance/my-history";
  if (filters) {
    const params = new URLSearchParams();
    if (filters.start_date) params.append("start_date", filters.start_date);
    if (filters.end_date) params.append("end_date", filters.end_date);
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
  }
  return api.get(url);
}

function getAllAttendanceApi(filters?: any) {
  let url = "/attendance/";
  const params = new URLSearchParams();

  if (filters) {
    if (typeof filters === "string") {
      params.append("date", filters);
    } else {
      if (filters.date) params.append("date", filters.date);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.employee_id)
        params.append("employee_id", filters.employee_id);
      if (filters.status) params.append("status", filters.status);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
    }
  }

  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  return api.get(url);
}

function editAttendanceApi(payload: { id: string; data: any }) {
  return api.put(`/attendance/edit/${payload.id}`, payload.data);
}

// Sagas
function* onClockIn({ payload }: any): SagaIterator {
  try {
    const response = yield call(clockInApi, payload);
    yield put(clockInSuccess(response.data));
  } catch (error: any) {
    yield put(
      clockInFailure(error.response?.data?.message || "Failed to clock in"),
    );
  }
}

function* onClockOut({ payload }: any): SagaIterator {
  try {
    const response = yield call(clockOutApi, payload);
    yield put(clockOutSuccess(response.data));
  } catch (error: any) {
    yield put(
      clockOutFailure(error.response?.data?.message || "Failed to clock out"),
    );
  }
}

function* onGetMyAttendanceHistory({ payload }: any): SagaIterator {
  try {
    const response = yield call(getMyAttendanceHistoryApi, payload);
    yield put(getMyAttendanceHistorySuccess(response.data));
  } catch (error: any) {
    yield put(
      getMyAttendanceHistoryFailure(
        error.response?.data?.message || "Failed to fetch history",
      ),
    );
  }
}

function* onGetAllAttendance({ payload }: any): SagaIterator {
  try {
    const response = yield call(getAllAttendanceApi, payload);
    yield put(getAllAttendanceSuccess(response.data));
  } catch (error: any) {
    yield put(
      getAllAttendanceFailure(
        error.response?.data?.message || "Failed to fetch attendance records",
      ),
    );
  }
}

function* onImportAttendance({ payload }: any): SagaIterator {
  try {
    const response = yield call(importAttendanceApi, payload);
    yield put(importAttendanceSuccess(response.data));
  } catch (error: any) {
    yield put(
      importAttendanceFailure(
        error.response?.data?.message || "Failed to import attendance",
      ),
    );
  }
}

function* onEditAttendance({ payload }: any): SagaIterator {
  try {
    const response = yield call(editAttendanceApi, payload);
    yield put(editAttendanceSuccess(response.data));
  } catch (error: any) {
    yield put(
      editAttendanceFailure(
        error.response?.data?.message || "Failed to update attendance record",
      ),
    );
  }
}

export default function* attendanceSaga(): SagaIterator {
  yield takeEvery(CLOCK_IN_REQUEST, onClockIn);
  yield takeEvery(CLOCK_OUT_REQUEST, onClockOut);
  yield takeEvery(GET_MY_ATTENDANCE_HISTORY_REQUEST, onGetMyAttendanceHistory);
  yield takeEvery(GET_ALL_ATTENDANCE_REQUEST, onGetAllAttendance);
  yield takeEvery(IMPORT_ATTENDANCE_REQUEST, onImportAttendance);
  yield takeEvery(EDIT_ATTENDANCE_REQUEST, onEditAttendance);
}
