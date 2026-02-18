import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
  CREATE_FEEDBACK_REQUEST,
  GET_FEEDBACKS_REQUEST,
  UPDATE_FEEDBACK_REQUEST,
  DELETE_FEEDBACK_REQUEST,
} from "./actionType";
import {
  createFeedbackSuccess,
  createFeedbackFailure,
  getFeedbacksSuccess,
  getFeedbacksFailure,
  updateFeedbackSuccess,
  updateFeedbackFailure,
  deleteFeedbackSuccess,
  deleteFeedbackFailure,
} from "./action";
import api from "../api"; // Assuming api.ts is in store/.. but checking department/saga.ts it used "../api".
// Wait, store/department/saga.ts used `import api from "../api";` which means api.ts is in `store/api.ts`.
// My file is in `store/feedback/saga.ts`, so `../api` is correct if `api.ts` is in `store`.
// Yes, list_dir showed `api.ts` in `d:\NEXT JS\FAIR-TASKER\FAIR-TASKER\store`.

// API Functions
function createFeedbackApi(payload: any) {
  return api.post("/feedback/", payload);
}

function getFeedbacksApi(params: any) {
  return api.get("/feedback/", { params });
}

function updateFeedbackApi(id: string, payload: any) {
  return api.put(`/feedback/${id}`, payload);
}

function deleteFeedbackApi(id: string) {
  return api.delete(`/feedback/${id}`);
}

// Sagas
function* onCreateFeedback({ payload }: any): SagaIterator {
  try {
    const response = yield call(createFeedbackApi, payload);
    if (response.data.success) {
      yield put(createFeedbackSuccess(response.data));
    } else {
      yield put(
        createFeedbackFailure(
          response.data.message || "Failed to submit feedback",
        ),
      );
    }
  } catch (error: any) {
    yield put(
      createFeedbackFailure(
        error.response?.data?.message || "Failed to submit feedback",
      ),
    );
  }
}

function* onGetFeedbacks({ payload }: any): SagaIterator {
  try {
    const response = yield call(getFeedbacksApi, payload);
    if (response.data.success) {
      yield put(getFeedbacksSuccess(response.data));
    } else {
      yield put(
        getFeedbacksFailure(
          response.data.message || "Failed to fetch feedbacks",
        ),
      );
    }
  } catch (error: any) {
    yield put(
      getFeedbacksFailure(
        error.response?.data?.message || "Failed to fetch feedbacks",
      ),
    );
  }
}

function* onUpdateFeedback({ payload }: any): SagaIterator {
  try {
    const { id, payload: data } = payload;
    const response = yield call(updateFeedbackApi, id, data);
    if (response.data.success) {
      yield put(updateFeedbackSuccess(response.data));
    } else {
      yield put(
        updateFeedbackFailure(
          response.data.message || "Failed to update feedback",
        ),
      );
    }
  } catch (error: any) {
    yield put(
      updateFeedbackFailure(
        error.response?.data?.message || "Failed to update feedback",
      ),
    );
  }
}

function* onDeleteFeedback({ payload }: any): SagaIterator {
  try {
    const response = yield call(deleteFeedbackApi, payload);
    if (response.data.success) {
      yield put(deleteFeedbackSuccess({ ...response.data, id: payload }));
    } else {
      yield put(
        deleteFeedbackFailure(
          response.data.message || "Failed to delete feedback",
        ),
      );
    }
  } catch (error: any) {
    yield put(
      deleteFeedbackFailure(
        error.response?.data?.message || "Failed to delete feedback",
      ),
    );
  }
}

export default function* feedbackSaga(): SagaIterator {
  yield takeEvery(CREATE_FEEDBACK_REQUEST, onCreateFeedback);
  yield takeEvery(GET_FEEDBACKS_REQUEST, onGetFeedbacks);
  yield takeEvery(UPDATE_FEEDBACK_REQUEST, onUpdateFeedback);
  yield takeEvery(DELETE_FEEDBACK_REQUEST, onDeleteFeedback);
}
