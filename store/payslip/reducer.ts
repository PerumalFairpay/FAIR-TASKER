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
  error: null,

  generating: false,
  generateError: null,
  generateSuccess: null,

  updating: false,
  updateError: null,
  updateSuccess: null,

  downloading: false,
  downloadError: null,
  downloadSuccess: null,

  currentPayslip: null,
};

const payslipReducer = (state = initialState, action: any) => {
  switch (action.type) {
    // Generate
    case GENERATE_PAYSLIP_REQUEST:
      return {
        ...state,
        generating: true,
        generateError: null,
        generateSuccess: null,
      };
    case GENERATE_PAYSLIP_SUCCESS:
      return {
        ...state,
        generating: false,
        payslips: [action.payload.data, ...state.payslips],
        generateError: null,
        generateSuccess:
          action.payload.message || "Payslip generated successfully",
      };
    case GENERATE_PAYSLIP_FAILURE:
      return {
        ...state,
        generating: false,
        generateError: action.payload,
      };

    // Get List
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

    // Download
    case DOWNLOAD_PAYSLIP_REQUEST:
      return {
        ...state,
        downloading: true,
        downloadError: null,
        downloadSuccess: null,
      };
    case DOWNLOAD_PAYSLIP_SUCCESS:
      return {
        ...state,
        downloading: false,
        downloadError: null,
        downloadSuccess: action.payload.message || "Download initiated",
      };
    case DOWNLOAD_PAYSLIP_FAILURE:
      return {
        ...state,
        downloading: false,
        downloadError: action.payload,
      };

    // Update
    case UPDATE_PAYSLIP_REQUEST:
      return {
        ...state,
        updating: true,
        updateError: null,
        updateSuccess: null,
      };
    case UPDATE_PAYSLIP_SUCCESS:
      return {
        ...state,
        updating: false,
        payslips: state.payslips.map((item: any) =>
          item.id === action.payload.data.id ? action.payload.data : item,
        ),
        updateError: null,
        updateSuccess: action.payload.message || "Payslip updated successfully",
      };
    case UPDATE_PAYSLIP_FAILURE:
      return {
        ...state,
        updating: false,
        updateError: action.payload,
      };

    default:
      return state;
  }
};

export default payslipReducer;
