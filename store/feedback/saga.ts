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
import api from "../api";

function createFeedbackApi(payload: FormData) {
  return api.post("/feedback/", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function getFeedbacksApi(params: { user_id?: string; status?: string }) {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null),
  );
  const query = new URLSearchParams(filteredParams as any).toString();
  return api.get(`/feedback/?${query}`);
}

function updateFeedbackApi(id: string, payload: FormData) {
  return api.put(`/feedback/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function deleteFeedbackApi(id: string) {
  return api.delete(`/feedback/${id}`);
}

function* onCreateFeedback({ payload }: any): SagaIterator {
  try {
    const response = yield call(createFeedbackApi, payload);
    yield put(createFeedbackSuccess(response.data));
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
    yield put(getFeedbacksSuccess(response.data));
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
    yield put(updateFeedbackSuccess(response.data));
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
    yield call(deleteFeedbackApi, payload);
    yield put(deleteFeedbackSuccess({ id: payload }));
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
