import {
  CREATE_SHIFT_REQUEST,
  CREATE_SHIFT_SUCCESS,
  CREATE_SHIFT_FAILURE,
  GET_SHIFTS_REQUEST,
  GET_SHIFTS_SUCCESS,
  GET_SHIFTS_FAILURE,
  GET_SHIFT_REQUEST,
  GET_SHIFT_SUCCESS,
  GET_SHIFT_FAILURE,
  UPDATE_SHIFT_REQUEST,
  UPDATE_SHIFT_SUCCESS,
  UPDATE_SHIFT_FAILURE,
  DELETE_SHIFT_REQUEST,
  DELETE_SHIFT_SUCCESS,
  DELETE_SHIFT_FAILURE,
  CLEAR_SHIFT_DETAILS,
} from "./actionType";

// Create Shift
export const createShiftRequest = (payload: any) => ({
  type: CREATE_SHIFT_REQUEST,
  payload,
});
export const createShiftSuccess = (payload: any) => ({
  type: CREATE_SHIFT_SUCCESS,
  payload,
});
export const createShiftFailure = (payload: any) => ({
  type: CREATE_SHIFT_FAILURE,
  payload,
});

// Get All Shifts
export const getShiftsRequest = () => ({
  type: GET_SHIFTS_REQUEST,
});
export const getShiftsSuccess = (payload: any) => ({
  type: GET_SHIFTS_SUCCESS,
  payload,
});
export const getShiftsFailure = (payload: any) => ({
  type: GET_SHIFTS_FAILURE,
  payload,
});

// Get Single Shift
export const getShiftRequest = (id: string) => ({
  type: GET_SHIFT_REQUEST,
  payload: id,
});
export const getShiftSuccess = (payload: any) => ({
  type: GET_SHIFT_SUCCESS,
  payload,
});
export const getShiftFailure = (payload: any) => ({
  type: GET_SHIFT_FAILURE,
  payload,
});

// Update Shift
export const updateShiftRequest = (id: string, payload: any) => ({
  type: UPDATE_SHIFT_REQUEST,
  payload: { id, payload },
});
export const updateShiftSuccess = (payload: any) => ({
  type: UPDATE_SHIFT_SUCCESS,
  payload,
});
export const updateShiftFailure = (payload: any) => ({
  type: UPDATE_SHIFT_FAILURE,
  payload,
});

// Delete Shift
export const deleteShiftRequest = (id: string) => ({
  type: DELETE_SHIFT_REQUEST,
  payload: id,
});
export const deleteShiftSuccess = (payload: any) => ({
  type: DELETE_SHIFT_SUCCESS,
  payload,
});
export const deleteShiftFailure = (payload: any) => ({
  type: DELETE_SHIFT_FAILURE,
  payload,
});

export const clearShiftDetails = () => ({
  type: CLEAR_SHIFT_DETAILS,
});
