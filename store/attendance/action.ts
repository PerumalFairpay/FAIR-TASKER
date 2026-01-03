import {
    CLOCK_IN_REQUEST, CLOCK_IN_SUCCESS, CLOCK_IN_FAILURE,
    CLOCK_OUT_REQUEST, CLOCK_OUT_SUCCESS, CLOCK_OUT_FAILURE,
    GET_MY_ATTENDANCE_HISTORY_REQUEST, GET_MY_ATTENDANCE_HISTORY_SUCCESS, GET_MY_ATTENDANCE_HISTORY_FAILURE,
    GET_ALL_ATTENDANCE_REQUEST, GET_ALL_ATTENDANCE_SUCCESS, GET_ALL_ATTENDANCE_FAILURE,
    IMPORT_ATTENDANCE_REQUEST, IMPORT_ATTENDANCE_SUCCESS, IMPORT_ATTENDANCE_FAILURE,
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
export const getMyAttendanceHistoryRequest = (filters?: { start_date?: string, end_date?: string }) => ({
    type: GET_MY_ATTENDANCE_HISTORY_REQUEST,
    payload: filters,
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
export const getAllAttendanceRequest = (filters?: { date?: string, start_date?: string, end_date?: string, employee_id?: string, status?: string } | string) => ({
    type: GET_ALL_ATTENDANCE_REQUEST,
    payload: filters,
});
export const getAllAttendanceSuccess = (response: any) => ({
    type: GET_ALL_ATTENDANCE_SUCCESS,
    payload: response,
});
export const getAllAttendanceFailure = (error: any) => ({
    type: GET_ALL_ATTENDANCE_FAILURE,
    payload: error,
});

// Import Attendance
export const importAttendanceRequest = (payload: any) => ({
    type: IMPORT_ATTENDANCE_REQUEST,
    payload,
});
export const importAttendanceSuccess = (response: any) => ({
    type: IMPORT_ATTENDANCE_SUCCESS,
    payload: response,
});
export const importAttendanceFailure = (error: any) => ({
    type: IMPORT_ATTENDANCE_FAILURE,
    payload: error,
});

// Clear Status
export const clearAttendanceStatus = () => ({
    type: CLEAR_ATTENDANCE_STATUS,
});
