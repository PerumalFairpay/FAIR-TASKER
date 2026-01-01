import {
    CLOCK_IN_REQUEST, CLOCK_IN_SUCCESS, CLOCK_IN_FAILURE,
    CLOCK_OUT_REQUEST, CLOCK_OUT_SUCCESS, CLOCK_OUT_FAILURE,
    GET_MY_ATTENDANCE_HISTORY_REQUEST, GET_MY_ATTENDANCE_HISTORY_SUCCESS, GET_MY_ATTENDANCE_HISTORY_FAILURE,
    GET_ALL_ATTENDANCE_REQUEST, GET_ALL_ATTENDANCE_SUCCESS, GET_ALL_ATTENDANCE_FAILURE,
    CLEAR_ATTENDANCE_STATUS
} from "./actionType";

// Clock In
export const clockInRequest = (payload: any) => ({
    type: CLOCK_IN_REQUEST,
    payload,
});
export const clockInSuccess = (response: any) => ({
    type: CLOCK_IN_SUCCESS,
    payload: response,
});
export const clockInFailure = (error: any) => ({
    type: CLOCK_IN_FAILURE,
    payload: error,
});

// Clock Out
export const clockOutRequest = (payload: any) => ({
    type: CLOCK_OUT_REQUEST,
    payload,
});
export const clockOutSuccess = (response: any) => ({
    type: CLOCK_OUT_SUCCESS,
    payload: response,
});
export const clockOutFailure = (error: any) => ({
    type: CLOCK_OUT_FAILURE,
    payload: error,
});

// Get My History
export const getMyAttendanceHistoryRequest = () => ({
    type: GET_MY_ATTENDANCE_HISTORY_REQUEST,
});
export const getMyAttendanceHistorySuccess = (response: any) => ({
    type: GET_MY_ATTENDANCE_HISTORY_SUCCESS,
    payload: response,
});
export const getMyAttendanceHistoryFailure = (error: any) => ({
    type: GET_MY_ATTENDANCE_HISTORY_FAILURE,
    payload: error,
});

// Get All Attendance (Admin)
export const getAllAttendanceRequest = (date?: string) => ({
    type: GET_ALL_ATTENDANCE_REQUEST,
    payload: date,
});
export const getAllAttendanceSuccess = (response: any) => ({
    type: GET_ALL_ATTENDANCE_SUCCESS,
    payload: response,
});
export const getAllAttendanceFailure = (error: any) => ({
    type: GET_ALL_ATTENDANCE_FAILURE,
    payload: error,
});

// Clear Status
export const clearAttendanceStatus = () => ({
    type: CLEAR_ATTENDANCE_STATUS,
});
