import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
  GENERATE_NDA_REQUEST,
  GET_NDA_LIST_REQUEST,
  GET_NDA_BY_TOKEN_REQUEST,
  UPLOAD_NDA_DOCUMENTS_REQUEST,
  SIGN_NDA_REQUEST,
  REGENERATE_NDA_REQUEST,
  DELETE_NDA_REQUEST,
} from "./actionType";
import {
  generateNDASuccess,
  generateNDAFailure,
  getNDAListSuccess,
  getNDAListFailure,
  getNDAByTokenSuccess,
  getNDAByTokenFailure,
  uploadNDADocumentsSuccess,
  uploadNDADocumentsFailure,
  signNDASuccess,
  signNDAFailure,
  regenerateNDASuccess,
  regenerateNDAFailure,
  getNDAListRequest,
  deleteNDASuccess,
  deleteNDAFailure,
} from "./action";
import api, { publicApi } from "../api";

// API Functions
function generateNDAApi(payload: {
  employee_name: string;
  email: string;
  mobile: string;
  role: string;
  address: string;
  residential_address: string;
  expires_in_hours: number;
  required_documents: string[];
}) {
  return api.post("/nda/generate", payload);
}

function getNDAListApi(params: any) {
  const { page, limit, search, status } = params || {};
  let query = `/nda/list?page=${page || 1}&limit=${limit || 10}`;
  if (search) query += `&search=${search}`;
  if (status && status !== "All") query += `&status=${status}`;
  return api.get(query);
}

function getNDAByTokenApi(token: string) {
  return publicApi.get(`/nda/view/${token}`);
}

function uploadNDADocumentsApi(token: string, formData: FormData) {
  return publicApi.post(`/nda/upload/${token}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function signNDAApi(token: string, signature: string, deviceDetails?: any) {
  return publicApi.post(`/nda/sign/${token}`, { signature, ...deviceDetails });
}

function deleteNDAApi(id: string) {
  return api.delete(`/nda/delete/${id}`);
}

// Sagas
function* onGenerateNDA({ payload }: any): SagaIterator {
  try {
    const response = yield call(generateNDAApi, payload);
    yield put(generateNDASuccess(response.data));
  } catch (error: any) {
    yield put(
      generateNDAFailure(
        error.response?.data?.message || "Failed to generate NDA link",
      ),
    );
  }
}

function* onGetNDAList({ payload }: any): SagaIterator {
  try {
    const response = yield call(getNDAListApi, payload);
    yield put(getNDAListSuccess(response.data));
  } catch (error: any) {
    yield put(
      getNDAListFailure(
        error.response?.data?.message || "Failed to fetch NDA list",
      ),
    );
  }
}

function* onGetNDAByToken({ payload }: any): SagaIterator {
  try {
    const response = yield call(getNDAByTokenApi, payload);
    yield put(getNDAByTokenSuccess(response.data));
  } catch (error: any) {
    yield put(
      getNDAByTokenFailure(
        error.response?.data?.message || "Failed to fetch NDA details",
      ),
    );
  }
}

function* onUploadNDADocuments({ payload }: any): SagaIterator {
  try {
    const { token, formData } = payload;
    const response = yield call(uploadNDADocumentsApi, token, formData);
    yield put(uploadNDADocumentsSuccess(response.data));
  } catch (error: any) {
    yield put(
      uploadNDADocumentsFailure(
        error.response?.data?.message || "Failed to upload documents",
      ),
    );
  }
}

function* onSignNDA({ payload }: any): SagaIterator {
  try {
    const { token, signature, ...deviceDetails } = payload;
    const response = yield call(signNDAApi, token, signature, deviceDetails);
    yield put(signNDASuccess(response.data));
  } catch (error: any) {
    yield put(
      signNDAFailure(error.response?.data?.message || "Failed to sign NDA"),
    );
  }
}

function regenerateNDAApi(payload: {
  ndaId: string;
  expires_in_hours: number;
}) {
  return api.post(`/nda/regenerate/${payload.ndaId}`, {
    expires_in_hours: payload.expires_in_hours,
  });
}

function* onRegenerateNDA({ payload }: any): SagaIterator {
  try {
    const response = yield call(regenerateNDAApi, payload);
    yield put(regenerateNDASuccess(response.data));
  } catch (error: any) {
    yield put(
      regenerateNDAFailure(
        error.response?.data?.message || "Failed to regenerate NDA link",
      ),
    );
  }
}

function* onDeleteNDA({ payload }: any): SagaIterator {
  try {
    yield call(deleteNDAApi, payload);
    yield put(deleteNDASuccess(payload));
    // Optionally refresh list or manually remove from state (handled in reducer)
  } catch (error: any) {
    yield put(
      deleteNDAFailure(
        error.response?.data?.message || "Failed to delete NDA request",
      ),
    );
  }
}

export default function* ndaSaga(): SagaIterator {
  yield takeEvery(GENERATE_NDA_REQUEST, onGenerateNDA);
  yield takeEvery(GET_NDA_LIST_REQUEST, onGetNDAList);
  yield takeEvery(GET_NDA_BY_TOKEN_REQUEST, onGetNDAByToken);
  yield takeEvery(UPLOAD_NDA_DOCUMENTS_REQUEST, onUploadNDADocuments);
  yield takeEvery(REGENERATE_NDA_REQUEST, onRegenerateNDA);
  yield takeEvery(DELETE_NDA_REQUEST, onDeleteNDA);
}
