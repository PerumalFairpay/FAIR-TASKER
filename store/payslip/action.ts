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
} from "./actionType";

export const generatePayslip = (data: any) => ({
  type: GENERATE_PAYSLIP_REQUEST,
  payload: data,
});

export const generatePayslipSuccess = (data: any) => ({
  type: GENERATE_PAYSLIP_SUCCESS,
  payload: data,
});

export const generatePayslipFailure = (error: any) => ({
  type: GENERATE_PAYSLIP_FAILURE,
  payload: error,
});

export const getPayslips = (query: any) => ({
  type: GET_PAYSLIPS_REQUEST,
  payload: query,
});

export const getPayslipsSuccess = (data: any) => ({
  type: GET_PAYSLIPS_SUCCESS,
  payload: data,
});

export const getPayslipsFailure = (error: any) => ({
  type: GET_PAYSLIPS_FAILURE,
  payload: error,
});

export const downloadPayslip = (id: string, password?: string) => ({
  type: DOWNLOAD_PAYSLIP_REQUEST,
  payload: { id, password },
});

export const downloadPayslipSuccess = (data: any) => ({
  type: DOWNLOAD_PAYSLIP_SUCCESS,
  payload: data,
});

export const downloadPayslipFailure = (error: any) => ({
  type: DOWNLOAD_PAYSLIP_FAILURE,
  payload: error,
});
