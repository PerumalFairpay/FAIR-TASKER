import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import { GET_SETTINGS_REQUEST } from "./actionType";
import { getSettingsSuccess, getSettingsFailure } from "./action";
import axios from "axios";

function getSettingsApi() {
    return axios.get("/settingsDetails");
}

function* onGetSettings(): SagaIterator {
    try {
        const response = yield call(getSettingsApi);
        if (response.data.status) {
            yield put(getSettingsSuccess(response.data));
        } else {
            yield put(getSettingsFailure(response.data.message || "Failed to fetch settings"));
        }
    } catch (error: any) {
        yield put(getSettingsFailure(error.response?.data?.message || "Failed to fetch settings"));
    }
}

export default function* settingsSaga(): SagaIterator {
    yield takeEvery(GET_SETTINGS_REQUEST, onGetSettings);
}
