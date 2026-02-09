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

const initialState = {
  payslips: [],
  meta: {},
  loading: false,
  generating: false,
  error: null,
  currentPayslip: null,
};

const payslipReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case GENERATE_PAYSLIP_REQUEST:
      return {
        ...state,
        generating: true,
        error: null,
      };
    case GENERATE_PAYSLIP_SUCCESS:
      return {
        ...state,
        generating: false,
        payslips: [action.payload.data, ...state.payslips],
        error: null,
      };
    case GENERATE_PAYSLIP_FAILURE:
      return {
        ...state,
        generating: false,
        error: action.payload,
      };
    case GET_PAYSLIPS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_PAYSLIPS_SUCCESS:
      return {
        ...state,
        loading: false,
        payslips: action.payload.data,
        meta: action.payload.meta,
      };
    case GET_PAYSLIPS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DOWNLOAD_PAYSLIP_REQUEST:
      return {
        ...state,
        loading: true, // or specific downloading state
        error: null,
      };
    case DOWNLOAD_PAYSLIP_SUCCESS:
      return {
        ...state,
        loading: false,
        // Handle download externally usually?
      };
    case DOWNLOAD_PAYSLIP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_PAYSLIP_REQUEST:
      return {
        ...state,
        generating: true,
        error: null,
      };
    case UPDATE_PAYSLIP_SUCCESS:
      return {
        ...state,
        generating: false,
        payslips: state.payslips.map((item: any) =>
          item.id === action.payload.data.id ? action.payload.data : item,
        ),
        error: null,
      };
    case UPDATE_PAYSLIP_FAILURE:
      return {
        ...state,
        generating: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default payslipReducer;
