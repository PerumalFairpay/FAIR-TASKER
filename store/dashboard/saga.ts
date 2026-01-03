
import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import { GET_DASHBOARD_DATA } from "./actionTypes";
import {
    getDashboardDataSuccess,
    getDashboardDataFail,
} from "./action";
import api from "../api";

// API Functions
function getDashboardDataApi() {
    return api.get("/dashboard");
}

// Sagas
function* fetchDashboardData(): SagaIterator {
    try {
        const response = yield call(getDashboardDataApi);
        if (response.data && response.data.success) {
            yield put(getDashboardDataSuccess(response.data.data));
        } else {
            yield put(getDashboardDataFail(response.data.message));
        }
    } catch (error: any) {
        yield put(getDashboardDataFail(error.response?.data?.message || error.message));
    }
}

export default function* dashboardSaga(): SagaIterator {
    yield takeEvery(GET_DASHBOARD_DATA, fetchDashboardData);
}
