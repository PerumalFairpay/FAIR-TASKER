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
  loading: boolean;
  error: string | null;
  success: string | null;
  summaryLoading: boolean;
  summarySuccess: string | null;
  summaryError: string | null;
}

const initialProjectState: ProjectState = {
  projects: [],
  project: null,
  loading: false,
  error: null,
  success: null,
  summaryLoading: false,
  summarySuccess: null,
  summaryError: null,
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
        loading: true,
        error: null,
        success: null,
      };
    case CREATE_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload.message || "Project created successfully",
        projects: [...state.projects, action.payload.data],
      };
    case CREATE_PROJECT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get All
    case GET_PROJECTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_PROJECTS_SUCCESS:
      return {
        ...state,
        loading: false,
        projects: action.payload.data,
      };
    case GET_PROJECTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get Single
    case GET_PROJECT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        project: null,
      };
    case GET_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        project: action.payload.data,
      };
    case GET_PROJECT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Update
    case UPDATE_PROJECT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: null,
      };
    case UPDATE_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload.message || "Project updated successfully",
        projects: state.projects.map((project) =>
          project.id === action.payload.data.id ? action.payload.data : project,
        ),
        project: action.payload.data,
      };
    case UPDATE_PROJECT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Delete
    case DELETE_PROJECT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: null,
      };
    case DELETE_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload.message || "Project deleted successfully",
        projects: state.projects.filter(
          (project) => project.id !== action.payload.id,
        ),
      };
    case DELETE_PROJECT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get Projects Summary
    case GET_PROJECTS_SUMMARY_REQUEST:
      return {
        ...state,
        summaryLoading: true,
        summaryError: null,
        summarySuccess: null,
      };
    case GET_PROJECTS_SUMMARY_SUCCESS:
      return {
        ...state,
        summaryLoading: false,
        projects: action.payload.data,
        summarySuccess: "Projects summary fetched successfully",
      };
    case GET_PROJECTS_SUMMARY_FAILURE:
      return {
        ...state,
        summaryLoading: false,
        summaryError: action.payload,
      };

    case CLEAR_PROJECT_DETAILS:
      return {
        ...state,
        error: null,
        success: null,
        project: null,
      };

    default:
      return state;
  }
};

export default projectReducer;
