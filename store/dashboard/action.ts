
import {
    GET_DASHBOARD_DATA,
    GET_DASHBOARD_DATA_SUCCESS,
    GET_DASHBOARD_DATA_FAIL,
} from "./actionTypes";

export const getDashboardData = () => {
    return {
        type: GET_DASHBOARD_DATA,
    };
};

export const getDashboardDataSuccess = (data: any) => {
    return {
        type: GET_DASHBOARD_DATA_SUCCESS,
        payload: data,
    };
};

export const getDashboardDataFail = (error: any) => {
    return {
        type: GET_DASHBOARD_DATA_FAIL,
        payload: error,
    };
};
