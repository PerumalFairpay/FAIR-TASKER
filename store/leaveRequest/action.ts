import {
    CREATE_LEAVE_REQUEST_REQUEST, CREATE_LEAVE_REQUEST_SUCCESS, CREATE_LEAVE_REQUEST_FAILURE,
    GET_LEAVE_REQUESTS_REQUEST, GET_LEAVE_REQUESTS_SUCCESS, GET_LEAVE_REQUESTS_FAILURE,
    GET_LEAVE_REQUEST_REQUEST, GET_LEAVE_REQUEST_SUCCESS, GET_LEAVE_REQUEST_FAILURE,
    UPDATE_LEAVE_REQUEST_REQUEST, UPDATE_LEAVE_REQUEST_SUCCESS, UPDATE_LEAVE_REQUEST_FAILURE,
    UPDATE_LEAVE_STATUS_REQUEST, UPDATE_LEAVE_STATUS_SUCCESS, UPDATE_LEAVE_STATUS_FAILURE,
    DELETE_LEAVE_REQUEST_REQUEST, DELETE_LEAVE_REQUEST_SUCCESS, DELETE_LEAVE_REQUEST_FAILURE,
    CLEAR_LEAVE_REQUEST_DETAILS
} from "./actionType";

// Create Leave Request
export const createLeaveRequestRequest = (payload: FormData) => ({
    type: CREATE_LEAVE_REQUEST_REQUEST,
    payload,
});
export const createLeaveRequestSuccess = (payload: any) => ({
    type: CREATE_LEAVE_REQUEST_SUCCESS,
    payload,
});
export const createLeaveRequestFailure = (payload: any) => ({
    type: CREATE_LEAVE_REQUEST_FAILURE,
    payload,
});

// Get All Leave Requests
export const getLeaveRequestsRequest = (employee_id?: string) => ({
    type: GET_LEAVE_REQUESTS_REQUEST,
    payload: employee_id,
});
export const getLeaveRequestsSuccess = (payload: any) => ({
    type: GET_LEAVE_REQUESTS_SUCCESS,
    payload,
});
export const getLeaveRequestsFailure = (payload: any) => ({
    type: GET_LEAVE_REQUESTS_FAILURE,
    payload,
});

// Get Single Leave Request
export const getLeaveRequestRequest = (id: string) => ({
    type: GET_LEAVE_REQUEST_REQUEST,
    payload: id,
});
export const getLeaveRequestSuccess = (payload: any) => ({
    type: GET_LEAVE_REQUEST_SUCCESS,
    payload,
});
export const getLeaveRequestFailure = (payload: any) => ({
    type: GET_LEAVE_REQUEST_FAILURE,
    payload,
});

// Update Leave Request
export const updateLeaveRequestRequest = (id: string, payload: FormData) => ({
    type: UPDATE_LEAVE_REQUEST_REQUEST,
    payload: { id, payload },
});
export const updateLeaveRequestSuccess = (payload: any) => ({
    type: UPDATE_LEAVE_REQUEST_SUCCESS,
    payload,
});
export const updateLeaveRequestFailure = (payload: any) => ({
    type: UPDATE_LEAVE_REQUEST_FAILURE,
    payload,
});

// Update Leave Status
export const updateLeaveStatusRequest = (id: string, status: string) => ({
    type: UPDATE_LEAVE_STATUS_REQUEST,
    payload: { id, status },
});
export const updateLeaveStatusSuccess = (payload: any) => ({
    type: UPDATE_LEAVE_STATUS_SUCCESS,
    payload,
});
export const updateLeaveStatusFailure = (payload: any) => ({
    type: UPDATE_LEAVE_STATUS_FAILURE,
    payload,
});

// Delete Leave Request
export const deleteLeaveRequestRequest = (id: string) => ({
    type: DELETE_LEAVE_REQUEST_REQUEST,
    payload: id,
});
export const deleteLeaveRequestSuccess = (payload: any) => ({
    type: DELETE_LEAVE_REQUEST_SUCCESS,
    payload,
});
export const deleteLeaveRequestFailure = (payload: any) => ({
    type: DELETE_LEAVE_REQUEST_FAILURE,
    payload,
});

export const clearLeaveRequestDetails = () => ({
    type: CLEAR_LEAVE_REQUEST_DETAILS,
});
