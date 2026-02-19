import {
  CREATE_FEEDBACK_REQUEST,
  CREATE_FEEDBACK_SUCCESS,
  CREATE_FEEDBACK_FAILURE,
  GET_FEEDBACKS_REQUEST,
  GET_FEEDBACKS_SUCCESS,
  GET_FEEDBACKS_FAILURE,
  UPDATE_FEEDBACK_REQUEST,
  UPDATE_FEEDBACK_SUCCESS,
  UPDATE_FEEDBACK_FAILURE,
  UPDATE_FEEDBACK_STATUS_REQUEST,
  UPDATE_FEEDBACK_STATUS_SUCCESS,
  UPDATE_FEEDBACK_STATUS_FAILURE,
  DELETE_FEEDBACK_REQUEST,
  DELETE_FEEDBACK_SUCCESS,
  DELETE_FEEDBACK_FAILURE,
  CLEAR_FEEDBACK,
} from "./actionType";

export const createFeedbackRequest = (payload: FormData) => ({
  type: CREATE_FEEDBACK_REQUEST,
  payload,
});
export const createFeedbackSuccess = (response: any) => ({
  type: CREATE_FEEDBACK_SUCCESS,
  payload: response,
});
export const createFeedbackFailure = (error: any) => ({
  type: CREATE_FEEDBACK_FAILURE,
  payload: error,
});

export const getFeedbacksRequest = (employee_id?: string, status?: string) => ({
  type: GET_FEEDBACKS_REQUEST,
  payload: { employee_id, status },
});
export const getFeedbacksSuccess = (response: any) => ({
  type: GET_FEEDBACKS_SUCCESS,
  payload: response,
});
export const getFeedbacksFailure = (error: any) => ({
  type: GET_FEEDBACKS_FAILURE,
  payload: error,
});

export const updateFeedbackRequest = (id: string, payload: FormData) => ({
  type: UPDATE_FEEDBACK_REQUEST,
  payload: { id, payload },
});
export const updateFeedbackSuccess = (response: any) => ({
  type: UPDATE_FEEDBACK_SUCCESS,
  payload: response,
});
export const updateFeedbackFailure = (error: any) => ({
  type: UPDATE_FEEDBACK_FAILURE,
  payload: error,
});

export const updateFeedbackStatusRequest = (id: string, status: string) => ({
  type: UPDATE_FEEDBACK_STATUS_REQUEST,
  payload: { id, status },
});
export const updateFeedbackStatusSuccess = (response: any) => ({
  type: UPDATE_FEEDBACK_STATUS_SUCCESS,
  payload: response,
});
export const updateFeedbackStatusFailure = (error: any) => ({
  type: UPDATE_FEEDBACK_STATUS_FAILURE,
  payload: error,
});

export const deleteFeedbackRequest = (id: string) => ({
  type: DELETE_FEEDBACK_REQUEST,
  payload: id,
});
export const deleteFeedbackSuccess = (response: any) => ({
  type: DELETE_FEEDBACK_SUCCESS,
  payload: response,
});
export const deleteFeedbackFailure = (error: any) => ({
  type: DELETE_FEEDBACK_FAILURE,
  payload: error,
});

export const clearFeedback = () => ({
  type: CLEAR_FEEDBACK,
});
