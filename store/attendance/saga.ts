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
import axios from "axios";

// Helper function to get location coordinates and address
interface LocationData {
  address: string;
  latitude: number | null;
  longitude: number | null;
}

const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        address: "Geolocation not supported by browser",
        latitude: null,
        longitude: null,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
          if (!apiKey) {
            resolve({
              address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
              latitude,
              longitude,
            });
            return;
          }
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`,
          );
          if (response.data.results && response.data.results.length > 0) {
            resolve({
              address: response.data.results[0].formatted_address,
              latitude,
              longitude,
            });
          } else {
            resolve({
              address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
              latitude,
              longitude,
            });
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          resolve({
            address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
            latitude,
            longitude,
          });
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errMsg = "Location Access Denied";
        if (error.code === error.POSITION_UNAVAILABLE)
          errMsg = "Location Unavailable";
        if (error.code === error.TIMEOUT) errMsg = "Location Request Timeout";
        resolve({ address: errMsg, latitude: null, longitude: null });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  });
};

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
    // 1. Fetch location first
    const locationData: {
      address: string;
      latitude: number | null;
      longitude: number | null;
    } = yield call(getCurrentLocation);

    // 2. Attach location + coordinates to payload
    const finalPayload = {
      ...payload,
      location: locationData.address,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
    };

    // 3. Make the API call
    const response = yield call(clockInApi, finalPayload);
    yield put(clockInSuccess(response.data));
  } catch (error: any) {
    yield put(
      clockInFailure(error.response?.data?.message || "Failed to clock in"),
    );
  }
}

function* onClockOut({ payload }: any): SagaIterator {
  try {
    // 1. Fetch location first
    const locationData: {
      address: string;
      latitude: number | null;
      longitude: number | null;
    } = yield call(getCurrentLocation);

    // 2. Attach location + coordinates to payload
    const finalPayload = {
      ...payload,
      location: locationData.address,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
    };

    // 3. Make the API call
    const response = yield call(clockOutApi, finalPayload);
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
