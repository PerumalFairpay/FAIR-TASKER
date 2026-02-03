import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
  CREATE_NDA_REQUEST,
  GET_NDA_REQUEST,
  SIGN_NDA_REQUEST,
} from "./actionType";
import {
  createNdaSuccess,
  createNdaFailure,
  getNdaSuccess,
  getNdaFailure,
  signNdaSuccess,
  signNdaFailure,
} from "./action";
import api from "../api";

function createNdaApi(payload: any) {
  return api.post("/nda/", payload);
}

function getNdaApi(token: string) {
  return api.get(`/nda/${token}`);
}

function signNdaApi(token: string, signatureData: string) {
  return api.post(`/nda/${token}/sign`, { signature_data: signatureData });
}

function* onCreateNda({ payload }: any): SagaIterator {
  try {
    const response = yield call(createNdaApi, payload);
    if (response.data) {
      yield put(createNdaSuccess(response.data));
    } else {
      yield put(createNdaFailure("Failed to create NDA"));
    }
  } catch (error: any) {
    yield put(
      createNdaFailure(error.response?.data?.detail || "Failed to create NDA"),
    );
  }
}

function* onGetNda({ payload }: any): SagaIterator {
  try {
    const response = yield call(getNdaApi, payload.token);
    if (response.data) {
      yield put(getNdaSuccess(response.data));
    } else {
      yield put(getNdaFailure("Failed to fetch NDA"));
    }
  } catch (error: any) {
    yield put(
      getNdaFailure(error.response?.data?.detail || "Failed to fetch NDA"),
    );
  }
}

function* onSignNda({ payload }: any): SagaIterator {
  try {
    const response = yield call(
      signNdaApi,
      payload.token,
      payload.signature_data,
    );
    if (response.data) {
      yield put(signNdaSuccess(response.data));
    } else {
      yield put(signNdaFailure("Failed to sign NDA"));
    }
  } catch (error: any) {
    yield put(
      signNdaFailure(error.response?.data?.detail || "Failed to sign NDA"),
    );
  }
}

export default function* ndaSaga(): SagaIterator {
  yield takeEvery(CREATE_NDA_REQUEST, onCreateNda);
  yield takeEvery(GET_NDA_REQUEST, onGetNda);
  yield takeEvery(SIGN_NDA_REQUEST, onSignNda);
}
