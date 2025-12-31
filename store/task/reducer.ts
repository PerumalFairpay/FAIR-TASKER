import * as actionTypes from "./actionType";

interface TaskState {
    tasks: any[];
    task: any | null;
    eodReports: any[];
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: TaskState = {
    tasks: [],
    task: null,
    eodReports: [],
    loading: false,
    error: null,
    success: false,
};

const taskReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case actionTypes.CREATE_TASK_REQUEST:
        case actionTypes.GET_TASKS_REQUEST:
        case actionTypes.GET_TASK_REQUEST:
        case actionTypes.UPDATE_TASK_REQUEST:
        case actionTypes.DELETE_TASK_REQUEST:
        case actionTypes.SUBMIT_EOD_REPORT_REQUEST:
        case actionTypes.GET_EOD_REPORTS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: false,
            };

        case actionTypes.CREATE_TASK_SUCCESS:
            return {
                ...state,
                loading: false,
                tasks: [action.payload, ...state.tasks],
                success: true,
            };

        case actionTypes.GET_TASKS_SUCCESS:
            return {
                ...state,
                loading: false,
                tasks: action.payload,
            };

        case actionTypes.GET_TASK_SUCCESS:
            return {
                ...state,
                loading: false,
                task: action.payload,
            };

        case actionTypes.UPDATE_TASK_SUCCESS:
            return {
                ...state,
                loading: false,
                tasks: state.tasks.map((task) =>
                    task.id === action.payload.id ? action.payload : task
                ),
                task: action.payload,
                success: true,
            };

        case actionTypes.DELETE_TASK_SUCCESS:
            return {
                ...state,
                loading: false,
                tasks: state.tasks.filter((task) => task.id !== action.payload),
                success: true,
            };

        case actionTypes.SUBMIT_EOD_REPORT_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
            };

        case actionTypes.GET_EOD_REPORTS_SUCCESS:
            return {
                ...state,
                loading: false,
                eodReports: action.payload,
            };

        case actionTypes.CREATE_TASK_FAILURE:
        case actionTypes.GET_TASKS_FAILURE:
        case actionTypes.GET_TASK_FAILURE:
        case actionTypes.UPDATE_TASK_FAILURE:
        case actionTypes.DELETE_TASK_FAILURE:
        case actionTypes.SUBMIT_EOD_REPORT_FAILURE:
        case actionTypes.GET_EOD_REPORTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false,
            };

        default:
            return state;
    }
};

export default taskReducer;
