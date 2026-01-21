import {
    CREATE_EMPLOYEE_REQUEST, CREATE_EMPLOYEE_SUCCESS, CREATE_EMPLOYEE_FAILURE,
    GET_EMPLOYEES_REQUEST, GET_EMPLOYEES_SUCCESS, GET_EMPLOYEES_FAILURE,
    GET_EMPLOYEE_REQUEST, GET_EMPLOYEE_SUCCESS, GET_EMPLOYEE_FAILURE,
    UPDATE_EMPLOYEE_REQUEST, UPDATE_EMPLOYEE_SUCCESS, UPDATE_EMPLOYEE_FAILURE,
    DELETE_EMPLOYEE_REQUEST, DELETE_EMPLOYEE_SUCCESS, DELETE_EMPLOYEE_FAILURE,
    UPDATE_USER_PERMISSIONS_REQUEST, UPDATE_USER_PERMISSIONS_SUCCESS, UPDATE_USER_PERMISSIONS_FAILURE,
    GET_USER_PERMISSIONS_REQUEST, GET_USER_PERMISSIONS_SUCCESS, GET_USER_PERMISSIONS_FAILURE,
    CLEAR_EMPLOYEE_DETAILS
} from "./actionType";

interface EmployeeState {
    employees: any[];
    meta: {
        current_page: number;
        total_pages: number;
        total_items: number;
        limit: number;
    };
    employee: any | null;
    userPermissions: { role_permissions: string[], direct_permissions: string[] };
    loading: boolean;
    error: string | null;
    success: string | null;
}

const initialEmployeeState: EmployeeState = {
    employees: [],
    meta: {
        current_page: 1,
        total_pages: 1,
        total_items: 0,
        limit: 10
    },
    employee: null,
    userPermissions: { role_permissions: [], direct_permissions: [] },
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
                meta: action.payload.meta || state.meta,
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

        // Update User Permissions
        case UPDATE_USER_PERMISSIONS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: null,
            };
        case UPDATE_USER_PERMISSIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.message || "Permissions updated successfully",
            };
        case UPDATE_USER_PERMISSIONS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Get User Permissions
        case GET_USER_PERMISSIONS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                userPermissions: { role_permissions: [], direct_permissions: [] }, // clear previous
            };
        case GET_USER_PERMISSIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                userPermissions: {
                    role_permissions: action.payload.data.role_permissions,
                    direct_permissions: action.payload.data.direct_permissions
                },
            };
        case GET_USER_PERMISSIONS_FAILURE:
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
