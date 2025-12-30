import {
    CREATE_EMPLOYEE_REQUEST, CREATE_EMPLOYEE_SUCCESS, CREATE_EMPLOYEE_FAILURE,
    GET_EMPLOYEES_REQUEST, GET_EMPLOYEES_SUCCESS, GET_EMPLOYEES_FAILURE,
    GET_EMPLOYEE_REQUEST, GET_EMPLOYEE_SUCCESS, GET_EMPLOYEE_FAILURE,
    UPDATE_EMPLOYEE_REQUEST, UPDATE_EMPLOYEE_SUCCESS, UPDATE_EMPLOYEE_FAILURE,
    DELETE_EMPLOYEE_REQUEST, DELETE_EMPLOYEE_SUCCESS, DELETE_EMPLOYEE_FAILURE,
    CLEAR_EMPLOYEE_DETAILS
} from "./actionType";

interface EmployeeState {
    employees: any[];
    employee: any | null;
    loading: boolean;
    error: string | null;
    success: string | null;
}

const initialEmployeeState: EmployeeState = {
    employees: [],
    employee: null,
    loading: false,
    error: null,
    success: null,
};

const employeeReducer = (state: EmployeeState = initialEmployeeState, action: any): EmployeeState => {
    switch (action.type) {
        // Create
        case CREATE_EMPLOYEE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: null,
            };
        case CREATE_EMPLOYEE_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.message || "Employee created successfully",
                employees: [...state.employees, action.payload.data],
            };
        case CREATE_EMPLOYEE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Get All
        case GET_EMPLOYEES_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_EMPLOYEES_SUCCESS:
            return {
                ...state,
                loading: false,
                employees: action.payload.data,
            };
        case GET_EMPLOYEES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Get Single
        case GET_EMPLOYEE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                employee: null,
            };
        case GET_EMPLOYEE_SUCCESS:
            return {
                ...state,
                loading: false,
                employee: action.payload.data,
            };
        case GET_EMPLOYEE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Update
        case UPDATE_EMPLOYEE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: null,
            };
        case UPDATE_EMPLOYEE_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.message || "Employee updated successfully",
                employees: state.employees.map(emp =>
                    emp.id === action.payload.data.id ? action.payload.data : emp
                ),
                employee: action.payload.data,
            };
        case UPDATE_EMPLOYEE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Delete
        case DELETE_EMPLOYEE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: null,
            };
        case DELETE_EMPLOYEE_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.message || "Employee deleted successfully",
                employees: state.employees.filter(emp => emp.id !== action.payload.id),
            };
        case DELETE_EMPLOYEE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case CLEAR_EMPLOYEE_DETAILS:
            return {
                ...state,
                error: null,
                success: null,
                employee: null,
            };

        default:
            return state;
    }
};

export default employeeReducer;
