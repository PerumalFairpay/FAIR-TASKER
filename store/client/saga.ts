import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
    CREATE_CLIENT_REQUEST,
    GET_CLIENTS_REQUEST,
    GET_CLIENT_REQUEST,
    UPDATE_CLIENT_REQUEST,
    DELETE_CLIENT_REQUEST
} from "./actionType";
import {
    createClientSuccess, createClientFailure,
    getClientsSuccess, getClientsFailure,
    getClientSuccess, getClientFailure,
    updateClientSuccess, updateClientFailure,
    deleteClientSuccess, deleteClientFailure
} from "./action";
import api from "../api";

// API Functions
function createClientApi(payload: FormData) {
    return api.post("/clients/create", payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

function getClientsApi() {
    return api.get("/clients/all");
}

function getClientApi(id: string) {
    return api.get(`/clients/${id}`);
}

function updateClientApi(id: string, payload: FormData) {
    return api.put(`/clients/update/${id}`, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

function deleteClientApi(id: string) {
    return api.delete(`/clients/delete/${id}`);
}

// Sagas
function* onCreateClient({ payload }: any): SagaIterator {
    try {
        const response = yield call(createClientApi, payload);
        if (response.data.success) {
            yield put(createClientSuccess(response.data));
        } else {
            yield put(createClientFailure(response.data.message || "Failed to create client/vendor"));
        }
    } catch (error: any) {
        yield put(createClientFailure(error.response?.data?.message || "Failed to create client/vendor"));
    }
}

function* onGetClients(): SagaIterator {
    try {
        const response = yield call(getClientsApi);
        if (response.data.success) {
            yield put(getClientsSuccess(response.data));
        } else {
            yield put(getClientsFailure(response.data.message || "Failed to fetch clients/vendors"));
        }
    } catch (error: any) {
        yield put(getClientsFailure(error.response?.data?.message || "Failed to fetch clients/vendors"));
    }
}

function* onGetClient({ payload }: any): SagaIterator {
    try {
        const response = yield call(getClientApi, payload);
        if (response.data.success) {
            yield put(getClientSuccess(response.data));
        } else {
            yield put(getClientFailure(response.data.message || "Failed to fetch client/vendor"));
        }
    } catch (error: any) {
        yield put(getClientFailure(error.response?.data?.message || "Failed to fetch client/vendor"));
    }
}

function* onUpdateClient({ payload }: any): SagaIterator {
    try {
        const { id, payload: data } = payload;
        const response = yield call(updateClientApi, id, data);
        if (response.data.success) {
            yield put(updateClientSuccess(response.data));
        } else {
            yield put(updateClientFailure(response.data.message || "Failed to update client/vendor"));
        }
    } catch (error: any) {
        yield put(updateClientFailure(error.response?.data?.message || "Failed to update client/vendor"));
    }
}

function* onDeleteClient({ payload }: any): SagaIterator {
    try {
        const response = yield call(deleteClientApi, payload);
        if (response.data.success) {
            yield put(deleteClientSuccess({ id: payload, message: response.data.message || "Client/Vendor deleted successfully" }));
        } else {
            yield put(deleteClientFailure(response.data.message || "Failed to delete client/vendor"));
        }
    } catch (error: any) {
        yield put(deleteClientFailure(error.response?.data?.message || "Failed to delete client/vendor"));
    }
}

export default function* clientSaga(): SagaIterator {
    yield takeEvery(CREATE_CLIENT_REQUEST, onCreateClient);
    yield takeEvery(GET_CLIENTS_REQUEST, onGetClients);
    yield takeEvery(GET_CLIENT_REQUEST, onGetClient);
    yield takeEvery(UPDATE_CLIENT_REQUEST, onUpdateClient);
    yield takeEvery(DELETE_CLIENT_REQUEST, onDeleteClient);
}
