import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
    LOGIN_REQUEST, REGISTER_REQUEST, LOGOUT_REQUEST
} from "./actionType";
import {
    loginSuccess, loginFailure,
    registerSuccess, registerFailure,
    logoutSuccess, logoutFailure
} from "./action";
import axios from "axios";

function loginApi(payload: any) {
    return axios.post("/login", payload);
}

function registerApi(payload: any) {
    return axios.post("/register", payload);
}

function logoutApi() {
    return axios.post("/logout");
}

function* onLogin({ payload }: any): SagaIterator {
    try {
        const response = yield call(loginApi, payload);
        if (response.data.status) {
            yield put(loginSuccess(response.data));
            localStorage.setItem("token", response.data.token);
        } else {
            yield put(loginFailure(response.data.message || "Login failed"));
        }
    } catch (error: any) {
        yield put(loginFailure(error.response?.data?.message || "Login failed"));
    }
}

function* onRegister({ payload }: any): SagaIterator {
    try {
        const response = yield call(registerApi, payload);
        if (response.data.status) {
            yield put(registerSuccess(response.data));
        } else {
            yield put(registerFailure(response.data.message || "Registration failed"));
        }
    } catch (error: any) {
        yield put(registerFailure(error.response?.data?.message || "Registration failed"));
    }
}

function* onLogout(): SagaIterator {
    try {
        const response = yield call(logoutApi);
        yield put(logoutSuccess(response.data));
        localStorage.removeItem("token");
    } catch (error: any) {
        yield put(logoutFailure(error.response?.data?.message || "Logout failed"));
    }
}

export default function* authSaga(): SagaIterator {
    yield takeEvery(LOGIN_REQUEST, onLogin);
    yield takeEvery(REGISTER_REQUEST, onRegister);
    yield takeEvery(LOGOUT_REQUEST, onLogout);
}
