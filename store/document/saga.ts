import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
    CREATE_DOCUMENT_REQUEST,
    GET_DOCUMENTS_REQUEST,
    GET_DOCUMENT_REQUEST,
    UPDATE_DOCUMENT_REQUEST,
    DELETE_DOCUMENT_REQUEST
} from "./actionType";
import {
    createDocumentSuccess, createDocumentFailure,
    getDocumentsSuccess, getDocumentsFailure,
    getDocumentSuccess, getDocumentFailure,
    updateDocumentSuccess, updateDocumentFailure,
    deleteDocumentSuccess, deleteDocumentFailure
} from "./action";
import api from "../api";

// API Functions
function createDocumentApi(payload: FormData) {
    return api.post("/documents/create", payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

function getDocumentsApi() {
    return api.get("/documents/all");
}

function getDocumentApi(id: string) {
    return api.get(`/documents/${id}`);
}

function updateDocumentApi(id: string, payload: FormData) {
    return api.put(`/documents/update/${id}`, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

function deleteDocumentApi(id: string) {
    return api.delete(`/documents/delete/${id}`);
}

// Sagas
function* onCreateDocument({ payload }: any): SagaIterator {
    try {
        const response = yield call(createDocumentApi, payload);
        yield put(createDocumentSuccess(response.data));
    } catch (error: any) {
        yield put(createDocumentFailure(error.response?.data?.message || "Failed to create document"));
    }
}

function* onGetDocuments(): SagaIterator {
    try {
        const response = yield call(getDocumentsApi);
        yield put(getDocumentsSuccess(response.data));
    } catch (error: any) {
        yield put(getDocumentsFailure(error.response?.data?.message || "Failed to fetch documents"));
    }
}

function* onGetDocument({ payload }: any): SagaIterator {
    try {
        const response = yield call(getDocumentApi, payload);
        yield put(getDocumentSuccess(response.data));
    } catch (error: any) {
        yield put(getDocumentFailure(error.response?.data?.message || "Failed to fetch document"));
    }
}

function* onUpdateDocument({ payload }: any): SagaIterator {
    try {
        const { id, payload: data } = payload;
        const response = yield call(updateDocumentApi, id, data);
        yield put(updateDocumentSuccess(response.data));
    } catch (error: any) {
        yield put(updateDocumentFailure(error.response?.data?.message || "Failed to update document"));
    }
}

function* onDeleteDocument({ payload }: any): SagaIterator {
    try {
        const response = yield call(deleteDocumentApi, payload);
        yield put(deleteDocumentSuccess({ ...response.data, id: payload }));
    } catch (error: any) {
        yield put(deleteDocumentFailure(error.response?.data?.message || "Failed to delete document"));
    }
}

export default function* documentSaga(): SagaIterator {
    yield takeEvery(CREATE_DOCUMENT_REQUEST, onCreateDocument);
    yield takeEvery(GET_DOCUMENTS_REQUEST, onGetDocuments);
    yield takeEvery(GET_DOCUMENT_REQUEST, onGetDocument);
    yield takeEvery(UPDATE_DOCUMENT_REQUEST, onUpdateDocument);
    yield takeEvery(DELETE_DOCUMENT_REQUEST, onDeleteDocument);
}
