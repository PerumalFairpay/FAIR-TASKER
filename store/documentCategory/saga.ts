import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
    CREATE_DOCUMENT_CATEGORY_REQUEST,
    GET_DOCUMENT_CATEGORIES_REQUEST,
    GET_DOCUMENT_CATEGORY_REQUEST,
    UPDATE_DOCUMENT_CATEGORY_REQUEST,
    DELETE_DOCUMENT_CATEGORY_REQUEST
} from "./actionType";
import {
    createDocumentCategorySuccess, createDocumentCategoryFailure,
    getDocumentCategoriesSuccess, getDocumentCategoriesFailure,
    getDocumentCategorySuccess, getDocumentCategoryFailure,
    updateDocumentCategorySuccess, updateDocumentCategoryFailure,
    deleteDocumentCategorySuccess, deleteDocumentCategoryFailure
} from "./action";
import api from "../api";

// API Functions
function createDocumentCategoryApi(payload: any) {
    return api.post("/document-categories/create", payload);
}

function getDocumentCategoriesApi() {
    return api.get("/document-categories/all");
}

function getDocumentCategoryApi(id: string) {
    return api.get(`/document-categories/${id}`);
}

function updateDocumentCategoryApi(id: string, payload: any) {
    return api.put(`/document-categories/update/${id}`, payload);
}

function deleteDocumentCategoryApi(id: string) {
    return api.delete(`/document-categories/delete/${id}`);
}

// Sagas
function* onCreateDocumentCategory({ payload }: any): SagaIterator {
    try {
        const response = yield call(createDocumentCategoryApi, payload);
        yield put(createDocumentCategorySuccess(response.data));
    } catch (error: any) {
        yield put(createDocumentCategoryFailure(error.response?.data?.message || "Failed to create document category"));
    }
}

function* onGetDocumentCategories(): SagaIterator {
    try {
        const response = yield call(getDocumentCategoriesApi);
        yield put(getDocumentCategoriesSuccess(response.data));
    } catch (error: any) {
        yield put(getDocumentCategoriesFailure(error.response?.data?.message || "Failed to fetch document categories"));
    }
}

function* onGetDocumentCategory({ payload }: any): SagaIterator {
    try {
        const response = yield call(getDocumentCategoryApi, payload);
        yield put(getDocumentCategorySuccess(response.data));
    } catch (error: any) {
        yield put(getDocumentCategoryFailure(error.response?.data?.message || "Failed to fetch document category"));
    }
}

function* onUpdateDocumentCategory({ payload }: any): SagaIterator {
    try {
        const { id, payload: data } = payload;
        const response = yield call(updateDocumentCategoryApi, id, data);
        yield put(updateDocumentCategorySuccess(response.data));
    } catch (error: any) {
        yield put(updateDocumentCategoryFailure(error.response?.data?.message || "Failed to update document category"));
    }
}

function* onDeleteDocumentCategory({ payload }: any): SagaIterator {
    try {
        const response = yield call(deleteDocumentCategoryApi, payload);
        yield put(deleteDocumentCategorySuccess({ ...response.data, id: payload }));
    } catch (error: any) {
        yield put(deleteDocumentCategoryFailure(error.response?.data?.message || "Failed to delete document category"));
    }
}

export default function* documentCategorySaga(): SagaIterator {
    yield takeEvery(CREATE_DOCUMENT_CATEGORY_REQUEST, onCreateDocumentCategory);
    yield takeEvery(GET_DOCUMENT_CATEGORIES_REQUEST, onGetDocumentCategories);
    yield takeEvery(GET_DOCUMENT_CATEGORY_REQUEST, onGetDocumentCategory);
    yield takeEvery(UPDATE_DOCUMENT_CATEGORY_REQUEST, onUpdateDocumentCategory);
    yield takeEvery(DELETE_DOCUMENT_CATEGORY_REQUEST, onDeleteDocumentCategory);
}
