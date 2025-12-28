import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import { GET_EMPLOYEE_LIST_REQUEST } from "./actionType";
import { getEmployeeListSuccess, getEmployeeListFailure } from "./action";
import api from "../api";

function getEmployeeListApi(page: number, perPage: number) {
    return api.get(`employeeList `);
}

function* onGetEmployeeList({ payload }: any): SagaIterator {
    try {
        const { page, perPage } = payload;
        const response = yield call(getEmployeeListApi, page, perPage);
        if (response.data.status) {
            yield put(getEmployeeListSuccess(response.data.data)); // Assuming the API returns structure { status: true, data: { ...pagination_data } }
        } else {
            yield put(getEmployeeListFailure(response.data.message));
        }
    } catch (error: any) {
        yield put(getEmployeeListFailure(error.response?.data?.message || "Failed to fetch employee list"));
    }
}

export default function* employeeSaga(): SagaIterator {
    yield takeEvery(GET_EMPLOYEE_LIST_REQUEST, onGetEmployeeList);
}
