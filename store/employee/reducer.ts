import {
    GET_EMPLOYEE_LIST_REQUEST,
    GET_EMPLOYEE_LIST_SUCCESS,
    GET_EMPLOYEE_LIST_FAILURE,
    ADD_EMPLOYEE_REQUEST,
    ADD_EMPLOYEE_SUCCESS,
    ADD_EMPLOYEE_FAILURE,
    VIEW_EMPLOYEE_REQUEST,
    VIEW_EMPLOYEE_SUCCESS,
    VIEW_EMPLOYEE_FAILURE,
    UPDATE_EMPLOYEE_REQUEST,
    UPDATE_EMPLOYEE_SUCCESS,
    UPDATE_EMPLOYEE_FAILURE,
    DELETE_EMPLOYEE_REQUEST,
    DELETE_EMPLOYEE_SUCCESS,
    DELETE_EMPLOYEE_FAILURE,
} from "./actionType";

const initialState = {
    employeeList: [],
    loading: false,
    error: null,
    total: 0,
    perPage: 50,
    currentPage: 1,
    lastPage: 1,
    currentEmployee: null,
    employeeAttachments: [],
    successMessage: null,
    isSubmitting: false,
};

const employeeReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case GET_EMPLOYEE_LIST_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_EMPLOYEE_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                employeeList: action.payload.data,
                total: action.payload.total,
                perPage: action.payload.per_page,
                currentPage: action.payload.current_page,
                lastPage: action.payload.last_page,
            };
        case GET_EMPLOYEE_LIST_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case ADD_EMPLOYEE_REQUEST:
        case UPDATE_EMPLOYEE_REQUEST:
        case DELETE_EMPLOYEE_REQUEST:
            return {
                ...state,
                isSubmitting: true,
                error: null,
                successMessage: null,
            };
        case ADD_EMPLOYEE_SUCCESS:
        case UPDATE_EMPLOYEE_SUCCESS:
        case DELETE_EMPLOYEE_SUCCESS:
            return {
                ...state,
                isSubmitting: false,
                successMessage: action.payload,
            };
        case ADD_EMPLOYEE_FAILURE:
        case UPDATE_EMPLOYEE_FAILURE:
        case DELETE_EMPLOYEE_FAILURE:
            return {
                ...state,
                isSubmitting: false,
                error: action.payload,
            };
        case VIEW_EMPLOYEE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                currentEmployee: null,
                employeeAttachments: [],
            };
        case VIEW_EMPLOYEE_SUCCESS:
            return {
                ...state,
                loading: false,
                currentEmployee: action.payload.data,
                employeeAttachments: action.payload.attachment,
            };
        case VIEW_EMPLOYEE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default employeeReducer;
