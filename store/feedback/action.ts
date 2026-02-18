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
  DELETE_FEEDBACK_REQUEST,
  DELETE_FEEDBACK_SUCCESS,
  DELETE_FEEDBACK_FAILURE,
  CLEAR_FEEDBACK_DETAILS,
} from "./actionType";

// Create Feedback
export const createFeedbackRequest = (payload: any) => ({
  type: CREATE_FEEDBACK_REQUEST,
  payload,
});
export const createFeedbackSuccess = (payload: any) => ({
  type: CREATE_FEEDBACK_SUCCESS,
  payload,
});
export const createFeedbackFailure = (payload: any) => ({
  type: CREATE_FEEDBACK_FAILURE,
  payload,
});

// Get Feedbacks
export const getFeedbacksRequest = (payload: any = {}) => ({
  type: GET_FEEDBACKS_REQUEST,
  payload, // can contain user_id, status
});
export const getFeedbacksSuccess = (payload: any) => ({
  type: GET_FEEDBACKS_SUCCESS,
  payload,
});
export const getFeedbacksFailure = (payload: any) => ({
  type: GET_FEEDBACKS_FAILURE,
  payload,
});

// Update Feedback
export const updateFeedbackRequest = (id: string, payload: any) => ({
  type: UPDATE_FEEDBACK_REQUEST,
  payload: { id, payload },
});
export const updateFeedbackSuccess = (payload: any) => ({
  type: UPDATE_FEEDBACK_SUCCESS,
  payload,
});
export const updateFeedbackFailure = (payload: any) => ({
  type: UPDATE_FEEDBACK_FAILURE,
  payload,
});

// Delete Feedback
export const deleteFeedbackRequest = (id: string) => ({
  type: DELETE_FEEDBACK_REQUEST,
  payload: id,
});
export const deleteFeedbackSuccess = (payload: any) => ({
  type: DELETE_FEEDBACK_SUCCESS,
  payload,
});
export const deleteFeedbackFailure = (payload: any) => ({
  type: DELETE_FEEDBACK_FAILURE,
  payload,
});

export const clearFeedbackDetails = () => ({
  type: CLEAR_FEEDBACK_DETAILS,
});
