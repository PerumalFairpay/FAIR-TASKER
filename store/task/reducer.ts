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

interface TaskState {
  tasks: any[];
  currentTask: any | null;
  eodReports: any[];

  createTaskLoading: boolean;
  createTaskSuccess: boolean;
  createTaskError: string | null;

  getTasksLoading: boolean;
  getTasksSuccess: boolean;
  getTasksError: string | null;

  getTaskLoading: boolean;
  getTaskSuccess: boolean;
  getTaskError: string | null;

  updateTaskLoading: boolean;
  updateTaskSuccess: boolean;
  updateTaskError: string | null;

  deleteTaskLoading: boolean;
  deleteTaskSuccess: boolean;
  deleteTaskError: string | null;

  submitEodReportLoading: boolean;
  submitEodReportSuccess: boolean;
  submitEodReportError: string | null;

  getEodReportsLoading: boolean;
  getEodReportsSuccess: boolean;
  getEodReportsError: string | null;
}

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  eodReports: [],

  createTaskLoading: false,
  createTaskSuccess: false,
  createTaskError: null,

  getTasksLoading: false,
  getTasksSuccess: false,
  getTasksError: null,

  getTaskLoading: false,
  getTaskSuccess: false,
  getTaskError: null,

  updateTaskLoading: false,
  updateTaskSuccess: false,
  updateTaskError: null,

  deleteTaskLoading: false,
  deleteTaskSuccess: false,
  deleteTaskError: null,

  submitEodReportLoading: false,
  submitEodReportSuccess: false,
  submitEodReportError: null,

  getEodReportsLoading: false,
  getEodReportsSuccess: false,
  getEodReportsError: null,
};

const taskReducer = (state = initialState, action: any) => {
  switch (action.type) {
    // --- Create Task ---
    case CREATE_TASK_REQUEST:
      return {
        ...state,
        createTaskLoading: true,
        createTaskSuccess: false,
        createTaskError: null,
      };
    case CREATE_TASK_SUCCESS:
      return {
        ...state,
        createTaskLoading: false,
        createTaskSuccess: true,
        tasks: [...state.tasks, action.payload],
      };
    case CREATE_TASK_FAILURE:
      return {
        ...state,
        createTaskLoading: false,
        createTaskError: action.payload,
        createTaskSuccess: false,
      };

    // --- Get Tasks ---
    case GET_TASKS_REQUEST:
      return {
        ...state,
        getTasksLoading: true,
        getTasksSuccess: false,
        getTasksError: null,
      };
    case GET_TASKS_SUCCESS:
      return {
        ...state,
        getTasksLoading: false,
        getTasksSuccess: true,
        tasks: action.payload,
      };
    case GET_TASKS_FAILURE:
      return {
        ...state,
        getTasksLoading: false,
        getTasksError: action.payload,
        getTasksSuccess: false,
      };

    // --- Get Single Task ---
    case GET_TASK_REQUEST:
      return {
        ...state,
        getTaskLoading: true,
        getTaskSuccess: false,
        getTaskError: null,
      };
    case GET_TASK_SUCCESS:
      return {
        ...state,
        getTaskLoading: false,
        getTaskSuccess: true,
        currentTask: action.payload,
      };
    case GET_TASK_FAILURE:
      return {
        ...state,
        getTaskLoading: false,
        getTaskError: action.payload,
        getTaskSuccess: false,
      };

    // --- Update Task ---
    case UPDATE_TASK_REQUEST:
      return {
        ...state,
        updateTaskLoading: true,
        updateTaskSuccess: false,
        updateTaskError: null,
      };
    case UPDATE_TASK_SUCCESS:
      return {
        ...state,
        updateTaskLoading: false,
        updateTaskSuccess: true,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task,
        ),
        currentTask: action.payload,
      };
    case UPDATE_TASK_FAILURE:
      return {
        ...state,
        updateTaskLoading: false,
        updateTaskError: action.payload,
        updateTaskSuccess: false,
      };

    // --- Delete Task ---
    case DELETE_TASK_REQUEST:
      return {
        ...state,
        deleteTaskLoading: true,
        deleteTaskSuccess: false,
        deleteTaskError: null,
      };
    case DELETE_TASK_SUCCESS:
      return {
        ...state,
        deleteTaskLoading: false,
        deleteTaskSuccess: true,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case DELETE_TASK_FAILURE:
      return {
        ...state,
        deleteTaskLoading: false,
        deleteTaskError: action.payload,
        deleteTaskSuccess: false,
      };

    // --- Submit EOD Report ---
    case SUBMIT_EOD_REPORT_REQUEST:
      return {
        ...state,
        submitEodReportLoading: true,
        submitEodReportSuccess: false,
        submitEodReportError: null,
      };
    case SUBMIT_EOD_REPORT_SUCCESS:
      return {
        ...state,
        submitEodReportLoading: false,
        submitEodReportSuccess: true,
      };
    case SUBMIT_EOD_REPORT_FAILURE:
      return {
        ...state,
        submitEodReportLoading: false,
        submitEodReportError: action.payload,
        submitEodReportSuccess: false,
      };

    // --- Get EOD Reports ---
    case GET_EOD_REPORTS_REQUEST:
      return {
        ...state,
        getEodReportsLoading: true,
        getEodReportsSuccess: false,
        getEodReportsError: null,
      };
    case GET_EOD_REPORTS_SUCCESS:
      return {
        ...state,
        getEodReportsLoading: false,
        getEodReportsSuccess: true,
        eodReports: action.payload,
      };
    case GET_EOD_REPORTS_FAILURE:
      return {
        ...state,
        getEodReportsLoading: false,
        getEodReportsError: action.payload,
        getEodReportsSuccess: false,
      };

    default:
      return state;
  }
};

export default taskReducer;
