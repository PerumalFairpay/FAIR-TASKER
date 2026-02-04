import {
  GENERATE_NDA_REQUEST,
  GENERATE_NDA_SUCCESS,
  GENERATE_NDA_FAILURE,
  GET_NDA_LIST_REQUEST,
  GET_NDA_LIST_SUCCESS,
  GET_NDA_LIST_FAILURE,
  GET_NDA_BY_TOKEN_REQUEST,
  GET_NDA_BY_TOKEN_SUCCESS,
  GET_NDA_BY_TOKEN_FAILURE,
  UPLOAD_NDA_DOCUMENTS_REQUEST,
  UPLOAD_NDA_DOCUMENTS_SUCCESS,
  UPLOAD_NDA_DOCUMENTS_FAILURE,
  SIGN_NDA_REQUEST,
  SIGN_NDA_SUCCESS,
  SIGN_NDA_FAILURE,
  CLEAR_NDA_STATE,
} from "./actionType";

interface NDAState {
  ndaList: any[];
  currentNDA: any | null;
  generatedLink: string | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialNDAState: NDAState = {
  ndaList: [],
  currentNDA: null,
  generatedLink: null,
  loading: false,
  error: null,
  success: null,
};

const ndaReducer = (
  state: NDAState = initialNDAState,
  action: any,
): NDAState => {
  switch (action.type) {
    // Generate NDA
    case GENERATE_NDA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: null,
        generatedLink: null,
      };
    case GENERATE_NDA_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload.message || "NDA link generated successfully",
        generatedLink: action.payload.data?.link || null,
        currentNDA: action.payload.data?.nda || null,
        ndaList: action.payload.data?.nda
          ? [action.payload.data.nda, ...state.ndaList]
          : state.ndaList,
      };
    case GENERATE_NDA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get NDA List
    case GET_NDA_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_NDA_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        ndaList: action.payload.data || [],
      };
    case GET_NDA_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get NDA by Token
    case GET_NDA_BY_TOKEN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        currentNDA: null,
      };
    case GET_NDA_BY_TOKEN_SUCCESS:
      return {
        ...state,
        loading: false,
        currentNDA: action.payload.data,
      };
    case GET_NDA_BY_TOKEN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Upload Documents
    case UPLOAD_NDA_DOCUMENTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: null,
      };
    case UPLOAD_NDA_DOCUMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload.message || "Documents uploaded successfully",
        currentNDA: action.payload.data,
      };
    case UPLOAD_NDA_DOCUMENTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Sign NDA
    case SIGN_NDA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: null,
      };
    case SIGN_NDA_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload.message || "NDA signed successfully",
        currentNDA: action.payload.data,
      };
    case SIGN_NDA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Clear State
    case CLEAR_NDA_STATE:
      return {
        ...state,
        error: null,
        success: null,
        currentNDA: null,
        generatedLink: null,
      };

    default:
      return state;
  }
};

export default ndaReducer;
