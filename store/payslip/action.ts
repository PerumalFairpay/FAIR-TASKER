import {
  GENERATE_PAYSLIP_REQUEST,
  GENERATE_PAYSLIP_SUCCESS,
  GENERATE_PAYSLIP_FAILURE,
  GET_PAYSLIPS_REQUEST,
  GET_PAYSLIPS_SUCCESS,
  GET_PAYSLIPS_FAILURE,
  DOWNLOAD_PAYSLIP_REQUEST,
  DOWNLOAD_PAYSLIP_SUCCESS,
  DOWNLOAD_PAYSLIP_FAILURE,
  UPDATE_PAYSLIP_REQUEST,
  UPDATE_PAYSLIP_SUCCESS,
  UPDATE_PAYSLIP_FAILURE,
} from "./actionType";

export const generatePayslipRequest = (payload: any) => ({
  type: GENERATE_PAYSLIP_REQUEST,
  payload,
});

export const generatePayslipSuccess = (response: any) => ({
  type: GENERATE_PAYSLIP_SUCCESS,
  payload: response,
});

export const generatePayslipFailure = (error: any) => ({
  type: GENERATE_PAYSLIP_FAILURE,
  payload: error,
});

export const getPayslipsRequest = (payload: any) => ({
  type: GET_PAYSLIPS_REQUEST,
  payload,
});

export const getPayslipsSuccess = (response: any) => ({
  type: GET_PAYSLIPS_SUCCESS,
  payload: response,
});

export const getPayslipsFailure = (error: any) => ({
  type: GET_PAYSLIPS_FAILURE,
  payload: error,
});

export const downloadPayslipRequest = (id: string, password?: string) => ({
  type: DOWNLOAD_PAYSLIP_REQUEST,
  payload: { id, password },
});

export const downloadPayslipSuccess = (response: any) => ({
  type: DOWNLOAD_PAYSLIP_SUCCESS,
  payload: response,
});

export const downloadPayslipFailure = (error: any) => ({
  type: DOWNLOAD_PAYSLIP_FAILURE,
  payload: error,
});

export const updatePayslipRequest = (id: string, data: any) => ({
  type: UPDATE_PAYSLIP_REQUEST,
  payload: { id, data },
});

export const updatePayslipSuccess = (response: any) => ({
  type: UPDATE_PAYSLIP_SUCCESS,
  payload: response,
});

export const updatePayslipFailure = (error: any) => ({
  type: UPDATE_PAYSLIP_FAILURE,
  payload: error,
});
