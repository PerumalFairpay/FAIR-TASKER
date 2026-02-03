import {
  CREATE_NDA_REQUEST,
  CREATE_NDA_SUCCESS,
  CREATE_NDA_FAILURE,
  GET_NDA_REQUEST,
  GET_NDA_SUCCESS,
  GET_NDA_FAILURE,
  SIGN_NDA_REQUEST,
  SIGN_NDA_SUCCESS,
  SIGN_NDA_FAILURE,
  CLEAR_NDA,
} from "./actionType";

interface NdaState {
  createNdaLoading: boolean;
  getNdaLoading: boolean;
  signNdaLoading: boolean;

  createNdaError: string | null;
  getNdaError: string | null;
  signNdaError: string | null;

  createNdaSuccess: string | null;
  getNdaSuccess: string | null;
  signNdaSuccess: string | null;

  ndaData: any | null;
  ndaToken: string | null;
}

const initialNdaState: NdaState = {
  createNdaLoading: false,
  getNdaLoading: false,
  signNdaLoading: false,

  createNdaError: null,
  getNdaError: null,
  signNdaError: null,

  createNdaSuccess: null,
  getNdaSuccess: null,
  signNdaSuccess: null,

  ndaData: null,
  ndaToken: null,
};

const ndaReducer = (
  state: NdaState = initialNdaState,
  action: any,
): NdaState => {
  switch (action.type) {
    // Create NDA
    case CREATE_NDA_REQUEST:
      return {
        ...state,
        createNdaLoading: true,
        createNdaError: null,
        createNdaSuccess: null,
      };
    case CREATE_NDA_SUCCESS:
      return {
        ...state,
        createNdaLoading: false,
        createNdaSuccess: action.payload.message || "NDA created successfully",
        ndaToken: action.payload.token,
      };
    case CREATE_NDA_FAILURE:
      return {
        ...state,
        createNdaLoading: false,
        createNdaError: action.payload,
      };

    // Get NDA
    case GET_NDA_REQUEST:
      return {
        ...state,
        getNdaLoading: true,
        getNdaError: null,
        getNdaSuccess: null,
      };
    case GET_NDA_SUCCESS:
      return {
        ...state,
        getNdaLoading: false,
        getNdaSuccess: "NDA loaded successfully",
        ndaData: action.payload,
      };
    case GET_NDA_FAILURE:
      return {
        ...state,
        getNdaLoading: false,
        getNdaError: action.payload,
      };

    // Sign NDA
    case SIGN_NDA_REQUEST:
      return {
        ...state,
        signNdaLoading: true,
        signNdaError: null,
        signNdaSuccess: null,
      };
    case SIGN_NDA_SUCCESS:
      return {
        ...state,
        signNdaLoading: false,
        signNdaSuccess: action.payload.message || "NDA signed successfully",
      };
    case SIGN_NDA_FAILURE:
      return {
        ...state,
        signNdaLoading: false,
        signNdaError: action.payload,
      };

    case CLEAR_NDA:
      return {
        ...state,
        createNdaError: null,
        getNdaError: null,
        signNdaError: null,
        createNdaSuccess: null,
        getNdaSuccess: null,
        signNdaSuccess: null,
      };

    default:
      return state;
  }
};

export default ndaReducer;
