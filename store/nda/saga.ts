import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
  GENERATE_NDA_REQUEST,
  GET_NDA_LIST_REQUEST,
  GET_NDA_BY_TOKEN_REQUEST,
  UPLOAD_NDA_DOCUMENTS_REQUEST,
  SIGN_NDA_REQUEST,
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
} from "./action";
import api, { publicApi } from "../api";

// API Functions
function generateNDAApi(payload: {
  employee_name: string;
  role: string;
  address: string;
}) {
  return api.post("/nda/generate", payload);
}

function getNDAListApi() {
  return api.get("/nda/list");
}

function getNDAByTokenApi(token: string) {
  return publicApi.get(`/nda/view/${token}`);
}

function uploadNDADocumentsApi(token: string, documents: string[]) {
  return publicApi.post(`/nda/upload/${token}`, documents);
}

function signNDAApi(token: string, signature: string) {
  return publicApi.post(`/nda/sign/${token}`, { signature });
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

function* onGetNDAList(): SagaIterator {
  try {
    const response = yield call(getNDAListApi);
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
    const { token, documents } = payload;
    const response = yield call(uploadNDADocumentsApi, token, documents);
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
    const { token, signature } = payload;
    const response = yield call(signNDAApi, token, signature);
    yield put(signNDASuccess(response.data));
  } catch (error: any) {
    yield put(
      signNDAFailure(error.response?.data?.message || "Failed to sign NDA"),
    );
  }
}

export default function* ndaSaga(): SagaIterator {
  yield takeEvery(GENERATE_NDA_REQUEST, onGenerateNDA);
  yield takeEvery(GET_NDA_LIST_REQUEST, onGetNDAList);
  yield takeEvery(GET_NDA_BY_TOKEN_REQUEST, onGetNDAByToken);
  yield takeEvery(UPLOAD_NDA_DOCUMENTS_REQUEST, onUploadNDADocuments);
  yield takeEvery(SIGN_NDA_REQUEST, onSignNDA);
}
