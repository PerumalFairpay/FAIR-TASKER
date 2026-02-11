import {
  CREATE_EMPLOYEE_REQUEST,
  CREATE_EMPLOYEE_SUCCESS,
  CREATE_EMPLOYEE_FAILURE,
  GET_EMPLOYEES_REQUEST,
  GET_EMPLOYEES_SUCCESS,
  GET_EMPLOYEES_FAILURE,
  GET_EMPLOYEE_REQUEST,
  GET_EMPLOYEE_SUCCESS,
  GET_EMPLOYEE_FAILURE,
  UPDATE_EMPLOYEE_REQUEST,
  UPDATE_EMPLOYEE_SUCCESS,
  UPDATE_EMPLOYEE_FAILURE,
  DELETE_EMPLOYEE_REQUEST,
  DELETE_EMPLOYEE_SUCCESS,
  DELETE_EMPLOYEE_FAILURE,
  UPDATE_USER_PERMISSIONS_REQUEST,
  UPDATE_USER_PERMISSIONS_SUCCESS,
  UPDATE_USER_PERMISSIONS_FAILURE,
  GET_USER_PERMISSIONS_REQUEST,
  GET_USER_PERMISSIONS_SUCCESS,
  GET_USER_PERMISSIONS_FAILURE,
  GET_EMPLOYEES_SUMMARY_REQUEST,
  GET_EMPLOYEES_SUMMARY_SUCCESS,
  GET_EMPLOYEES_SUMMARY_FAILURE,
  CLEAR_EMPLOYEE_DETAILS,
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
  userPermissions: { role_permissions: string[]; direct_permissions: string[] };

  // Create Employee
  createLoading: boolean;
  createSuccess: string | null;
  createError: string | null;

  // List Employees
  listLoading: boolean;
  listSuccess: string | null;
  listError: string | null;

  // Get Single Employee
  getLoading: boolean;
  getSuccess: string | null;
  getError: string | null;

  // Update Employee
  updateLoading: boolean;
  updateSuccess: string | null;
  updateError: string | null;

  // Delete Employee
  deleteLoading: boolean;
  deleteSuccess: string | null;
  deleteError: string | null;

  // Update Permissions
  updatePermissionsLoading: boolean;
  updatePermissionsSuccess: string | null;
  updatePermissionsError: string | null;

  // Get Permissions
  getPermissionsLoading: boolean;
  getPermissionsSuccess: string | null;
  getPermissionsError: string | null;

  // Summary Specific
  summaryLoading: boolean;
  summarySuccess: string | null;
  summaryError: string | null;
}

const initialEmployeeState: EmployeeState = {
  employees: [],
  meta: {
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    limit: 10,
  },
  employee: null,
  userPermissions: { role_permissions: [], direct_permissions: [] },

  createLoading: false,
  createSuccess: null,
  createError: null,

  listLoading: false,
  listSuccess: null,
  listError: null,

  getLoading: false,
  getSuccess: null,
  getError: null,

  updateLoading: false,
  updateSuccess: null,
  updateError: null,

  deleteLoading: false,
  deleteSuccess: null,
  deleteError: null,

  updatePermissionsLoading: false,
  updatePermissionsSuccess: null,
  updatePermissionsError: null,

  getPermissionsLoading: false,
  getPermissionsSuccess: null,
  getPermissionsError: null,

  summaryLoading: false,
  summarySuccess: null,
  summaryError: null,
};

