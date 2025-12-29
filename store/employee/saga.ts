import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
    GET_EMPLOYEE_LIST_REQUEST,
    ADD_EMPLOYEE_REQUEST,
    VIEW_EMPLOYEE_REQUEST,
    UPDATE_EMPLOYEE_REQUEST,
    DELETE_EMPLOYEE_REQUEST,
} from "./actionType";
import {
    getEmployeeListSuccess,
    getEmployeeListFailure,
    addEmployeeSuccess,
    addEmployeeFailure,
    viewEmployeeSuccess,
    viewEmployeeFailure,
    updateEmployeeSuccess,
    updateEmployeeFailure,
    deleteEmployeeSuccess,
    deleteEmployeeFailure,
    getEmployeeListRequest,
} from "./action";
import api from "../api";

function getEmployeeListApi(page: number, perPage: number) {
    return api.get(`employeeList?page=${page}&perPage=${perPage}`);
}

function addEmployeeApi(data: FormData) {
    return api.post("employee", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

function viewEmployeeApi(id: string | number) {
    return api.get(`employee/${id}`);
}

function updateEmployeeApi(id: string | number, data: FormData) {
    return api.post(`employee/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

function deleteEmployeeApi(id: string | number) {
    return api.delete(`employee/${id}`);
}

function* onGetEmployeeList({ payload }: any): SagaIterator {
    try {
        const { page, perPage } = payload;
        const response = yield call(getEmployeeListApi, page, perPage);
        if (response.data.status) {
            yield put(getEmployeeListSuccess(response.data.data));
        } else {
            yield put(getEmployeeListFailure(response.data.message));
        }
    } catch (error: any) {
        yield put(getEmployeeListFailure(error.response?.data?.message || "Failed to fetch employee list"));
    }
}

function* onAddEmployee({ payload }: any): SagaIterator {
    try {
        const response = yield call(addEmployeeApi, payload);
        if (response.data.status) {
            yield put(addEmployeeSuccess(response.data.message));
            yield put(getEmployeeListRequest()); // Refresh list
        } else {
            yield put(addEmployeeFailure(response.data.message));
        }
    } catch (error: any) {
        yield put(addEmployeeFailure(error.response?.data?.message || "Failed to add employee"));
    }
}

function* onViewEmployee({ payload }: any): SagaIterator {
    try {
        const response = yield call(viewEmployeeApi, payload);
        if (response.data.status) {
            yield put(viewEmployeeSuccess(response.data));
        } else {
            yield put(viewEmployeeFailure(response.data.message));
        }
    } catch (error: any) {
        yield put(viewEmployeeFailure(error.response?.data?.message || "Failed to fetch employee details"));
    }
}

function* onUpdateEmployee({ payload }: any): SagaIterator {
    try {
        const { id, data } = payload;
        const response = yield call(updateEmployeeApi, id, data);
        if (response.data.status) {
            yield put(updateEmployeeSuccess(response.data.message));
            yield put(getEmployeeListRequest()); // Refresh list
        } else {
            yield put(updateEmployeeFailure(response.data.message));
        }
    } catch (error: any) {
        yield put(updateEmployeeFailure(error.response?.data?.message || "Failed to update employee"));
    }
}

function* onDeleteEmployee({ payload }: any): SagaIterator {
    try {
        const response = yield call(deleteEmployeeApi, payload);
        if (response.data.status) {
            yield put(deleteEmployeeSuccess(response.data.message));
            yield put(getEmployeeListRequest()); // Refresh list
        } else {
            yield put(deleteEmployeeFailure(response.data.message));
        }
    } catch (error: any) {
        yield put(deleteEmployeeFailure(error.response?.data?.message || "Failed to delete employee"));
    }
}

export default function* employeeSaga(): SagaIterator {
    yield takeEvery(GET_EMPLOYEE_LIST_REQUEST, onGetEmployeeList);
    yield takeEvery(ADD_EMPLOYEE_REQUEST, onAddEmployee);
    yield takeEvery(VIEW_EMPLOYEE_REQUEST, onViewEmployee);
    yield takeEvery(UPDATE_EMPLOYEE_REQUEST, onUpdateEmployee);
    yield takeEvery(DELETE_EMPLOYEE_REQUEST, onDeleteEmployee);
}
