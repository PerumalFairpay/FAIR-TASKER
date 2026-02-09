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
  REGENERATE_NDA_REQUEST,
  REGENERATE_NDA_SUCCESS,
  REGENERATE_NDA_FAILURE,
  DELETE_NDA_REQUEST,
  DELETE_NDA_SUCCESS,
  DELETE_NDA_FAILURE,
  CLEAR_NDA_STATE,
} from "./actionType";

interface NDAState {
  ndaList: any[];
  currentNDA: any | null;
  generatedLink: string | null;

  // Action-specific states
  generateLoading: boolean;
  generateError: string | null;
  generateSuccess: string | null;

  getListLoading: boolean;
  getListError: string | null;

  getByTokenLoading: boolean;
  getByTokenError: string | null;

  uploadLoading: boolean;
  uploadError: string | null;
  uploadSuccess: string | null;

  signLoading: boolean;
  signError: string | null;
  signSuccess: string | null;

  regenerateLoading: boolean;
  regenerateError: string | null;
  regenerateSuccess: string | null;

  deleteLoading: boolean;
  deleteError: string | null;
  deleteSuccess: string | null;

  meta: {
    current_page: number;
    total_pages: number;
    total_items: number;
    limit: number;
  };
}

const initialNDAState: NDAState = {
  ndaList: [],
  currentNDA: null,
  generatedLink: null,

  generateLoading: false,
  generateError: null,
  generateSuccess: null,

  getListLoading: false,
  getListError: null,

  getByTokenLoading: false,
  getByTokenError: null,

  uploadLoading: false,
  uploadError: null,
  uploadSuccess: null,

  signLoading: false,
  signError: null,
  signSuccess: null,

  regenerateLoading: false,
  regenerateError: null,
  regenerateSuccess: null,

  deleteLoading: false,
  deleteError: null,
  deleteSuccess: null,

  meta: {
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    limit: 10,
  },
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
        generateLoading: true,
        generateError: null,
        generateSuccess: null,
        generatedLink: null,
      };
    case GENERATE_NDA_SUCCESS:
      return {
        ...state,
        generateLoading: false,
        generateSuccess:
          action.payload.message || "NDA link generated successfully",
        generatedLink: action.payload.data?.link || null,
        currentNDA: action.payload.data?.nda || null,
        ndaList: action.payload.data?.nda
          ? [action.payload.data.nda, ...state.ndaList]
          : state.ndaList,
      };
    case GENERATE_NDA_FAILURE:
      return {
        ...state,
        generateLoading: false,
        generateError: action.payload,
      };

    // Get NDA List
    case GET_NDA_LIST_REQUEST:
      return {
        ...state,
        getListLoading: true,
        getListError: null,
      };
    case GET_NDA_LIST_SUCCESS:
      return {
        ...state,
        getListLoading: false,
        ndaList: action.payload.data || [],
        meta: action.payload.meta || state.meta,
      };
    case GET_NDA_LIST_FAILURE:
      return {
        ...state,
        getListLoading: false,
        getListError: action.payload,
      };

    // Get NDA by Token
    case GET_NDA_BY_TOKEN_REQUEST:
      return {
        ...state,
        getByTokenLoading: true,
        getByTokenError: null,
        currentNDA: null,
      };
    case GET_NDA_BY_TOKEN_SUCCESS:
      return {
        ...state,
        getByTokenLoading: false,
        currentNDA: action.payload.data,
      };
    case GET_NDA_BY_TOKEN_FAILURE:
      return {
        ...state,
        getByTokenLoading: false,
        getByTokenError: action.payload,
      };

    // Upload Documents
    case UPLOAD_NDA_DOCUMENTS_REQUEST:
      return {
        ...state,
        uploadLoading: true,
        uploadError: null,
        uploadSuccess: null,
      };
    case UPLOAD_NDA_DOCUMENTS_SUCCESS:
      return {
        ...state,
        uploadLoading: false,
        uploadSuccess:
          action.payload.message || "Documents uploaded successfully",
        currentNDA: state.currentNDA?.html_content
          ? { ...state.currentNDA, nda: action.payload.data }
          : action.payload.data,
      };
    case UPLOAD_NDA_DOCUMENTS_FAILURE:
      return {
        ...state,
        uploadLoading: false,
        uploadError: action.payload,
      };

    // Sign NDA
    case SIGN_NDA_REQUEST:
      return {
        ...state,
        signLoading: true,
        signError: null,
        signSuccess: null,
      };
    case SIGN_NDA_SUCCESS:
      return {
        ...state,
        signLoading: false,
        signSuccess: action.payload.message || "NDA signed successfully",
        currentNDA: state.currentNDA?.html_content
          ? { ...state.currentNDA, nda: action.payload.data }
          : action.payload.data,
      };
    case SIGN_NDA_FAILURE:
      return {
        ...state,
        signLoading: false,
        signError: action.payload,
      };

    // Regenerate NDA
    case REGENERATE_NDA_REQUEST:
      return {
        ...state,
        regenerateLoading: true,
        regenerateError: null,
        regenerateSuccess: null,
      };
    case REGENERATE_NDA_SUCCESS:
      return {
        ...state,
        regenerateLoading: false,
        regenerateSuccess:
          action.payload.message || "NDA link regenerated successfully",
        ndaList: state.ndaList.map((item) =>
          item.id === action.payload.data?.nda?.id
            ? action.payload.data.nda
            : item,
        ),
      };
    case REGENERATE_NDA_FAILURE:
      return {
        ...state,
        regenerateLoading: false,
        regenerateError: action.payload,
      };

    // Delete NDA
    case DELETE_NDA_REQUEST:
      return {
        ...state,
        deleteLoading: true,
        deleteError: null,
        deleteSuccess: null,
      };
    case DELETE_NDA_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        deleteSuccess: "NDA request deleted successfully",
        ndaList: state.ndaList.filter((item) => item.id !== action.payload),
      };
    case DELETE_NDA_FAILURE:
      return {
        ...state,
        deleteLoading: false,
        deleteError: action.payload,
      };

    // Clear State
    case CLEAR_NDA_STATE:
      return {
        ...state,
        generateError: null,
        generateSuccess: null,
        getListError: null,
        getByTokenError: null,
        uploadError: null,
        uploadSuccess: null,
        signError: null,
        signSuccess: null,
        regenerateError: null,
        regenerateSuccess: null,
        deleteError: null,
        deleteSuccess: null,
        currentNDA: null,
        generatedLink: null,
      };

    default:
      return state;
  }
};

export default ndaReducer;
