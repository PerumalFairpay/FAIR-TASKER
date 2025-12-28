import {
    GET_EMPLOYEE_LIST_REQUEST,
    GET_EMPLOYEE_LIST_SUCCESS,
    GET_EMPLOYEE_LIST_FAILURE,
} from "./actionType";

const initialState = {
    employeeList: [],
    loading: false,
    error: null,
    total: 0,
    perPage: 50,
    currentPage: 1,
    lastPage: 1,
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
        default:
            return state;
    }
};

export default employeeReducer;
