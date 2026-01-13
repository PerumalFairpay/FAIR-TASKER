
import {
    GET_DASHBOARD_DATA,
    GET_DASHBOARD_DATA_SUCCESS,
    GET_DASHBOARD_DATA_FAIL,
} from "./actionTypes";

const INIT_STATE = {
    dashboardData: null,
    loading: false,
    error: null,
};

const dashboardReducer = (state = INIT_STATE, action: any) => {
    switch (action.type) {
        case GET_DASHBOARD_DATA:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_DASHBOARD_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                dashboardData: action.payload,
            };
        case GET_DASHBOARD_DATA_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default dashboardReducer;
