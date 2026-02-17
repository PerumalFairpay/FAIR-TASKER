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

interface ProjectState {
  projects: any[];
  project: any | null;

  // Create
  createProjectLoading: boolean;
  createProjectSuccess: string | null;
  createProjectError: string | null;

  // List
  getProjectsLoading: boolean;
  getProjectsSuccess: string | null;
  getProjectsError: string | null;

  // Get Single
  getProjectLoading: boolean;
  getProjectSuccess: string | null;
  getProjectError: string | null;

  // Update
  updateProjectLoading: boolean;
  updateProjectSuccess: string | null;
  updateProjectError: string | null;

  // Delete
  deleteProjectLoading: boolean;
  deleteProjectSuccess: string | null;
  deleteProjectError: string | null;

  // Summary
  getProjectsSummaryLoading: boolean;
  getProjectsSummarySuccess: string | null;
  getProjectsSummaryError: string | null;
}

const initialProjectState: ProjectState = {
  projects: [],
  project: null,

  createProjectLoading: false,
  createProjectSuccess: null,
  createProjectError: null,

  getProjectsLoading: false,
  getProjectsSuccess: null,
  getProjectsError: null,

  getProjectLoading: false,
  getProjectSuccess: null,
  getProjectError: null,

  updateProjectLoading: false,
  updateProjectSuccess: null,
  updateProjectError: null,

  deleteProjectLoading: false,
  deleteProjectSuccess: null,
  deleteProjectError: null,

  getProjectsSummaryLoading: false,
  getProjectsSummarySuccess: null,
  getProjectsSummaryError: null,
};

const projectReducer = (
  state: ProjectState = initialProjectState,
  action: any,
): ProjectState => {
  switch (action.type) {
    // Create
    case CREATE_PROJECT_REQUEST:
      return {
        ...state,
        createProjectLoading: true,
        createProjectError: null,
        createProjectSuccess: null,
      };
    case CREATE_PROJECT_SUCCESS:
      return {
        ...state,
        createProjectLoading: false,
        createProjectSuccess:
          action.payload.message || "Project created successfully",
        projects: [...state.projects, action.payload.data],
      };
    case CREATE_PROJECT_FAILURE:
      return {
        ...state,
        createProjectLoading: false,
        createProjectError: action.payload,
      };

    // Get All
    case GET_PROJECTS_REQUEST:
      return {
        ...state,
        getProjectsLoading: true,
        getProjectsError: null,
      };
    case GET_PROJECTS_SUCCESS:
      return {
        ...state,
        getProjectsLoading: false,
        projects: action.payload.data,
      };
    case GET_PROJECTS_FAILURE:
      return {
        ...state,
        getProjectsLoading: false,
        getProjectsError: action.payload,
      };

    // Get Single
    case GET_PROJECT_REQUEST:
      return {
        ...state,
        getProjectLoading: true,
        getProjectError: null,
        project: null,
      };
    case GET_PROJECT_SUCCESS:
      return {
        ...state,
        getProjectLoading: false,
        project: action.payload.data,
      };
    case GET_PROJECT_FAILURE:
      return {
        ...state,
        getProjectLoading: false,
        getProjectError: action.payload,
      };

    // Update
    case UPDATE_PROJECT_REQUEST:
      return {
        ...state,
        updateProjectLoading: true,
        updateProjectError: null,
        updateProjectSuccess: null,
      };
    case UPDATE_PROJECT_SUCCESS:
      return {
        ...state,
        updateProjectLoading: false,
        updateProjectSuccess:
          action.payload.message || "Project updated successfully",
        projects: state.projects.map((project) =>
          project.id === action.payload.data.id ? action.payload.data : project,
        ),
        project: action.payload.data,
      };
    case UPDATE_PROJECT_FAILURE:
      return {
        ...state,
        updateProjectLoading: false,
        updateProjectError: action.payload,
      };

    // Delete
    case DELETE_PROJECT_REQUEST:
      return {
        ...state,
        deleteProjectLoading: true,
        deleteProjectError: null,
        deleteProjectSuccess: null,
      };
    case DELETE_PROJECT_SUCCESS:
      return {
        ...state,
        deleteProjectLoading: false,
        deleteProjectSuccess:
          action.payload.message || "Project deleted successfully",
        projects: state.projects.filter(
          (project) => project.id !== action.payload.id,
        ),
      };
    case DELETE_PROJECT_FAILURE:
      return {
        ...state,
        deleteProjectLoading: false,
        deleteProjectError: action.payload,
      };

    // Get Projects Summary
    case GET_PROJECTS_SUMMARY_REQUEST:
      return {
        ...state,
        getProjectsSummaryLoading: true,
        getProjectsSummaryError: null,
        getProjectsSummarySuccess: null,
      };
    case GET_PROJECTS_SUMMARY_SUCCESS:
      return {
        ...state,
        getProjectsSummaryLoading: false,
        projects: action.payload.data,
        getProjectsSummarySuccess: "Projects summary fetched successfully",
      };
    case GET_PROJECTS_SUMMARY_FAILURE:
      return {
        ...state,
        getProjectsSummaryLoading: false,
        getProjectsSummaryError: action.payload,
      };

    case CLEAR_PROJECT_DETAILS:
      return {
        ...state,
        createProjectError: null,
        createProjectSuccess: null,
        getProjectsError: null,
        getProjectsSuccess: null,
        getProjectError: null,
        getProjectSuccess: null,
        updateProjectError: null,
        updateProjectSuccess: null,
        deleteProjectError: null,
        deleteProjectSuccess: null,
        getProjectsSummaryError: null,
        getProjectsSummarySuccess: null,
        project: null,
      };

    default:
      return state;
  }
};

export default projectReducer;
