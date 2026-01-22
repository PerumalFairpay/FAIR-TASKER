import {
  CREATE_TASK_REQUEST,
  CREATE_TASK_SUCCESS,
  CREATE_TASK_FAILURE,
  GET_TASKS_REQUEST,
  GET_TASKS_SUCCESS,
  GET_TASKS_FAILURE,
  GET_TASK_REQUEST,
  GET_TASK_SUCCESS,
  GET_TASK_FAILURE,
  UPDATE_TASK_REQUEST,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_FAILURE,
  DELETE_TASK_REQUEST,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_FAILURE,
  SUBMIT_EOD_REPORT_REQUEST,
  SUBMIT_EOD_REPORT_SUCCESS,
  SUBMIT_EOD_REPORT_FAILURE,
  GET_EOD_REPORTS_REQUEST,
  GET_EOD_REPORTS_SUCCESS,
  GET_EOD_REPORTS_FAILURE,
} from "./actionType";

export const createTaskRequest = (payload: any) => ({
  type: CREATE_TASK_REQUEST,
  payload,
});

export const createTaskSuccess = (payload: any) => ({
  type: CREATE_TASK_SUCCESS,
  payload,
});

export const createTaskFailure = (error: string) => ({
  type: CREATE_TASK_FAILURE,
  payload: error,
});

export const getTasksRequest = (params?: any) => ({
  type: GET_TASKS_REQUEST,
  payload: params,
});

export const getTasksSuccess = (payload: any) => ({
  type: GET_TASKS_SUCCESS,
  payload,
});

export const getTasksFailure = (error: string) => ({
  type: GET_TASKS_FAILURE,
  payload: error,
});

export const getTaskRequest = (id: string) => ({
  type: GET_TASK_REQUEST,
  payload: id,
});

export const getTaskSuccess = (payload: any) => ({
  type: GET_TASK_SUCCESS,
  payload,
});

export const getTaskFailure = (error: string) => ({
  type: GET_TASK_FAILURE,
  payload: error,
});

export const updateTaskRequest = (id: string, payload: any) => ({
  type: UPDATE_TASK_REQUEST,
  payload: { id, payload },
});

export const updateTaskSuccess = (payload: any) => ({
  type: UPDATE_TASK_SUCCESS,
  payload,
});

export const updateTaskFailure = (error: string) => ({
  type: UPDATE_TASK_FAILURE,
  payload: error,
});

export const deleteTaskRequest = (id: string) => ({
  type: DELETE_TASK_REQUEST,
  payload: id,
});

export const deleteTaskSuccess = (id: string) => ({
  type: DELETE_TASK_SUCCESS,
  payload: id,
});

export const deleteTaskFailure = (error: string) => ({
  type: DELETE_TASK_FAILURE,
  payload: error,
});

export const submitEodReportRequest = (payload: any) => ({
  type: SUBMIT_EOD_REPORT_REQUEST,
  payload,
});

export const submitEodReportSuccess = (payload: any) => ({
  type: SUBMIT_EOD_REPORT_SUCCESS,
  payload,
});

export const submitEodReportFailure = (error: string) => ({
  type: SUBMIT_EOD_REPORT_FAILURE,
  payload: error,
});

export const getEodReportsRequest = (params?: any) => ({
  type: GET_EOD_REPORTS_REQUEST,
  payload: params,
});

export const getEodReportsSuccess = (payload: any) => ({
  type: GET_EOD_REPORTS_SUCCESS,
  payload,
});

export const getEodReportsFailure = (error: string) => ({
  type: GET_EOD_REPORTS_FAILURE,
  payload: error,
});
