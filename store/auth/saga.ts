import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
    loginSuccess,
    loginFailure,
    registerSuccess,
    registerFailure,
    logoutSuccess,
    logoutFailure
} from "./action";
import {
    LOGIN_REQUEST,
    REGISTER_REQUEST,
    LOGOUT_REQUEST
} from "./actionType";
import api from "../api";

function loginApi(payload: any) {
    return api.post("/login", payload);
}

function registerApi(payload: any) {
    return api.post("/register", payload);
}

function logoutApi() {
    return api.post("/logout");
}

function* onLogin({ payload }: { type: string; payload: any }): SagaIterator {
    try {
        const response = yield call(loginApi, payload);
        yield put(loginSuccess(response.data));
    } catch (error: any) {
        yield put(loginFailure(error.response?.data?.detail || "Login failed"));
    }
}

function* onRegister({ payload }: { type: string; payload: any }): SagaIterator {
    try {
        const response = yield call(registerApi, payload);
        yield put(registerSuccess(response.data));
    } catch (error: any) {
        yield put(registerFailure(error.response?.data?.detail || "Registration failed"));
    }
}

function* onLogout(): SagaIterator {
    try {
        yield call(logoutApi);
        yield put(logoutSuccess());
    } catch (error: any) {
        yield put(logoutFailure(error.response?.data?.detail || "Logout failed"));
    }
}

export default function* authSaga(): SagaIterator {
    yield takeEvery(LOGIN_REQUEST, onLogin);
    yield takeEvery(REGISTER_REQUEST, onRegister);
    yield takeEvery(LOGOUT_REQUEST, onLogout);
}
