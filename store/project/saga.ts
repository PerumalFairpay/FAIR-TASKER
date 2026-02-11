import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
  CREATE_PROJECT_REQUEST,
  GET_PROJECTS_REQUEST,
  GET_PROJECT_REQUEST,
  UPDATE_PROJECT_REQUEST,
  DELETE_PROJECT_REQUEST,
  GET_PROJECTS_SUMMARY_REQUEST,
} from "./actionType";
import {
  createProjectSuccess,
  createProjectFailure,
  getProjectsSuccess,
  getProjectsFailure,
  getProjectSuccess,
  getProjectFailure,
  updateProjectSuccess,
  updateProjectFailure,
  deleteProjectSuccess,
  deleteProjectFailure,
  getProjectsSummarySuccess,
  getProjectsSummaryFailure,
} from "./action";
import api from "../api";

// API Functions
function createProjectApi(payload: FormData) {
  return api.post("/projects/create", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function getProjectsApi() {
  return api.get("/projects/all");
}

function getProjectApi(id: string) {
  return api.get(`/projects/${id}`);
}

function updateProjectApi(id: string, payload: FormData) {
  return api.put(`/projects/update/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function deleteProjectApi(id: string) {
  return api.delete(`/projects/delete/${id}`);
}

function getProjectsSummaryApi() {
  return api.get("/projects/list");
}

// Sagas
function* onCreateProject({ payload }: any): SagaIterator {
  try {
    const response = yield call(createProjectApi, payload);
    if (response.data.success) {
      yield put(createProjectSuccess(response.data));
    } else {
      yield put(
        createProjectFailure(
          response.data.message || "Failed to create project",
        ),
      );
    }
  } catch (error: any) {
    yield put(
      createProjectFailure(
        error.response?.data?.message || "Failed to create project",
      ),
    );
  }
}

function* onGetProjects(): SagaIterator {
  try {
    const response = yield call(getProjectsApi);
    if (response.data.success) {
      yield put(getProjectsSuccess(response.data));
    } else {
      yield put(
        getProjectsFailure(response.data.message || "Failed to fetch projects"),
      );
    }
  } catch (error: any) {
    yield put(
      getProjectsFailure(
        error.response?.data?.message || "Failed to fetch projects",
      ),
    );
  }
}

function* onGetProject({ payload }: any): SagaIterator {
  try {
    const response = yield call(getProjectApi, payload);
    if (response.data.success) {
      yield put(getProjectSuccess(response.data));
    } else {
      yield put(
        getProjectFailure(response.data.message || "Failed to fetch project"),
      );
    }
  } catch (error: any) {
    yield put(
      getProjectFailure(
        error.response?.data?.message || "Failed to fetch project",
      ),
    );
  }
}

function* onUpdateProject({ payload }: any): SagaIterator {
  try {
    const { id, payload: data } = payload;
    const response = yield call(updateProjectApi, id, data);
    if (response.data.success) {
      yield put(updateProjectSuccess(response.data));
    } else {
      yield put(
        updateProjectFailure(
          response.data.message || "Failed to update project",
        ),
      );
    }
  } catch (error: any) {
    yield put(
      updateProjectFailure(
        error.response?.data?.message || "Failed to update project",
      ),
    );
  }
}

function* onDeleteProject({ payload }: any): SagaIterator {
  try {
    const response = yield call(deleteProjectApi, payload);
    if (response.data.success) {
      yield put(
        deleteProjectSuccess({
          id: payload,
          message: response.data.message || "Project deleted successfully",
        }),
      );
    } else {
      yield put(
        deleteProjectFailure(
          response.data.message || "Failed to delete project",
        ),
      );
    }
  } catch (error: any) {
    yield put(
      deleteProjectFailure(
        error.response?.data?.message || "Failed to delete project",
      ),
    );
  }
}


function* onGetProjectsSummary(): SagaIterator {
  try {
    const response = yield call(getProjectsSummaryApi);
    if (response.data.success) {
      yield put(getProjectsSummarySuccess(response.data));
    } else {
      yield put(
        getProjectsSummaryFailure(
          response.data.message || "Failed to fetch projects summary",
        ),
      );
    }
  } catch (error: any) {
    yield put(
      getProjectsSummaryFailure(
        error.response?.data?.message || "Failed to fetch projects summary",
      ),
    );
  }
}

export default function* projectSaga(): SagaIterator {
  yield takeEvery(CREATE_PROJECT_REQUEST, onCreateProject);
  yield takeEvery(GET_PROJECTS_REQUEST, onGetProjects);
  yield takeEvery(GET_PROJECT_REQUEST, onGetProject);
  yield takeEvery(UPDATE_PROJECT_REQUEST, onUpdateProject);
  yield takeEvery(DELETE_PROJECT_REQUEST, onDeleteProject);
  yield takeEvery(GET_PROJECTS_SUMMARY_REQUEST, onGetProjectsSummary);
}

