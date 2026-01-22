import { takeEvery, put, call, select } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
  CREATE_TASK_REQUEST,
  GET_TASKS_REQUEST,
  GET_TASK_REQUEST,
  UPDATE_TASK_REQUEST,
  DELETE_TASK_REQUEST,
  SUBMIT_EOD_REPORT_REQUEST,
  GET_EOD_REPORTS_REQUEST,
} from "./actionType";
import {
  createTaskSuccess,
  createTaskFailure,
  getTasksSuccess,
  getTasksFailure,
  getTaskSuccess,
  getTaskFailure,
  updateTaskSuccess,
  updateTaskFailure,
  deleteTaskSuccess,
  deleteTaskFailure,
  submitEodReportSuccess,
  submitEodReportFailure,
  getEodReportsSuccess,
  getEodReportsFailure,
} from "./action";
import api from "../api";

// API Functions
function createTaskApi(payload: FormData) {
  return api.post("/tasks/", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function getTasksApi(params: any) {
  return api.get("/tasks/", { params });
}

function getTaskApi(id: string) {
  return api.get(`/tasks/${id}`);
}

function updateTaskApi(id: string, payload: FormData) {
  return api.put(`/tasks/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function deleteTaskApi(id: string) {
  return api.delete(`/tasks/${id}`);
}

function submitEodReportApi(payload: any) {
  return api.post("/tasks/eod-report", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function getEodReportsApi(params: any) {
  return api.get("/tasks/eod-reports", { params });
}

// Sagas
function* onCreateTask({ payload }: any): SagaIterator {
  try {
    const response = yield call(createTaskApi, payload);
    if (response.data.success) {
      yield put(createTaskSuccess(response.data.data));
    } else {
      yield put(
        createTaskFailure(response.data.message || "Failed to create task"),
      );
    }
  } catch (error: any) {
    yield put(
      createTaskFailure(
        error.response?.data?.message || "Failed to create task",
      ),
    );
  }
}

function* onGetTasks({ payload }: any): SagaIterator {
  try {
    const response = yield call(getTasksApi, payload);
    if (response.data.success) {
      yield put(getTasksSuccess(response.data.data));
    } else {
      yield put(
        getTasksFailure(response.data.message || "Failed to fetch tasks"),
      );
    }
  } catch (error: any) {
    yield put(
      getTasksFailure(error.response?.data?.message || "Failed to fetch tasks"),
    );
  }
}

function* onGetTask({ payload }: any): SagaIterator {
  try {
    const response = yield call(getTaskApi, payload);
    if (response.data.success) {
      yield put(getTaskSuccess(response.data.data));
    } else {
      yield put(
        getTaskFailure(response.data.message || "Failed to fetch task"),
      );
    }
  } catch (error: any) {
    yield put(
      getTaskFailure(error.response?.data?.message || "Failed to fetch task"),
    );
  }
}

function* onUpdateTask({ payload }: any): SagaIterator {
  try {
    const { id, payload: data } = payload;
    const response = yield call(updateTaskApi, id, data);
    if (response.data.success) {
      yield put(updateTaskSuccess(response.data.data));
    } else {
      yield put(
        updateTaskFailure(response.data.message || "Failed to update task"),
      );
    }
  } catch (error: any) {
    yield put(
      updateTaskFailure(
        error.response?.data?.message || "Failed to update task",
      ),
    );
  }
}

function* onDeleteTask({ payload }: any): SagaIterator {
  try {
    const response = yield call(deleteTaskApi, payload);
    if (response.data.success) {
      yield put(deleteTaskSuccess(payload));
    } else {
      yield put(
        deleteTaskFailure(response.data.message || "Failed to delete task"),
      );
    }
  } catch (error: any) {
    yield put(
      deleteTaskFailure(
        error.response?.data?.message || "Failed to delete task",
      ),
    );
  }
}

function* onSubmitEodReport({ payload }: any): SagaIterator {
  try {
    const formData = new FormData();
    // Payload is now expected to be a single report object, not { reports: [...] }
    // If payload is still { reports: [...] } but user submits one, take the first.
    // Or better, assume payload is the report object itself or contains it.
    // Based on user prompt "i only submit the one eod report", let's assume payload IS the single report data
    // OR payload has 'reports' array of 1. Let's start by destructuring safely.

    let reportData = payload;
    if (payload.reports && Array.isArray(payload.reports)) {
      reportData = payload.reports[0];
    }

    if (!reportData) throw new Error("No report data found");

    formData.append("task_id", reportData.task_id);
    formData.append("status", reportData.status);
    formData.append("progress", String(reportData.progress));
    if (reportData.eod_summary)
      formData.append("eod_summary", reportData.eod_summary);
    formData.append("move_to_tomorrow", String(!!reportData.move_to_tomorrow));

    if (reportData.files && reportData.files.length > 0) {
      reportData.files.forEach((file: File) => {
        formData.append("attachments", file);
      });
    }

    const response = yield call(submitEodReportApi, formData);
    if (response.data.success) {
      yield put(submitEodReportSuccess(response.data.data));
      
    } else {
      yield put(
        submitEodReportFailure(
          response.data.message || "Failed to submit EOD report",
        ),
      );
    }
  } catch (error: any) {
    yield put(
      submitEodReportFailure(
        error.response?.data?.message || "Failed to submit EOD report",
      ),
    );
  }
}

function* onGetEodReports({ payload }: any): SagaIterator {
  try {
    const response = yield call(getEodReportsApi, payload);
    if (response.data.success) {
      yield put(getEodReportsSuccess(response.data.data));
    } else {
      yield put(
        getEodReportsFailure(
          response.data.message || "Failed to fetch EOD reports",
        ),
      );
    }
  } catch (error: any) {
    yield put(
      getEodReportsFailure(
        error.response?.data?.message || "Failed to fetch EOD reports",
      ),
    );
  }
}

export default function* taskSaga(): SagaIterator {
  yield takeEvery(CREATE_TASK_REQUEST, onCreateTask);
  yield takeEvery(GET_TASKS_REQUEST, onGetTasks);
  yield takeEvery(GET_TASK_REQUEST, onGetTask);
  yield takeEvery(UPDATE_TASK_REQUEST, onUpdateTask);
  yield takeEvery(DELETE_TASK_REQUEST, onDeleteTask);
  yield takeEvery(SUBMIT_EOD_REPORT_REQUEST, onSubmitEodReport);
  yield takeEvery(GET_EOD_REPORTS_REQUEST, onGetEodReports);
}
