import { takeLatest, put, call } from "redux-saga/effects";
import {
  GENERATE_PAYSLIP_REQUEST,
  GET_PAYSLIPS_REQUEST,
  DOWNLOAD_PAYSLIP_REQUEST,
} from "./actionType";
import {
  generatePayslipSuccess,
  generatePayslipFailure,
  getPayslipsSuccess,
  getPayslipsFailure,
  downloadPayslipSuccess,
  downloadPayslipFailure,
} from "./action";
import api from "../api";

function* handleGeneratePayslip(action: any): any {
  try {
    const response = yield call(api.post, "/payslip/generate", action.payload);
    yield put(generatePayslipSuccess(response));
  } catch (error: any) {
    yield put(
      generatePayslipFailure(
        error.response?.data?.message || "Failed to generate payslip",
      ),
    );
  }
}

function* handleGetPayslips(action: any): any {
  try {
    const { page = 1, limit = 10, ...query } = action.payload;
    // Construct query string
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...query,
    }).toString();

    // api.get returns response object
    const response = yield call(api.get, `/payslip/list?${params}`);
    yield put(getPayslipsSuccess(response.data));
  } catch (error: any) {
    yield put(
      getPayslipsFailure(
        error.response?.data?.message || "Failed to fetch payslips",
      ),
    );
  }
}

function* handleDownloadPayslip(action: any): any {
  try {
    const { id } = action.payload;
    const response = yield call(api.get, `/payslip/download/${id}`);
    yield put(downloadPayslipSuccess(response.data));

    // Auto-open in new tab if URL is present in data.data.url
    if (response.data && response.data.data && response.data.data.url) {
      // If URL is fully qualified, open it.
      // If relative, prepend API_URL? Assuming api.get returns axios response.
      // Usually backend returns full relative path or full URL.
      // If frontend and backend are on different ports/domains, we might need to handle this.
      // But usually file_handler returns a path that works if prefixed with API Base or correct logic.
      // Let's assume response.data.data.url is usable.
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

function* payslipSaga() {
  yield takeLatest(GENERATE_PAYSLIP_REQUEST, handleGeneratePayslip);
  yield takeLatest(GET_PAYSLIPS_REQUEST, handleGetPayslips);
  yield takeLatest(DOWNLOAD_PAYSLIP_REQUEST, handleDownloadPayslip);
}

export default payslipSaga;
