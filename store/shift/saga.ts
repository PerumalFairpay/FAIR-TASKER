import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
  CREATE_SHIFT_REQUEST,
  GET_SHIFTS_REQUEST,
  GET_SHIFT_REQUEST,
  UPDATE_SHIFT_REQUEST,
  DELETE_SHIFT_REQUEST,
} from "./actionType";
import {
  createShiftSuccess,
  createShiftFailure,
  getShiftsSuccess,
  getShiftsFailure,
  getShiftSuccess,
  getShiftFailure,
  updateShiftSuccess,
  updateShiftFailure,
  deleteShiftSuccess,
  deleteShiftFailure,
} from "./action";
import api from "../api";

// API Functions
function createShiftApi(payload: any) {
  return api.post("/shifts/", payload);
}

function getShiftsApi() {
  return api.get("/shifts/");
}

function getShiftApi(id: string) {
  return api.get(`/shifts/${id}`);
}

function updateShiftApi(id: string, payload: any) {
  return api.put(`/shifts/${id}`, payload);
}

function deleteShiftApi(id: string) {
  return api.delete(`/shifts/${id}`);
}

// Sagas
function* onCreateShift({ payload }: any): SagaIterator {
  try {
    const response = yield call(createShiftApi, payload);
    if (response.data.success) {
      yield put(createShiftSuccess(response.data));
    } else {
      yield put(
        createShiftFailure(response.data.message || "Failed to create shift"),
      );
    }
  } catch (error: any) {
    yield put(
      createShiftFailure(
        error.response?.data?.message || "Failed to create shift",
      ),
    );
  }
}

function* onGetShifts(): SagaIterator {
  try {
    const response = yield call(getShiftsApi);
    if (response.data.success) {
      yield put(getShiftsSuccess(response.data));
    } else {
      yield put(
        getShiftsFailure(response.data.message || "Failed to fetch shifts"),
      );
    }
  } catch (error: any) {
    yield put(
      getShiftsFailure(
        error.response?.data?.message || "Failed to fetch shifts",
      ),
    );
  }
}

function* onGetShift({ payload }: any): SagaIterator {
  try {
    const response = yield call(getShiftApi, payload);
    if (response.data.success) {
      yield put(getShiftSuccess(response.data));
    } else {
      yield put(
        getShiftFailure(response.data.message || "Failed to fetch shift"),
      );
    }
  } catch (error: any) {
    yield put(
      getShiftFailure(error.response?.data?.message || "Failed to fetch shift"),
    );
  }
}

function* onUpdateShift({ payload }: any): SagaIterator {
  try {
    const { id, payload: data } = payload;
    const response = yield call(updateShiftApi, id, data);
    if (response.data.success) {
      yield put(updateShiftSuccess(response.data));
    } else {
      yield put(
        updateShiftFailure(response.data.message || "Failed to update shift"),
      );
    }
  } catch (error: any) {
    yield put(
      updateShiftFailure(
        error.response?.data?.message || "Failed to update shift",
      ),
    );
  }
}

function* onDeleteShift({ payload }: any): SagaIterator {
  try {
    const response = yield call(deleteShiftApi, payload);
    if (response.data.success) {
      // Append ID to payload for reducer to filter out and display correct message
      yield put(deleteShiftSuccess({ ...response.data, id: payload }));
    } else {
      yield put(
        deleteShiftFailure(response.data.message || "Failed to delete shift"),
      );
    }
  } catch (error: any) {
    yield put(
      deleteShiftFailure(
        error.response?.data?.message || "Failed to delete shift",
      ),
    );
  }
}

export default function* shiftSaga(): SagaIterator {
  yield takeEvery(CREATE_SHIFT_REQUEST, onCreateShift);
  yield takeEvery(GET_SHIFTS_REQUEST, onGetShifts);
  yield takeEvery(GET_SHIFT_REQUEST, onGetShift);
  yield takeEvery(UPDATE_SHIFT_REQUEST, onUpdateShift);
  yield takeEvery(DELETE_SHIFT_REQUEST, onDeleteShift);
}
