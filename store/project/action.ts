import {
  CREATE_PROJECT_REQUEST,
  CREATE_PROJECT_SUCCESS,
  CREATE_PROJECT_FAILURE,
  GET_PROJECTS_REQUEST,
  GET_PROJECTS_SUCCESS,
  GET_PROJECTS_FAILURE,
  GET_PROJECT_REQUEST,
  GET_PROJECT_SUCCESS,
  GET_PROJECT_FAILURE,
  UPDATE_PROJECT_REQUEST,
  UPDATE_PROJECT_SUCCESS,
  UPDATE_PROJECT_FAILURE,
  DELETE_PROJECT_REQUEST,
  DELETE_PROJECT_SUCCESS,
  DELETE_PROJECT_FAILURE,
  GET_PROJECTS_SUMMARY_REQUEST,
  GET_PROJECTS_SUMMARY_SUCCESS,
  GET_PROJECTS_SUMMARY_FAILURE,
  CLEAR_PROJECT_DETAILS,
} from "./actionType";

// Create Project
export const createProjectRequest = (payload: any) => ({
  type: CREATE_PROJECT_REQUEST,
  payload,
});
export const createProjectSuccess = (response: any) => ({
  type: CREATE_PROJECT_SUCCESS,
  payload: response,
});
export const createProjectFailure = (error: any) => ({
  type: CREATE_PROJECT_FAILURE,
  payload: error,
});

// Get All Projects
export const getProjectsRequest = () => ({
  type: GET_PROJECTS_REQUEST,
});
export const getProjectsSuccess = (response: any) => ({
  type: GET_PROJECTS_SUCCESS,
  payload: response,
});
export const getProjectsFailure = (error: any) => ({
  type: GET_PROJECTS_FAILURE,
  payload: error,
});

// Get Single Project
export const getProjectRequest = (id: string) => ({
  type: GET_PROJECT_REQUEST,
  payload: id,
});
export const getProjectSuccess = (response: any) => ({
  type: GET_PROJECT_SUCCESS,
  payload: response,
});
export const getProjectFailure = (error: any) => ({
  type: GET_PROJECT_FAILURE,
  payload: error,
});

// Update Project
export const updateProjectRequest = (id: string, payload: any) => ({
  type: UPDATE_PROJECT_REQUEST,
  payload: { id, payload },
});
export const updateProjectSuccess = (response: any) => ({
  type: UPDATE_PROJECT_SUCCESS,
  payload: response,
});
export const updateProjectFailure = (error: any) => ({
  type: UPDATE_PROJECT_FAILURE,
  payload: error,
});

// Delete Project
export const deleteProjectRequest = (id: string) => ({
  type: DELETE_PROJECT_REQUEST,
  payload: id,
});
export const deleteProjectSuccess = (response: any) => ({
  type: DELETE_PROJECT_SUCCESS,
  payload: response,
});
export const deleteProjectFailure = (error: any) => ({
  type: DELETE_PROJECT_FAILURE,
  payload: error,
});

// Get Projects Summary
export const getProjectsSummaryRequest = () => ({
  type: GET_PROJECTS_SUMMARY_REQUEST,
});
export const getProjectsSummarySuccess = (response: any) => ({
  type: GET_PROJECTS_SUMMARY_SUCCESS,
  payload: response,
});
export const getProjectsSummaryFailure = (error: any) => ({
  type: GET_PROJECTS_SUMMARY_FAILURE,
  payload: error,
});

// Clear Details
export const clearProjectDetails = () => ({
  type: CLEAR_PROJECT_DETAILS,
});
