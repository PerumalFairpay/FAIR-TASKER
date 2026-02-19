import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
  CREATE_PAYSLIP_COMPONENT_REQUEST,
  GET_PAYSLIP_COMPONENTS_REQUEST,
  UPDATE_PAYSLIP_COMPONENT_REQUEST,
  DELETE_PAYSLIP_COMPONENT_REQUEST,
} from "./actionType";
import {
  createPayslipComponentSuccess,
  createPayslipComponentFailure,
  getPayslipComponentsSuccess,
  getPayslipComponentsFailure,
  updatePayslipComponentSuccess,
  updatePayslipComponentFailure,
  deletePayslipComponentSuccess,
  deletePayslipComponentFailure,
} from "./action";
import api from "../api";

// API Functions
function createPayslipComponentApi(payload: any) {
  return api.post("/payslip-components/", payload);
}

function getPayslipComponentsApi(params: any) {
  const cleanParams = Object.fromEntries(
    Object.entries(params || {}).filter(
      ([_, v]) => v != null && v !== "" && v !== "undefined",
    ),
  );
  const queryString = new URLSearchParams(cleanParams as any).toString();
  return api.get(`/payslip-components/?${queryString}`);
}

function updatePayslipComponentApi(id: string, data: any) {
  return api.put(`/payslip-components/${id}`, data);
}

function deletePayslipComponentApi(id: string) {
  return api.delete(`/payslip-components/${id}`);
}

// Sagas
function* onCreatePayslipComponent({ payload }: any): SagaIterator {
  try {
    const response = yield call(createPayslipComponentApi, payload);
    yield put(createPayslipComponentSuccess(response.data));
  } catch (error: any) {
    yield put(
      createPayslipComponentFailure(
        error.response?.data?.message || "Failed to create payslip component",
      ),
    );
  }
}

function* onGetPayslipComponents({ payload }: any): SagaIterator {
  try {
    const response = yield call(getPayslipComponentsApi, payload);
    yield put(getPayslipComponentsSuccess(response.data));
  } catch (error: any) {
    yield put(
      getPayslipComponentsFailure(
        error.response?.data?.message || "Failed to fetch payslip components",
      ),
    );
  }
}

function* onUpdatePayslipComponent({ payload }: any): SagaIterator {
  try {
    const { id, data } = payload;
    const response = yield call(updatePayslipComponentApi, id, data);
    yield put(updatePayslipComponentSuccess(response.data));
  } catch (error: any) {
    yield put(
      updatePayslipComponentFailure(
        error.response?.data?.message || "Failed to update payslip component",
      ),
    );
  }
}

function* onDeletePayslipComponent({ payload }: any): SagaIterator {
  try {
    const response = yield call(deletePayslipComponentApi, payload);
    yield put(deletePayslipComponentSuccess(payload));
  } catch (error: any) {
    yield put(
      deletePayslipComponentFailure(
        error.response?.data?.message || "Failed to delete payslip component",
      ),
    );
  }
}

export default function* payslipComponentSaga(): SagaIterator {
  yield takeEvery(CREATE_PAYSLIP_COMPONENT_REQUEST, onCreatePayslipComponent);
  yield takeEvery(GET_PAYSLIP_COMPONENTS_REQUEST, onGetPayslipComponents);
  yield takeEvery(UPDATE_PAYSLIP_COMPONENT_REQUEST, onUpdatePayslipComponent);
  yield takeEvery(DELETE_PAYSLIP_COMPONENT_REQUEST, onDeletePayslipComponent);
}
