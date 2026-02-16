import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
  CREATE_EMPLOYEE_REQUEST,
  GET_EMPLOYEES_REQUEST,
  GET_EMPLOYEE_REQUEST,
  UPDATE_EMPLOYEE_REQUEST,
  DELETE_EMPLOYEE_REQUEST,
  UPDATE_USER_PERMISSIONS_REQUEST,
  GET_USER_PERMISSIONS_REQUEST,
  GET_EMPLOYEES_SUMMARY_REQUEST,
  GET_EMPLOYEE_DASHBOARD_SUMMARY_REQUEST,
} from "./actionType";
import {
  createEmployeeSuccess,
  createEmployeeFailure,
  getEmployeesSuccess,
  getEmployeesFailure,
  getEmployeeSuccess,
  getEmployeeFailure,
  updateEmployeeSuccess,
  updateEmployeeFailure,
  deleteEmployeeSuccess,
  deleteEmployeeFailure,
  updateUserPermissionsSuccess,
  updateUserPermissionsFailure,
  getUserPermissionsSuccess,
  getUserPermissionsFailure,
  getEmployeesSummarySuccess,
  getEmployeesSummaryFailure,
  getEmployeeDashboardSummarySuccess,
  getEmployeeDashboardSummaryFailure,
} from "./action";
import api from "../api";

// API Functions
function createEmployeeApi(payload: FormData) {
  return api.post("/employees/create", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function getEmployeesApi(params: any) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null && v !== ""),
  );
  const query = new URLSearchParams(cleanParams as any).toString();
  return api.get(`/employees/all?${query}`);
}

function getEmployeeApi(id: string) {
  return api.get(`/employees/${id}`);
}

function updateEmployeeApi(id: string, payload: FormData) {
  return api.put(`/employees/update/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function deleteEmployeeApi(id: string) {
  return api.delete(`/employees/delete/${id}`);
}

function updateUserPermissionsApi(id: string, permissions: string[]) {
  return api.put(`/employees/${id}/permissions`, { permissions });
}

function getUserPermissionsApi(id: string) {
  return api.get(`/employees/${id}/permissions`);
}

// Sagas
function* onCreateEmployee({ payload }: any): SagaIterator {
  try {
    const response = yield call(createEmployeeApi, payload);
    yield put(createEmployeeSuccess(response.data));
  } catch (error: any) {
    yield put(
      createEmployeeFailure(
        error.response?.data?.message || "Failed to create employee",
      ),
    );
  }
}

function* onGetEmployees({ payload }: any): SagaIterator {
  try {
    const response = yield call(getEmployeesApi, payload);
    yield put(getEmployeesSuccess(response.data));
  } catch (error: any) {
    yield put(
      getEmployeesFailure(
        error.response?.data?.message || "Failed to fetch employees",
      ),
    );
  }
}

function* onGetEmployee({ payload }: any): SagaIterator {
  try {
    const response = yield call(getEmployeeApi, payload);
    yield put(getEmployeeSuccess(response.data));
  } catch (error: any) {
    yield put(
      getEmployeeFailure(
        error.response?.data?.message || "Failed to fetch employee",
      ),
    );
  }
}

function* onUpdateEmployee({ payload }: any): SagaIterator {
  try {
    const { id, payload: data } = payload;
    const response = yield call(updateEmployeeApi, id, data);
    yield put(updateEmployeeSuccess(response.data));
  } catch (error: any) {
    yield put(
      updateEmployeeFailure(
        error.response?.data?.message || "Failed to update employee",
      ),
    );
  }
}

function* onDeleteEmployee({ payload }: any): SagaIterator {
  try {
    yield call(deleteEmployeeApi, payload);
    // Payload is the ID
    yield put(
      deleteEmployeeSuccess({
        id: payload,
        message: "Employee deleted successfully",
      }),
    );
  } catch (error: any) {
    yield put(
      deleteEmployeeFailure(
        error.response?.data?.message || "Failed to delete employee",
      ),
    );
  }
}

function* onUpdateUserPermissions({ payload }: any): SagaIterator {
  try {
    const { id, permissions } = payload;
    const response = yield call(updateUserPermissionsApi, id, permissions);
    yield put(updateUserPermissionsSuccess(response.data));
  } catch (error: any) {
    yield put(
      updateUserPermissionsFailure(
        error.response?.data?.message || "Failed to update permissions",
      ),
    );
  }
}

function* onGetUserPermissions({ payload }: any): SagaIterator {
  try {
    const response = yield call(getUserPermissionsApi, payload);
    yield put(getUserPermissionsSuccess(response.data));
  } catch (error: any) {
    yield put(
      getUserPermissionsFailure(
        error.response?.data?.message || "Failed to fetch permissions",
      ),
    );
  }
}

// API Functions
function getEmployeesSummaryApi() {
  return api.get("/employees/summary");
}

function* onGetEmployeesSummary(): SagaIterator {
  try {
    const response = yield call(getEmployeesSummaryApi);
    yield put(getEmployeesSummarySuccess(response.data));
  } catch (error: any) {
    yield put(
      getEmployeesSummaryFailure(
        error.response?.data?.message || "Failed to fetch employees summary",
      ),
    );
  }
}

function getEmployeeDashboardSummaryApi(id: string) {
  return api.get(`/employees/${id}/dashboard-summary`);
}

function* onGetEmployeeDashboardSummary({ payload }: any): SagaIterator {
  try {
    const response = yield call(getEmployeeDashboardSummaryApi, payload);
    yield put(getEmployeeDashboardSummarySuccess(response.data));
  } catch (error: any) {
    yield put(
      getEmployeeDashboardSummaryFailure(
        error.response?.data?.message || "Failed to fetch dashboard summary",
      ),
    );
  }
}

export default function* employeeSaga(): SagaIterator {
  yield takeEvery(CREATE_EMPLOYEE_REQUEST, onCreateEmployee);
  yield takeEvery(GET_EMPLOYEES_REQUEST, onGetEmployees);
  yield takeEvery(GET_EMPLOYEE_REQUEST, onGetEmployee);
  yield takeEvery(UPDATE_EMPLOYEE_REQUEST, onUpdateEmployee);
  yield takeEvery(DELETE_EMPLOYEE_REQUEST, onDeleteEmployee);
  yield takeEvery(UPDATE_USER_PERMISSIONS_REQUEST, onUpdateUserPermissions);
  yield takeEvery(GET_USER_PERMISSIONS_REQUEST, onGetUserPermissions);
  yield takeEvery(GET_EMPLOYEES_SUMMARY_REQUEST, onGetEmployeesSummary);
  yield takeEvery(
    GET_EMPLOYEE_DASHBOARD_SUMMARY_REQUEST,
    onGetEmployeeDashboardSummary,
  );
}
