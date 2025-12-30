import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
    CREATE_EXPENSE_CATEGORY_REQUEST,
    GET_EXPENSE_CATEGORIES_REQUEST,
    GET_EXPENSE_CATEGORY_REQUEST,
    UPDATE_EXPENSE_CATEGORY_REQUEST,
    DELETE_EXPENSE_CATEGORY_REQUEST
} from "./actionType";
import {
    createExpenseCategorySuccess, createExpenseCategoryFailure,
    getExpenseCategoriesSuccess, getExpenseCategoriesFailure,
    getExpenseCategorySuccess, getExpenseCategoryFailure,
    updateExpenseCategorySuccess, updateExpenseCategoryFailure,
    deleteExpenseCategorySuccess, deleteExpenseCategoryFailure
} from "./action";
import api from "../api";

// API Functions
function createExpenseCategoryApi(payload: any) {
    return api.post("/expense-categories/create", payload);
}

function getExpenseCategoriesApi() {
    return api.get("/expense-categories/all");
}

function getExpenseCategoryApi(id: string) {
    return api.get(`/expense-categories/${id}`);
}

function updateExpenseCategoryApi(id: string, payload: any) {
    return api.put(`/expense-categories/update/${id}`, payload);
}

function deleteExpenseCategoryApi(id: string) {
    return api.delete(`/expense-categories/delete/${id}`);
}

// Sagas
function* onCreateExpenseCategory({ payload }: any): SagaIterator {
    try {
        const response = yield call(createExpenseCategoryApi, payload);
        yield put(createExpenseCategorySuccess(response.data));
    } catch (error: any) {
        yield put(createExpenseCategoryFailure(error.response?.data?.message || "Failed to create expense category"));
    }
}

function* onGetExpenseCategories(): SagaIterator {
    try {
        const response = yield call(getExpenseCategoriesApi);
        yield put(getExpenseCategoriesSuccess(response.data));
    } catch (error: any) {
        yield put(getExpenseCategoriesFailure(error.response?.data?.message || "Failed to fetch expense categories"));
    }
}

function* onGetExpenseCategory({ payload }: any): SagaIterator {
    try {
        const response = yield call(getExpenseCategoryApi, payload);
        yield put(getExpenseCategorySuccess(response.data));
    } catch (error: any) {
        yield put(getExpenseCategoryFailure(error.response?.data?.message || "Failed to fetch expense category"));
    }
}

function* onUpdateExpenseCategory({ payload }: any): SagaIterator {
    try {
        const { id, payload: data } = payload;
        const response = yield call(updateExpenseCategoryApi, id, data);
        yield put(updateExpenseCategorySuccess(response.data));
    } catch (error: any) {
        yield put(updateExpenseCategoryFailure(error.response?.data?.message || "Failed to update expense category"));
    }
}

function* onDeleteExpenseCategory({ payload }: any): SagaIterator {
    try {
        const response = yield call(deleteExpenseCategoryApi, payload);
        yield put(deleteExpenseCategorySuccess({ ...response.data, id: payload }));
    } catch (error: any) {
        yield put(deleteExpenseCategoryFailure(error.response?.data?.message || "Failed to delete expense category"));
    }
}

export default function* expenseCategorySaga(): SagaIterator {
    yield takeEvery(CREATE_EXPENSE_CATEGORY_REQUEST, onCreateExpenseCategory);
    yield takeEvery(GET_EXPENSE_CATEGORIES_REQUEST, onGetExpenseCategories);
    yield takeEvery(GET_EXPENSE_CATEGORY_REQUEST, onGetExpenseCategory);
    yield takeEvery(UPDATE_EXPENSE_CATEGORY_REQUEST, onUpdateExpenseCategory);
    yield takeEvery(DELETE_EXPENSE_CATEGORY_REQUEST, onDeleteExpenseCategory);
}
