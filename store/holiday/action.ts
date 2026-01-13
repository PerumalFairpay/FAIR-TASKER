import {
    CREATE_HOLIDAY_REQUEST, CREATE_HOLIDAY_SUCCESS, CREATE_HOLIDAY_FAILURE,
    GET_HOLIDAYS_REQUEST, GET_HOLIDAYS_SUCCESS, GET_HOLIDAYS_FAILURE,
    GET_HOLIDAY_REQUEST, GET_HOLIDAY_SUCCESS, GET_HOLIDAY_FAILURE,
    UPDATE_HOLIDAY_REQUEST, UPDATE_HOLIDAY_SUCCESS, UPDATE_HOLIDAY_FAILURE,
    DELETE_HOLIDAY_REQUEST, DELETE_HOLIDAY_SUCCESS, DELETE_HOLIDAY_FAILURE,
    CLEAR_HOLIDAY_DETAILS
} from "./actionType";

// Create Holiday
export const createHolidayRequest = (payload: any) => ({
    type: CREATE_HOLIDAY_REQUEST,
    payload,
});
export const createHolidaySuccess = (payload: any) => ({
    type: CREATE_HOLIDAY_SUCCESS,
    payload,
});
export const createHolidayFailure = (payload: any) => ({
    type: CREATE_HOLIDAY_FAILURE,
    payload,
});

// Get All Holidays
export const getHolidaysRequest = () => ({
    type: GET_HOLIDAYS_REQUEST,
});
export const getHolidaysSuccess = (payload: any) => ({
    type: GET_HOLIDAYS_SUCCESS,
    payload,
});
export const getHolidaysFailure = (payload: any) => ({
    type: GET_HOLIDAYS_FAILURE,
    payload,
});

// Get Single Holiday
export const getHolidayRequest = (id: string) => ({
    type: GET_HOLIDAY_REQUEST,
    payload: id,
});
export const getHolidaySuccess = (payload: any) => ({
    type: GET_HOLIDAY_SUCCESS,
    payload,
});
export const getHolidayFailure = (payload: any) => ({
    type: GET_HOLIDAY_FAILURE,
    payload,
});

// Update Holiday
export const updateHolidayRequest = (id: string, payload: any) => ({
    type: UPDATE_HOLIDAY_REQUEST,
    payload: { id, payload },
});
export const updateHolidaySuccess = (payload: any) => ({
    type: UPDATE_HOLIDAY_SUCCESS,
    payload,
});
export const updateHolidayFailure = (payload: any) => ({
    type: UPDATE_HOLIDAY_FAILURE,
    payload,
});

// Delete Holiday
export const deleteHolidayRequest = (id: string) => ({
    type: DELETE_HOLIDAY_REQUEST,
    payload: id,
});
export const deleteHolidaySuccess = (payload: any) => ({
    type: DELETE_HOLIDAY_SUCCESS,
    payload,
});
export const deleteHolidayFailure = (payload: any) => ({
    type: DELETE_HOLIDAY_FAILURE,
    payload,
});

export const clearHolidayDetails = () => ({
    type: CLEAR_HOLIDAY_DETAILS,
});
