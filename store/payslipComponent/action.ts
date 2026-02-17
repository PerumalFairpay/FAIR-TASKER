import {
  CREATE_PAYSLIP_COMPONENT_REQUEST,
  CREATE_PAYSLIP_COMPONENT_SUCCESS,
  CREATE_PAYSLIP_COMPONENT_FAILURE,
  GET_PAYSLIP_COMPONENTS_REQUEST,
  GET_PAYSLIP_COMPONENTS_SUCCESS,
  GET_PAYSLIP_COMPONENTS_FAILURE,
  UPDATE_PAYSLIP_COMPONENT_REQUEST,
  UPDATE_PAYSLIP_COMPONENT_SUCCESS,
  UPDATE_PAYSLIP_COMPONENT_FAILURE,
  DELETE_PAYSLIP_COMPONENT_REQUEST,
  DELETE_PAYSLIP_COMPONENT_SUCCESS,
  DELETE_PAYSLIP_COMPONENT_FAILURE,
  CLEAR_PAYSLIP_COMPONENT_STATES,
} from "./actionType";

// Create
export const createPayslipComponentRequest = (data: any) => ({
  type: CREATE_PAYSLIP_COMPONENT_REQUEST,
  payload: data,
});

export const createPayslipComponentSuccess = (data: any) => ({
  type: CREATE_PAYSLIP_COMPONENT_SUCCESS,
  payload: data,
});

export const createPayslipComponentFailure = (error: any) => ({
  type: CREATE_PAYSLIP_COMPONENT_FAILURE,
  payload: error,
});

// Get All
export const getPayslipComponentsRequest = (params?: any) => ({
  type: GET_PAYSLIP_COMPONENTS_REQUEST,
  payload: params,
});

export const getPayslipComponentsSuccess = (data: any) => ({
  type: GET_PAYSLIP_COMPONENTS_SUCCESS,
  payload: data,
});

export const getPayslipComponentsFailure = (error: any) => ({
  type: GET_PAYSLIP_COMPONENTS_FAILURE,
  payload: error,
});

// Update
export const updatePayslipComponentRequest = (id: string, data: any) => ({
  type: UPDATE_PAYSLIP_COMPONENT_REQUEST,
  payload: { id, data },
});

export const updatePayslipComponentSuccess = (data: any) => ({
  type: UPDATE_PAYSLIP_COMPONENT_SUCCESS,
  payload: data,
});

export const updatePayslipComponentFailure = (error: any) => ({
  type: UPDATE_PAYSLIP_COMPONENT_FAILURE,
  payload: error,
});

// Delete
export const deletePayslipComponentRequest = (id: string) => ({
  type: DELETE_PAYSLIP_COMPONENT_REQUEST,
  payload: id,
});

export const deletePayslipComponentSuccess = (id: string) => ({
  type: DELETE_PAYSLIP_COMPONENT_SUCCESS,
  payload: id,
});

export const deletePayslipComponentFailure = (error: any) => ({
  type: DELETE_PAYSLIP_COMPONENT_FAILURE,
  payload: error,
});

// Clear
export const clearPayslipComponentStates = () => ({
  type: CLEAR_PAYSLIP_COMPONENT_STATES,
});
