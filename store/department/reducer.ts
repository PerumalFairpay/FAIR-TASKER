import {
    CREATE_DEPARTMENT_REQUEST, CREATE_DEPARTMENT_SUCCESS, CREATE_DEPARTMENT_FAILURE,
    GET_DEPARTMENTS_REQUEST, GET_DEPARTMENTS_SUCCESS, GET_DEPARTMENTS_FAILURE,
    GET_DEPARTMENT_REQUEST, GET_DEPARTMENT_SUCCESS, GET_DEPARTMENT_FAILURE,
    UPDATE_DEPARTMENT_REQUEST, UPDATE_DEPARTMENT_SUCCESS, UPDATE_DEPARTMENT_FAILURE,
    DELETE_DEPARTMENT_REQUEST, DELETE_DEPARTMENT_SUCCESS, DELETE_DEPARTMENT_FAILURE
} from "./actionType";

interface DepartmentState {
    departments: any[];
    department: any | null;
    loading: boolean;
    error: string | null;
    success: string | null;
}

const initialDepartmentState: DepartmentState = {
    departments: [],
    department: null,
    loading: false,
    error: null,
    success: null,
};

const departmentReducer = (state: DepartmentState = initialDepartmentState, action: any): DepartmentState => {
    switch (action.type) {
        // Create
        case CREATE_DEPARTMENT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: null,
            };
        case CREATE_DEPARTMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.message,
                departments: [...state.departments, action.payload.data],
            };
        case CREATE_DEPARTMENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Get All
        case GET_DEPARTMENTS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_DEPARTMENTS_SUCCESS:
            return {
                ...state,
                loading: false,
                departments: action.payload.data,
            };
        case GET_DEPARTMENTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Get Single
        case GET_DEPARTMENT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                department: null,
            };
        case GET_DEPARTMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                department: action.payload.data,
            };
        case GET_DEPARTMENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Update
        case UPDATE_DEPARTMENT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: null,
            };
        case UPDATE_DEPARTMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.message,
                departments: state.departments.map(dept =>
                    dept._id === action.payload.data._id ? action.payload.data : dept
                ),
                department: action.payload.data,
            };
        case UPDATE_DEPARTMENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Delete
        case DELETE_DEPARTMENT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: null,
            };
        case DELETE_DEPARTMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.message,
                departments: state.departments.filter(dept => dept._id !== action.payload.id), // Assuming payload might contain ID, or we need to handle it in action
            };
        case DELETE_DEPARTMENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};

export default departmentReducer;
