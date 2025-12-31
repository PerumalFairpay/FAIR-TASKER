import * as actionTypes from "./actionType";

export const createTaskRequest = (payload: any) => ({
    type: actionTypes.CREATE_TASK_REQUEST,
    payload,
});

export const createTaskSuccess = (payload: any) => ({
    type: actionTypes.CREATE_TASK_SUCCESS,
    payload,
});

export const createTaskFailure = (error: string) => ({
    type: actionTypes.CREATE_TASK_FAILURE,
    payload: error,
});

export const getTasksRequest = (params?: any) => ({
    type: actionTypes.GET_TASKS_REQUEST,
    payload: params,
});

export const getTasksSuccess = (payload: any) => ({
    type: actionTypes.GET_TASKS_SUCCESS,
    payload,
});

export const getTasksFailure = (error: string) => ({
    type: actionTypes.GET_TASKS_FAILURE,
    payload: error,
});

export const getTaskRequest = (id: string) => ({
    type: actionTypes.GET_TASK_REQUEST,
    payload: id,
});

export const getTaskSuccess = (payload: any) => ({
    type: actionTypes.GET_TASK_SUCCESS,
    payload,
});

export const getTaskFailure = (error: string) => ({
    type: actionTypes.GET_TASK_FAILURE,
    payload: error,
});

export const updateTaskRequest = (id: string, payload: any) => ({
    type: actionTypes.UPDATE_TASK_REQUEST,
    payload: { id, payload },
});

export const updateTaskSuccess = (payload: any) => ({
    type: actionTypes.UPDATE_TASK_SUCCESS,
    payload,
});

export const updateTaskFailure = (error: string) => ({
    type: actionTypes.UPDATE_TASK_FAILURE,
    payload: error,
});

export const deleteTaskRequest = (id: string) => ({
    type: actionTypes.DELETE_TASK_REQUEST,
    payload: id,
});

export const deleteTaskSuccess = (id: string) => ({
    type: actionTypes.DELETE_TASK_SUCCESS,
    payload: id,
});

export const deleteTaskFailure = (error: string) => ({
    type: actionTypes.DELETE_TASK_FAILURE,
    payload: error,
});

export const submitEodReportRequest = (payload: any) => ({
    type: actionTypes.SUBMIT_EOD_REPORT_REQUEST,
    payload,
});

export const submitEodReportSuccess = (payload: any) => ({
    type: actionTypes.SUBMIT_EOD_REPORT_SUCCESS,
    payload,
});

export const submitEodReportFailure = (error: string) => ({
    type: actionTypes.SUBMIT_EOD_REPORT_FAILURE,
    payload: error,
});

export const getEodReportsRequest = (params?: any) => ({
    type: actionTypes.GET_EOD_REPORTS_REQUEST,
    payload: params,
});

export const getEodReportsSuccess = (payload: any) => ({
    type: actionTypes.GET_EOD_REPORTS_SUCCESS,
    payload,
});

export const getEodReportsFailure = (error: string) => ({
    type: actionTypes.GET_EOD_REPORTS_FAILURE,
    payload: error,
});
