import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
    LOGIN_REQUEST, REGISTER_REQUEST, LOGOUT_REQUEST, GET_USER_REQUEST
} from "./actionType";
import {
    loginSuccess, loginFailure,
    registerSuccess, registerFailure,
    logoutSuccess, logoutFailure,
    getUserSuccess, getUserFailure
} from "./action";
import api from "../api";

function loginApi(payload: any) {
    return api.post("/auth/login", payload);
}

function registerApi(payload: any) {
    return api.post("/auth/register", payload);
}

function logoutApi() {
    return api.post("/auth/logout");
}

function getUserApi() {
    return api.get("/auth/me");
}

function* onLogin({ payload }: any): SagaIterator {
    try {
        const response = yield call(loginApi, payload);
        if (response.data.success) {
            yield put(loginSuccess(response.data));
            // Fetch full profile immediately after successful login
            yield put({ type: GET_USER_REQUEST });
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
        if (response.data.id || response.data.success) {
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
        localStorage.removeItem("name");
        localStorage.removeItem("email");
    } catch (error: any) {
        yield put(logoutFailure(error.response?.data?.message || "Logout failed"));
    }
}

function* onGetUser(): SagaIterator {
    try {
        const response = yield call(getUserApi);
        if (response.data.success) {
            yield put(getUserSuccess(response.data));
            if (response.data.data) {
                const userData = response.data.data;
                const fullName = userData.name || `${userData.first_name || ""} ${userData.last_name || ""}`.trim();
                localStorage.setItem("name", fullName);
                localStorage.setItem("email", userData.email);
            }
        } else {
            yield put(getUserFailure(response.data.message || "Failed to fetch user"));
        }
    } catch (error: any) {
        yield put(getUserFailure(error.response?.data?.message || "Failed to fetch user"));
    }
}

export default function* authSaga(): SagaIterator {
    yield takeEvery(LOGIN_REQUEST, onLogin);
    yield takeEvery(REGISTER_REQUEST, onRegister);
    yield takeEvery(LOGOUT_REQUEST, onLogout);
    yield takeEvery(GET_USER_REQUEST, onGetUser);
}
