import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
  CREATE_MILESTONE_ROADMAP_REQUEST,
  GET_MILESTONES_ROADMAPS_REQUEST,
  GET_MILESTONE_ROADMAP_REQUEST,
  UPDATE_MILESTONE_ROADMAP_REQUEST,
  DELETE_MILESTONE_ROADMAP_REQUEST,
} from "./actionType";
import {
  createMilestoneRoadmapSuccess,
  createMilestoneRoadmapFailure,
  getMilestonesRoadmapsSuccess,
  getMilestonesRoadmapsFailure,
  getMilestoneRoadmapSuccess,
  getMilestoneRoadmapFailure,
  updateMilestoneRoadmapSuccess,
  updateMilestoneRoadmapFailure,
  deleteMilestoneRoadmapSuccess,
  deleteMilestoneRoadmapFailure,
} from "./action";
import api from "../api";

function createMilestoneRoadmapApi(payload: FormData) {
  return api.post("/milestones-roadmaps/", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function getMilestonesRoadmapsApi(params: any) {
  return api.get("/milestones-roadmaps/", { params });
}

function getMilestoneRoadmapApi(id: string) {
  return api.get(`/milestones-roadmaps/${id}`);
}

function updateMilestoneRoadmapApi(id: string, payload: FormData) {
  return api.put(`/milestones-roadmaps/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function deleteMilestoneRoadmapApi(id: string) {
  return api.delete(`/milestones-roadmaps/${id}`);
}

function* onCreateMilestoneRoadmap({ payload }: any): SagaIterator {
  try {
    const response = yield call(createMilestoneRoadmapApi, payload);
    if (response.data.success) {
      yield put(createMilestoneRoadmapSuccess(response.data.data));
    } else {
      yield put(
        createMilestoneRoadmapFailure(
          response.data.message || "Failed to create item",
        ),
      );
    }
  } catch (error: any) {
    yield put(
      createMilestoneRoadmapFailure(
        error.response?.data?.message || "Failed to create item",
      ),
    );
  }
}

function* onGetMilestonesRoadmaps({ payload }: any): SagaIterator {
  try {
    const response = yield call(getMilestonesRoadmapsApi, payload);
    if (response.data.success) {
      yield put(getMilestonesRoadmapsSuccess(response.data.data));
    } else {
      yield put(
        getMilestonesRoadmapsFailure(
          response.data.message || "Failed to fetch items",
        ),
      );
    }
  } catch (error: any) {
    yield put(
      getMilestonesRoadmapsFailure(
        error.response?.data?.message || "Failed to fetch items",
      ),
    );
  }
}

function* onGetMilestoneRoadmap({ payload }: any): SagaIterator {
  try {
    const response = yield call(getMilestoneRoadmapApi, payload);
    if (response.data.success) {
      yield put(getMilestoneRoadmapSuccess(response.data.data));
    } else {
      yield put(
        getMilestoneRoadmapFailure(
          response.data.message || "Failed to fetch item",
        ),
      );
    }
  } catch (error: any) {
    yield put(
      getMilestoneRoadmapFailure(
        error.response?.data?.message || "Failed to fetch item",
      ),
    );
  }
}

function* onUpdateMilestoneRoadmap({ payload }: any): SagaIterator {
  try {
    const { id, payload: data } = payload;
    const response = yield call(updateMilestoneRoadmapApi, id, data);
    if (response.data.success) {
      yield put(updateMilestoneRoadmapSuccess(response.data.data));
    } else {
      yield put(
        updateMilestoneRoadmapFailure(
          response.data.message || "Failed to update item",
        ),
      );
    }
  } catch (error: any) {
    yield put(
      updateMilestoneRoadmapFailure(
        error.response?.data?.message || "Failed to update item",
      ),
    );
  }
}

function* onDeleteMilestoneRoadmap({ payload }: any): SagaIterator {
  try {
    const response = yield call(deleteMilestoneRoadmapApi, payload);
    if (response.data.success) {
      yield put(deleteMilestoneRoadmapSuccess(payload));
    } else {
      yield put(
        deleteMilestoneRoadmapFailure(
          response.data.message || "Failed to delete item",
        ),
      );
    }
  } catch (error: any) {
    yield put(
      deleteMilestoneRoadmapFailure(
        error.response?.data?.message || "Failed to delete item",
      ),
    );
  }
}

export default function* milestoneRoadmapSaga(): SagaIterator {
  yield takeEvery(CREATE_MILESTONE_ROADMAP_REQUEST, onCreateMilestoneRoadmap);
  yield takeEvery(GET_MILESTONES_ROADMAPS_REQUEST, onGetMilestonesRoadmaps);
  yield takeEvery(GET_MILESTONE_ROADMAP_REQUEST, onGetMilestoneRoadmap);
  yield takeEvery(UPDATE_MILESTONE_ROADMAP_REQUEST, onUpdateMilestoneRoadmap);
  yield takeEvery(DELETE_MILESTONE_ROADMAP_REQUEST, onDeleteMilestoneRoadmap);
}
