import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
    GET_PROFILE_REQUEST,
    UPDATE_PROFILE_REQUEST,
    CHANGE_PASSWORD_REQUEST
} from "./actionType";
import {
    getProfileSuccess, getProfileFailure,
    updateProfileSuccess, updateProfileFailure,
    changePasswordSuccess, changePasswordFailure
} from "./action";
import api from "../api";

function getProfileApi() {
    return api.get("/profile/");
}

function updateProfileApi(data: FormData) {
    return api.put("/profile/update", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

function changePasswordApi(data: any) {
    return api.put("/profile/change-password", data);
}

function* onGetProfile(): SagaIterator {
    try {
        const response = yield call(getProfileApi);
        if (response.data.success) {
            yield put(getProfileSuccess(response.data));
        } else {
            yield put(getProfileFailure(response.data.message || "Failed to fetch profile"));
        }
    } catch (error: any) {
        yield put(getProfileFailure(error.response?.data?.message || "Failed to fetch profile"));
    }
}

function* onUpdateProfile({ payload }: any): SagaIterator {
    try {
        const response = yield call(updateProfileApi, payload);
        if (response.data.success) {
            yield put(updateProfileSuccess(response.data)); 
        } else {
            yield put(updateProfileFailure(response.data.message || "Failed to update profile"));
        }
    } catch (error: any) {
        yield put(updateProfileFailure(error.response?.data?.message || "Failed to update profile"));
    }
}

function* onChangePassword({ payload }: any): SagaIterator {
    try {
        const response = yield call(changePasswordApi, payload);
        if (response.data.success) {
            yield put(changePasswordSuccess(response.data.message || "Password changed successfully"));
        } else {
            yield put(changePasswordFailure(response.data.message || "Failed to change password"));
        }
    } catch (error: any) {
        yield put(changePasswordFailure(error.response?.data?.message || "Failed to change password"));
    }
}

export default function* profileSaga(): SagaIterator {
    yield takeEvery(GET_PROFILE_REQUEST, onGetProfile);
    yield takeEvery(UPDATE_PROFILE_REQUEST, onUpdateProfile);
    yield takeEvery(CHANGE_PASSWORD_REQUEST, onChangePassword);
}
