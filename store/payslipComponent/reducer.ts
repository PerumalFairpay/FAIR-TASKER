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

const initialState = {
  payslipComponents: [],
  payslipComponentsLoading: false,
  payslipComponentsError: null,

  createPayslipComponentLoading: false,
  createPayslipComponentSuccess: false,
  createPayslipComponentError: null,

  updatePayslipComponentLoading: false,
  updatePayslipComponentSuccess: false,
  updatePayslipComponentError: null,

  deletePayslipComponentLoading: false,
  deletePayslipComponentSuccess: false,
  deletePayslipComponentError: null,
};

const PayslipComponent = (state = initialState, action: any) => {
  switch (action.type) {
    // Create
    case CREATE_PAYSLIP_COMPONENT_REQUEST:
      return {
        ...state,
        createPayslipComponentLoading: true,
        createPayslipComponentSuccess: false,
        createPayslipComponentError: null,
      };
    case CREATE_PAYSLIP_COMPONENT_SUCCESS:
      return {
        ...state,
        createPayslipComponentLoading: false,
        createPayslipComponentSuccess: true,
        payslipComponents: [...state.payslipComponents, action.payload.data],
      };
    case CREATE_PAYSLIP_COMPONENT_FAILURE:
      return {
        ...state,
        createPayslipComponentLoading: false,
        createPayslipComponentError: action.payload,
      };

    // Get All
    case GET_PAYSLIP_COMPONENTS_REQUEST:
      return {
        ...state,
        payslipComponentsLoading: true,
        payslipComponentsError: null,
      };
    case GET_PAYSLIP_COMPONENTS_SUCCESS:
      return {
        ...state,
        payslipComponentsLoading: false,
        payslipComponents: action.payload.data,
      };
    case GET_PAYSLIP_COMPONENTS_FAILURE:
      return {
        ...state,
        payslipComponentsLoading: false,
        payslipComponentsError: action.payload,
      };

    // Update
    case UPDATE_PAYSLIP_COMPONENT_REQUEST:
      return {
        ...state,
        updatePayslipComponentLoading: true,
        updatePayslipComponentSuccess: false,
        updatePayslipComponentError: null,
      };
    case UPDATE_PAYSLIP_COMPONENT_SUCCESS:
      return {
        ...state,
        updatePayslipComponentLoading: false,
        updatePayslipComponentSuccess: true,
        payslipComponents: state.payslipComponents.map((item: any) =>
          item.id === action.payload.data.id ? action.payload.data : item,
        ),
      };
    case UPDATE_PAYSLIP_COMPONENT_FAILURE:
      return {
        ...state,
        updatePayslipComponentLoading: false,
        updatePayslipComponentError: action.payload,
      };

    // Delete
    case DELETE_PAYSLIP_COMPONENT_REQUEST:
      return {
        ...state,
        deletePayslipComponentLoading: true,
        deletePayslipComponentSuccess: false,
        deletePayslipComponentError: null,
      };
    case DELETE_PAYSLIP_COMPONENT_SUCCESS:
      return {
        ...state,
        deletePayslipComponentLoading: false,
        deletePayslipComponentSuccess: true,
        payslipComponents: state.payslipComponents.filter(
          (item: any) => item.id !== action.payload,
        ),
      };
    case DELETE_PAYSLIP_COMPONENT_FAILURE:
      return {
        ...state,
        deletePayslipComponentLoading: false,
        deletePayslipComponentError: action.payload,
      };

    // Reset
    case CLEAR_PAYSLIP_COMPONENT_STATES:
      return {
        ...state,
        createPayslipComponentSuccess: false,
        createPayslipComponentError: null,
        updatePayslipComponentSuccess: false,
        updatePayslipComponentError: null,
        deletePayslipComponentSuccess: false,
        deletePayslipComponentError: null,
      };

    default:
      return state;
  }
};

export default PayslipComponent;
