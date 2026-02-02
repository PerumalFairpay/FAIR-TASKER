import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
  GET_SETTINGS_REQUEST,
  GET_PUBLIC_SETTINGS_REQUEST,
  UPDATE_SETTINGS_REQUEST,
} from "./actionType";

import {
  getSettingsSuccess,
  getSettingsFailure,
  getPublicSettingsSuccess,
  getPublicSettingsFailure,
  updateSettingsSuccess,
  updateSettingsFailure,
} from "./action";
import api from "../api";

function getSettingsApi() {
  return api.get("/settings/");
}

function getPublicSettingsApi() {
  return api.get("/settings/public");
}

function updateSettingsApi(payload: any) {
  return api.put("/settings/", payload);
}

function* onGetSettings(): SagaIterator {
  try {
    const response = yield call(getSettingsApi);
    if (response.data.success) {
      yield put(getSettingsSuccess(response.data));
    } else {
      yield put(
        getSettingsFailure(response.data.message || "Failed to fetch settings"),
      );
    }
  } catch (error: any) {
    yield put(
      getSettingsFailure(
        error.response?.data?.message || "Failed to fetch settings",
      ),
    );
  }
}

function* onUpdateSettings({ payload }: any): SagaIterator {
  try {
    const response = yield call(updateSettingsApi, payload);
    if (response.data.success) {
      yield put(updateSettingsSuccess(response.data));
    } else {
      yield put(
        updateSettingsFailure(
          response.data.message || "Failed to update settings",
        ),
      );
    }
  } catch (error: any) {
    yield put(
      updateSettingsFailure(
        error.response?.data?.message || "Failed to update settings",
      ),
    );
  }
}

function* onGetPublicSettings(): SagaIterator {
  try {
    const response = yield call(getPublicSettingsApi);
    if (response.data.success) {
      yield put(getPublicSettingsSuccess(response.data));
    } else {
      yield put(
        getPublicSettingsFailure(
          response.data.message || "Failed to fetch public settings",
        ),
      );
    }
  } catch (error: any) {
    yield put(
      getPublicSettingsFailure(
        error.response?.data?.message || "Failed to fetch public settings",
      ),
    );
  }
}

export default function* settingsSaga(): SagaIterator {
  yield takeEvery(GET_SETTINGS_REQUEST, onGetSettings);
  yield takeEvery(GET_PUBLIC_SETTINGS_REQUEST, onGetPublicSettings);
  yield takeEvery(UPDATE_SETTINGS_REQUEST, onUpdateSettings);
}
