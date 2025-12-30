import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
    CREATE_EXPENSE_REQUEST,
    GET_EXPENSES_REQUEST,
    GET_EXPENSE_REQUEST,
    UPDATE_EXPENSE_REQUEST,
    DELETE_EXPENSE_REQUEST
} from "./actionType";
import {
    createExpenseSuccess, createExpenseFailure,
    getExpensesSuccess, getExpensesFailure,
    getExpenseSuccess, getExpenseFailure,
    updateExpenseSuccess, updateExpenseFailure,
    deleteExpenseSuccess, deleteExpenseFailure
} from "./action";
import api from "../api";

// API Functions
function createExpenseApi(payload: FormData) {
    return api.post("/expenses/create", payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

function getExpensesApi() {
    return api.get("/expenses/all");
}

function getExpenseApi(id: string) {
    return api.get(`/expenses/${id}`);
}

function updateExpenseApi(id: string, payload: FormData) {
    return api.put(`/expenses/update/${id}`, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

function deleteExpenseApi(id: string) {
    return api.delete(`/expenses/delete/${id}`);
}

// Sagas
function* onCreateExpense({ payload }: any): SagaIterator {
    try {
        const response = yield call(createExpenseApi, payload);
        yield put(createExpenseSuccess(response.data));
    } catch (error: any) {
        yield put(createExpenseFailure(error.response?.data?.message || "Failed to create expense"));
    }
}

function* onGetExpenses(): SagaIterator {
    try {
        const response = yield call(getExpensesApi);
        yield put(getExpensesSuccess(response.data));
    } catch (error: any) {
        yield put(getExpensesFailure(error.response?.data?.message || "Failed to fetch expenses"));
    }
}

function* onGetExpense({ payload }: any): SagaIterator {
    try {
        const response = yield call(getExpenseApi, payload);
        yield put(getExpenseSuccess(response.data));
    } catch (error: any) {
        yield put(getExpenseFailure(error.response?.data?.message || "Failed to fetch expense"));
    }
}

function* onUpdateExpense({ payload }: any): SagaIterator {
    try {
        const { id, payload: data } = payload;
        const response = yield call(updateExpenseApi, id, data);
        yield put(updateExpenseSuccess(response.data));
    } catch (error: any) {
        yield put(updateExpenseFailure(error.response?.data?.message || "Failed to update expense"));
    }
}

function* onDeleteExpense({ payload }: any): SagaIterator {
    try {
        const response = yield call(deleteExpenseApi, payload);
        yield put(deleteExpenseSuccess({ ...response.data, id: payload }));
    } catch (error: any) {
        yield put(deleteExpenseFailure(error.response?.data?.message || "Failed to delete expense"));
    }
}

export default function* expenseSaga(): SagaIterator {
    yield takeEvery(CREATE_EXPENSE_REQUEST, onCreateExpense);
    yield takeEvery(GET_EXPENSES_REQUEST, onGetExpenses);
    yield takeEvery(GET_EXPENSE_REQUEST, onGetExpense);
    yield takeEvery(UPDATE_EXPENSE_REQUEST, onUpdateExpense);
    yield takeEvery(DELETE_EXPENSE_REQUEST, onDeleteExpense);
}
