import {
  GENERATE_PAYSLIP_REQUEST,
  GENERATE_PAYSLIP_SUCCESS,
  GENERATE_PAYSLIP_FAILURE,
  GET_PAYSLIPS_REQUEST,
  GET_PAYSLIPS_SUCCESS,
  GET_PAYSLIPS_FAILURE,
  GET_LATEST_PAYSLIP_REQUEST,
  GET_LATEST_PAYSLIP_SUCCESS,
  GET_LATEST_PAYSLIP_FAILURE,
  DOWNLOAD_PAYSLIP_REQUEST,
  DOWNLOAD_PAYSLIP_SUCCESS,
  DOWNLOAD_PAYSLIP_FAILURE,
  UPDATE_PAYSLIP_REQUEST,
  UPDATE_PAYSLIP_SUCCESS,
  UPDATE_PAYSLIP_FAILURE,
  CREATE_PAYSLIP_STATES,
} from "./actionType";

const initialState = {
  payslips: [],
  meta: {},
  payslipListLoading: false,
  payslipListError: null,

  payslipGenerateLoading: false,
  payslipGenerateError: null,
  payslipGenerateSuccess: null,

  payslipUpdateLoading: false,
  payslipUpdateError: null,
  payslipUpdateSuccess: null,

  payslipDownloadLoading: false,
  payslipDownloadError: null,
  payslipDownloadSuccess: null,

  latestPayslip: null,
  latestPayslipLoading: false,
  latestPayslipError: null,

  currentPayslip: null,
};

const payslipReducer = (state = initialState, action: any) => {
  switch (action.type) {
    // Generate
    case GENERATE_PAYSLIP_REQUEST:
      return {
        ...state,
        payslipGenerateLoading: true,
        payslipGenerateError: null,
        payslipGenerateSuccess: null,
      };
    case GENERATE_PAYSLIP_SUCCESS:
      return {
        ...state,
        payslipGenerateLoading: false,
        payslips: [action.payload.data, ...state.payslips],
        payslipGenerateError: null,
        payslipGenerateSuccess:
          action.payload.message || "Payslip generated successfully",
      };
    case GENERATE_PAYSLIP_FAILURE:
      return {
        ...state,
        payslipGenerateLoading: false,
        payslipGenerateError: action.payload,
      };

    // Get Latest Payslip
    case GET_LATEST_PAYSLIP_REQUEST:
      return {
        ...state,
        latestPayslipLoading: true,
        latestPayslipError: null,
        latestPayslip: null,
      };
    case GET_LATEST_PAYSLIP_SUCCESS:
      return {
        ...state,
        latestPayslipLoading: false,
        latestPayslip: action.payload,
      };
    case GET_LATEST_PAYSLIP_FAILURE:
      return {
        ...state,
        latestPayslipLoading: false,
        latestPayslipError: action.payload,
        latestPayslip: null,
      };

    // Get List
    case GET_PAYSLIPS_REQUEST:
      return {
        ...state,
        payslipListLoading: true,
        payslipListError: null,
      };
    case GET_PAYSLIPS_SUCCESS:
      return {
        ...state,
        payslipListLoading: false,
        payslips: action.payload.data,
        meta: action.payload.meta,
      };
    case GET_PAYSLIPS_FAILURE:
      return {
        ...state,
        payslipListLoading: false,
        payslipListError: action.payload,
      };

    // Download
    case DOWNLOAD_PAYSLIP_REQUEST:
      return {
        ...state,
        payslipDownloadLoading: true,
        payslipDownloadError: null,
        payslipDownloadSuccess: null,
      };
    case DOWNLOAD_PAYSLIP_SUCCESS:
      return {
        ...state,
        payslipDownloadLoading: false,
        payslipDownloadError: null,
        payslipDownloadSuccess: action.payload.message || "Download initiated",
      };
    case DOWNLOAD_PAYSLIP_FAILURE:
      return {
        ...state,
        payslipDownloadLoading: false,
        payslipDownloadError: action.payload,
      };

    // Update
    case UPDATE_PAYSLIP_REQUEST:
      return {
        ...state,
        payslipUpdateLoading: true,
        payslipUpdateError: null,
        payslipUpdateSuccess: null,
      };
    case UPDATE_PAYSLIP_SUCCESS:
      return {
        ...state,
        payslipUpdateLoading: false,
        payslips: state.payslips.map((item: any) =>
          item.id === action.payload.data.id ? action.payload.data : item,
        ),
        payslipUpdateError: null,
        payslipUpdateSuccess:
          action.payload.message || "Payslip updated successfully",
      };
    case UPDATE_PAYSLIP_FAILURE:
      return {
        ...state,
        payslipUpdateLoading: false,
        payslipUpdateError: action.payload,
      };

    case CREATE_PAYSLIP_STATES:
      return {
        ...state,
        payslipGenerateLoading: false,
        payslipGenerateSuccess: null,
        payslipGenerateError: null,
        payslipUpdateLoading: false,
        payslipUpdateSuccess: null,
        payslipUpdateError: null,
        payslipDownloadLoading: false,
        payslipDownloadSuccess: null,
        payslipDownloadError: null,
      };

    default:
      return state;
  }
};

export default payslipReducer;
