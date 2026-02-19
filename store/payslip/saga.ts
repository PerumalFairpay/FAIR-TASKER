import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
  GENERATE_PAYSLIP_REQUEST,
  GET_PAYSLIPS_REQUEST,
  GET_LATEST_PAYSLIP_REQUEST,
  DOWNLOAD_PAYSLIP_REQUEST,
  UPDATE_PAYSLIP_REQUEST,
} from "./actionType";
import {
  generatePayslipSuccess,
  generatePayslipFailure,
  getPayslipsSuccess,
  getPayslipsFailure,
  getLatestPayslipSuccess,
  getLatestPayslipFailure,
  downloadPayslipSuccess,
  downloadPayslipFailure,
  updatePayslipSuccess,
  updatePayslipFailure,
} from "./action";
import api from "../api";

// API Functions
function generatePayslipApi(payload: any) {
  return api.post("/payslip/generate", payload);
}

function getPayslipsApi(params: any) {
  const cleanParams = Object.fromEntries(
    Object.entries(params || {}).filter(
      ([_, v]) => v != null && v !== "" && v !== "undefined",
    ),
  );
  const queryString = new URLSearchParams(cleanParams as any).toString();
  return api.get(`/payslip/list?${queryString}`);
}

function getLatestPayslipApi(employeeId: string) {
  return api.get(`/payslip/latest/${employeeId}`);
}

function downloadPayslipApi(id: string) {
  return api.get(`/payslip/download/${id}`);
}

// Sagas
function* onGeneratePayslip({ payload }: any): SagaIterator {
  try {
    const response = yield call(generatePayslipApi, payload);
    yield put(generatePayslipSuccess(response.data));
  } catch (error: any) {
    yield put(
      generatePayslipFailure(
        error.response?.data?.message || "Failed to generate payslip",
      ),
    );
  }
}

function* onGetPayslips({ payload }: any): SagaIterator {
  try {
    const response = yield call(getPayslipsApi, payload);
    yield put(getPayslipsSuccess(response.data));
  } catch (error: any) {
    yield put(
      getPayslipsFailure(
        error.response?.data?.message || "Failed to fetch payslips",
      ),
    );
  }
}

function* onGetLatestPayslip({ payload }: any): SagaIterator {
  try {
    const response = yield call(getLatestPayslipApi, payload);
    yield put(getLatestPayslipSuccess(response.data.data));
  } catch (error: any) {
    yield put(
      getLatestPayslipFailure(
        error.response?.data?.message || "No previous payslip found",
      ),
    );
  }
}

function* onDownloadPayslip({ payload }: any): SagaIterator {
  try {
    const { id } = payload;
    const response = yield call(downloadPayslipApi, id);
    yield put(downloadPayslipSuccess(response.data));

    if (response.data && response.data.data && response.data.data.url) {
      window.open(response.data.data.url, "_blank");
    }
  } catch (error: any) {
    yield put(
      downloadPayslipFailure(
        error.response?.data?.message || "Failed to download payslip",
      ),
    );
  }
}

function updatePayslipApi(id: string, data: any) {
  return api.put(`/payslip/update/${id}`, data);
}

function* onUpdatePayslip({ payload }: any): SagaIterator {
  try {
    const { id, data } = payload;
    const response = yield call(updatePayslipApi, id, data);
    yield put(updatePayslipSuccess(response.data));
  } catch (error: any) {
    yield put(
      updatePayslipFailure(
        error.response?.data?.message || "Failed to update payslip",
      ),
    );
  }
}

export default function* payslipSaga(): SagaIterator {
  yield takeEvery(GENERATE_PAYSLIP_REQUEST, onGeneratePayslip);
  yield takeEvery(GET_PAYSLIPS_REQUEST, onGetPayslips);
  yield takeEvery(GET_LATEST_PAYSLIP_REQUEST, onGetLatestPayslip);
  yield takeEvery(DOWNLOAD_PAYSLIP_REQUEST, onDownloadPayslip);
  yield takeEvery(UPDATE_PAYSLIP_REQUEST, onUpdatePayslip);
}
