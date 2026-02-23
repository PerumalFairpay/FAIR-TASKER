import {
  CREATE_MILESTONE_ROADMAP_REQUEST,
  CREATE_MILESTONE_ROADMAP_SUCCESS,
  CREATE_MILESTONE_ROADMAP_FAILURE,
  GET_MILESTONES_ROADMAPS_REQUEST,
  GET_MILESTONES_ROADMAPS_SUCCESS,
  GET_MILESTONES_ROADMAPS_FAILURE,
  GET_MILESTONE_ROADMAP_REQUEST,
  GET_MILESTONE_ROADMAP_SUCCESS,
  GET_MILESTONE_ROADMAP_FAILURE,
  UPDATE_MILESTONE_ROADMAP_REQUEST,
  UPDATE_MILESTONE_ROADMAP_SUCCESS,
  UPDATE_MILESTONE_ROADMAP_FAILURE,
  DELETE_MILESTONE_ROADMAP_REQUEST,
  DELETE_MILESTONE_ROADMAP_SUCCESS,
  DELETE_MILESTONE_ROADMAP_FAILURE,
  CLEAR_MILESTONE_ROADMAP_DETAILS,
} from "./actionType";

export const createMilestoneRoadmapRequest = (payload: any) => ({
  type: CREATE_MILESTONE_ROADMAP_REQUEST,
  payload,
});

export const createMilestoneRoadmapSuccess = (payload: any) => ({
  type: CREATE_MILESTONE_ROADMAP_SUCCESS,
  payload,
});

export const createMilestoneRoadmapFailure = (error: string) => ({
  type: CREATE_MILESTONE_ROADMAP_FAILURE,
  payload: error,
});

export const getMilestonesRoadmapsRequest = (params?: any) => ({
  type: GET_MILESTONES_ROADMAPS_REQUEST,
  payload: params,
});

export const getMilestonesRoadmapsSuccess = (payload: any) => ({
  type: GET_MILESTONES_ROADMAPS_SUCCESS,
  payload,
});

export const getMilestonesRoadmapsFailure = (error: string) => ({
  type: GET_MILESTONES_ROADMAPS_FAILURE,
  payload: error,
});

export const getMilestoneRoadmapRequest = (id: string) => ({
  type: GET_MILESTONE_ROADMAP_REQUEST,
  payload: id,
});

export const getMilestoneRoadmapSuccess = (payload: any) => ({
  type: GET_MILESTONE_ROADMAP_SUCCESS,
  payload,
});

export const getMilestoneRoadmapFailure = (error: string) => ({
  type: GET_MILESTONE_ROADMAP_FAILURE,
  payload: error,
});

export const updateMilestoneRoadmapRequest = (id: string, payload: any) => ({
  type: UPDATE_MILESTONE_ROADMAP_REQUEST,
  payload: { id, payload },
});

export const updateMilestoneRoadmapSuccess = (payload: any) => ({
  type: UPDATE_MILESTONE_ROADMAP_SUCCESS,
  payload,
});

export const updateMilestoneRoadmapFailure = (error: string) => ({
  type: UPDATE_MILESTONE_ROADMAP_FAILURE,
  payload: error,
});

export const deleteMilestoneRoadmapRequest = (id: string) => ({
  type: DELETE_MILESTONE_ROADMAP_REQUEST,
  payload: id,
});

export const deleteMilestoneRoadmapSuccess = (id: string) => ({
  type: DELETE_MILESTONE_ROADMAP_SUCCESS,
  payload: id,
});

export const deleteMilestoneRoadmapFailure = (error: string) => ({
  type: DELETE_MILESTONE_ROADMAP_FAILURE,
  payload: error,
});

export const clearMilestoneRoadmapDetails = () => ({
  type: CLEAR_MILESTONE_ROADMAP_DETAILS,
});
