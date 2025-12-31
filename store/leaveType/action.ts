import {
    CREATE_LEAVE_TYPE_REQUEST, CREATE_LEAVE_TYPE_SUCCESS, CREATE_LEAVE_TYPE_FAILURE,
    GET_LEAVE_TYPES_REQUEST, GET_LEAVE_TYPES_SUCCESS, GET_LEAVE_TYPES_FAILURE,
    GET_LEAVE_TYPE_REQUEST, GET_LEAVE_TYPE_SUCCESS, GET_LEAVE_TYPE_FAILURE,
    UPDATE_LEAVE_TYPE_REQUEST, UPDATE_LEAVE_TYPE_SUCCESS, UPDATE_LEAVE_TYPE_FAILURE,
    DELETE_LEAVE_TYPE_REQUEST, DELETE_LEAVE_TYPE_SUCCESS, DELETE_LEAVE_TYPE_FAILURE,
    CLEAR_LEAVE_TYPE_DETAILS
} from "./actionType";

// Create Leave Type
export const createLeaveTypeRequest = (payload: any) => ({
    type: CREATE_LEAVE_TYPE_REQUEST,
    payload,
});
export const createLeaveTypeSuccess = (payload: any) => ({
    type: CREATE_LEAVE_TYPE_SUCCESS,
    payload,
});
export const createLeaveTypeFailure = (payload: any) => ({
    type: CREATE_LEAVE_TYPE_FAILURE,
    payload,
});

// Get All Leave Types
export const getLeaveTypesRequest = () => ({
    type: GET_LEAVE_TYPES_REQUEST,
});
export const getLeaveTypesSuccess = (payload: any) => ({
    type: GET_LEAVE_TYPES_SUCCESS,
    payload,
});
export const getLeaveTypesFailure = (payload: any) => ({
    type: GET_LEAVE_TYPES_FAILURE,
    payload,
});

// Get Single Leave Type
export const getLeaveTypeRequest = (id: string) => ({
    type: GET_LEAVE_TYPE_REQUEST,
    payload: id,
});
export const getLeaveTypeSuccess = (payload: any) => ({
    type: GET_LEAVE_TYPE_SUCCESS,
    payload,
});
export const getLeaveTypeFailure = (payload: any) => ({
    type: GET_LEAVE_TYPE_FAILURE,
    payload,
});

// Update Leave Type
export const updateLeaveTypeRequest = (id: string, payload: any) => ({
    type: UPDATE_LEAVE_TYPE_REQUEST,
    payload: { id, payload },
});
export const updateLeaveTypeSuccess = (payload: any) => ({
    type: UPDATE_LEAVE_TYPE_SUCCESS,
    payload,
});
export const updateLeaveTypeFailure = (payload: any) => ({
    type: UPDATE_LEAVE_TYPE_FAILURE,
    payload,
});

// Delete Leave Type
export const deleteLeaveTypeRequest = (id: string) => ({
    type: DELETE_LEAVE_TYPE_REQUEST,
    payload: id,
});
export const deleteLeaveTypeSuccess = (payload: any) => ({
    type: DELETE_LEAVE_TYPE_SUCCESS,
    payload,
});
export const deleteLeaveTypeFailure = (payload: any) => ({
    type: DELETE_LEAVE_TYPE_FAILURE,
    payload,
});

export const clearLeaveTypeDetails = () => ({
    type: CLEAR_LEAVE_TYPE_DETAILS,
});