const employeeReducer = (
  state: EmployeeState = initialEmployeeState,
  action: any,
): EmployeeState => {
  switch (action.type) {
    // Create
    case CREATE_EMPLOYEE_REQUEST:
      return {
        ...state,
        createLoading: true,
        createError: null,
        createSuccess: null,
      };
    case CREATE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        createLoading: false,
        createSuccess:
          action.payload.message || "Employee created successfully",
        employees: [...state.employees, action.payload.data],
      };
    case CREATE_EMPLOYEE_FAILURE:
      return {
        ...state,
        createLoading: false,
        createError: action.payload,
      };

    // Get All
    case GET_EMPLOYEES_REQUEST:
      return {
        ...state,
        listLoading: true,
        listError: null,
      };
    case GET_EMPLOYEES_SUCCESS:
      return {
        ...state,
        listLoading: false,
        employees: action.payload.data,
        meta: action.payload.meta || state.meta,
      };
    case GET_EMPLOYEES_FAILURE:
      return {
        ...state,
        listLoading: false,
        listError: action.payload,
      };

    // Get Single
    case GET_EMPLOYEE_REQUEST:
      return {
        ...state,
        getLoading: true,
        getError: null,
        employee: null,
      };
    case GET_EMPLOYEE_SUCCESS:
      return {
        ...state,
        getLoading: false,
        employee: action.payload.data,
      };
    case GET_EMPLOYEE_FAILURE:
      return {
        ...state,
        getLoading: false,
        getError: action.payload,
      };

    // Update
    case UPDATE_EMPLOYEE_REQUEST:
      return {
        ...state,
        updateLoading: true,
        updateError: null,
        updateSuccess: null,
      };
    case UPDATE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        updateSuccess:
          action.payload.message || "Employee updated successfully",
        employees: state.employees.map((emp) =>
          emp.id === action.payload.data.id ? action.payload.data : emp,
        ),
        employee: action.payload.data,
      };
    case UPDATE_EMPLOYEE_FAILURE:
      return {
        ...state,
        updateLoading: false,
        updateError: action.payload,
      };

    // Delete
    case DELETE_EMPLOYEE_REQUEST:
      return {
        ...state,
        deleteLoading: true,
        deleteError: null,
        deleteSuccess: null,
      };
    case DELETE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        deleteSuccess:
          action.payload.message || "Employee deleted successfully",
        employees: state.employees.filter(
          (emp) => emp.id !== action.payload.id,
        ),
      };
    case DELETE_EMPLOYEE_FAILURE:
      return {
        ...state,
        deleteLoading: false,
        deleteError: action.payload,
      };

    // Update User Permissions
    case UPDATE_USER_PERMISSIONS_REQUEST:
      return {
        ...state,
        updatePermissionsLoading: true,
        updatePermissionsError: null,
        updatePermissionsSuccess: null,
      };
    case UPDATE_USER_PERMISSIONS_SUCCESS:
      return {
        ...state,
        updatePermissionsLoading: false,
        updatePermissionsSuccess:
          action.payload.message || "Permissions updated successfully",
      };
    case UPDATE_USER_PERMISSIONS_FAILURE:
      return {
        ...state,
        updatePermissionsLoading: false,
        updatePermissionsError: action.payload,
      };

    // Get User Permissions
    case GET_USER_PERMISSIONS_REQUEST:
      return {
        ...state,
        getPermissionsLoading: true,
        getPermissionsError: null,
        userPermissions: { role_permissions: [], direct_permissions: [] }, // clear previous
      };
    case GET_USER_PERMISSIONS_SUCCESS:
      return {
        ...state,
        getPermissionsLoading: false,
        userPermissions: {
          role_permissions: action.payload.data.role_permissions,
          direct_permissions: action.payload.data.direct_permissions,
        },
      };
    case GET_USER_PERMISSIONS_FAILURE:
      return {
        ...state,
        getPermissionsLoading: false,
        getPermissionsError: action.payload,
      };

    // Get Employees Summary
    case GET_EMPLOYEES_SUMMARY_REQUEST:
      return {
        ...state,
        summaryLoading: true,
        summaryError: null,
        summarySuccess: null,
      };
    case GET_EMPLOYEES_SUMMARY_SUCCESS:
      return {
        ...state,
        summaryLoading: false,
        employees: action.payload.data,
        summarySuccess: "Summary fetched successfully",
      };
    case GET_EMPLOYEES_SUMMARY_FAILURE:
      return {
        ...state,
        summaryLoading: false,
        summaryError: action.payload,
      };

    case CLEAR_EMPLOYEE_DETAILS:
      return {
        ...state,
        createError: null,
        createSuccess: null,
        listError: null,
        listSuccess: null,
        getError: null,
        getSuccess: null,
        updateError: null,
        updateSuccess: null,
        deleteError: null,
        deleteSuccess: null,
        updatePermissionsError: null,
        updatePermissionsSuccess: null,
        getPermissionsError: null,
        getPermissionsSuccess: null,
        employee: null,
      };

    default:
      return state;
  }
};

export default employeeReducer;
