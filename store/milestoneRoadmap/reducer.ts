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

const initialState = {
  milestonesRoadmaps: [],
  currentMilestoneRoadmap: null,

  createLoading: false,
  createSuccess: false,
  createError: null,

  getLoading: false,
  getSuccess: false,
  getError: null,

  getSingleLoading: false,
  getSingleSuccess: false,
  getSingleError: null,

  updateLoading: false,
  updateSuccess: false,
  updateError: null,

  deleteLoading: false,
  deleteSuccess: false,
  deleteError: null,
  previousMilestonesRoadmaps: null,
};

const milestoneRoadmapReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case CREATE_MILESTONE_ROADMAP_REQUEST:
      return {
        ...state,
        createLoading: true,
        createSuccess: false,
        createError: null,
      };
    case CREATE_MILESTONE_ROADMAP_SUCCESS:
      return {
        ...state,
        createLoading: false,
        createSuccess: true,
        milestonesRoadmaps: [action.payload, ...state.milestonesRoadmaps],
      };
    case CREATE_MILESTONE_ROADMAP_FAILURE:
      return {
        ...state,
        createLoading: false,
        createError: action.payload,
      };

    case GET_MILESTONES_ROADMAPS_REQUEST:
      return {
        ...state,
        getLoading: true,
        getSuccess: false,
        getError: null,
      };
    case GET_MILESTONES_ROADMAPS_SUCCESS:
      return {
        ...state,
        getLoading: false,
        getSuccess: true,
        milestonesRoadmaps: action.payload,
      };
    case GET_MILESTONES_ROADMAPS_FAILURE:
      return {
        ...state,
        getLoading: false,
        getError: action.payload,
      };

    case GET_MILESTONE_ROADMAP_REQUEST:
      return {
        ...state,
        getSingleLoading: true,
        getSingleSuccess: false,
        getSingleError: null,
      };
    case GET_MILESTONE_ROADMAP_SUCCESS:
      return {
        ...state,
        getSingleLoading: false,
        getSingleSuccess: true,
        currentMilestoneRoadmap: action.payload,
      };
    case GET_MILESTONE_ROADMAP_FAILURE:
      return {
        ...state,
        getSingleLoading: false,
        getSingleError: action.payload,
      };

    case UPDATE_MILESTONE_ROADMAP_REQUEST:
      return {
        ...state,
        updateLoading: true,
        updateSuccess: false,
        updateError: null,
        previousMilestonesRoadmaps: state.milestonesRoadmaps,
        milestonesRoadmaps: state.milestonesRoadmaps.map((item: any) =>
          item.id === action.payload.id
            ? {
                ...item,
                ...(action.payload.payload instanceof FormData
                  ? {}
                  : action.payload.payload),
              }
            : item,
        ),
      };
    case UPDATE_MILESTONE_ROADMAP_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        updateSuccess: true,
        milestonesRoadmaps: state.milestonesRoadmaps.map((item: any) =>
          item.id === action.payload.id ? action.payload : item,
        ),
        currentMilestoneRoadmap: action.payload,
        previousMilestonesRoadmaps: null,
      };
    case UPDATE_MILESTONE_ROADMAP_FAILURE:
      return {
        ...state,
        updateLoading: false,
        updateError: action.payload,
        milestonesRoadmaps:
          state.previousMilestonesRoadmaps || state.milestonesRoadmaps,
        previousMilestonesRoadmaps: null,
      };

    case DELETE_MILESTONE_ROADMAP_REQUEST:
      return {
        ...state,
        deleteLoading: true,
        deleteSuccess: false,
        deleteError: null,
      };
    case DELETE_MILESTONE_ROADMAP_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        deleteSuccess: true,
        milestonesRoadmaps: state.milestonesRoadmaps.filter(
          (item: any) => item.id !== action.payload,
        ),
      };
    case DELETE_MILESTONE_ROADMAP_FAILURE:
      return {
        ...state,
        deleteLoading: false,
        deleteError: action.payload,
      };

    case CLEAR_MILESTONE_ROADMAP_DETAILS:
      return {
        ...state,
        currentMilestoneRoadmap: null,
        createSuccess: false,
        updateSuccess: false,
        deleteSuccess: false,
      };

    default:
      return state;
  }
};

export default milestoneRoadmapReducer;
