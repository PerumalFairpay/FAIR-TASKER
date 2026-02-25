import {
  CREATE_DOCUMENT_REQUEST,
  CREATE_DOCUMENT_SUCCESS,
  CREATE_DOCUMENT_FAILURE,
  GET_DOCUMENTS_REQUEST,
  GET_DOCUMENTS_SUCCESS,
  GET_DOCUMENTS_FAILURE,
  GET_DOCUMENT_REQUEST,
  GET_DOCUMENT_SUCCESS,
  GET_DOCUMENT_FAILURE,
  UPDATE_DOCUMENT_REQUEST,
  UPDATE_DOCUMENT_SUCCESS,
  UPDATE_DOCUMENT_FAILURE,
  DELETE_DOCUMENT_REQUEST,
  DELETE_DOCUMENT_SUCCESS,
  DELETE_DOCUMENT_FAILURE,
  CLEAR_DOCUMENT_DETAILS,
} from "./actionType";

interface DocumentState {
  documents: any[];
  document: any | null;

  createDocumentLoading: boolean;
  createDocumentError: any;
  createDocumentSuccessMessage: string | null;

  getDocumentsLoading: boolean;
  getDocumentsError: any;
  getDocumentsSuccessMessage: string | null;

  getDocumentLoading: boolean;
  getDocumentError: any;
  getDocumentSuccessMessage: string | null;

  updateDocumentLoading: boolean;
  updateDocumentError: any;
  updateDocumentSuccessMessage: string | null;

  deleteDocumentLoading: boolean;
  deleteDocumentError: any;
  deleteDocumentSuccessMessage: string | null;
}

const initialState: DocumentState = {
  documents: [],
  document: null,

  createDocumentLoading: false,
  createDocumentError: null,
  createDocumentSuccessMessage: null,

  getDocumentsLoading: false,
  getDocumentsError: null,
  getDocumentsSuccessMessage: null,

  getDocumentLoading: false,
  getDocumentError: null,
  getDocumentSuccessMessage: null,

  updateDocumentLoading: false,
  updateDocumentError: null,
  updateDocumentSuccessMessage: null,

  deleteDocumentLoading: false,
  deleteDocumentError: null,
  deleteDocumentSuccessMessage: null,
};

const documentReducer = (state = initialState, action: any): DocumentState => {
  switch (action.type) {
    // --- Create ---
    case CREATE_DOCUMENT_REQUEST:
      return {
        ...state,
        createDocumentLoading: true,
        createDocumentError: null,
        createDocumentSuccessMessage: null,
      };
    case CREATE_DOCUMENT_SUCCESS:
      return {
        ...state,
        createDocumentLoading: false,
        createDocumentSuccessMessage:
          action.payload.message || "Document created successfully",
        documents: [...state.documents, action.payload.data],
      };
    case CREATE_DOCUMENT_FAILURE:
      return {
        ...state,
        createDocumentLoading: false,
        createDocumentError: action.payload,
      };

    // --- Get All ---
    case GET_DOCUMENTS_REQUEST:
      return {
        ...state,
        getDocumentsLoading: true,
        getDocumentsError: null,
        getDocumentsSuccessMessage: null,
      };
    case GET_DOCUMENTS_SUCCESS:
      return {
        ...state,
        getDocumentsLoading: false,
        documents: action.payload.data,
      };
    case GET_DOCUMENTS_FAILURE:
      return {
        ...state,
        getDocumentsLoading: false,
        getDocumentsError: action.payload,
      };

    // --- Get Single ---
    case GET_DOCUMENT_REQUEST:
      return {
        ...state,
        getDocumentLoading: true,
        getDocumentError: null,
        getDocumentSuccessMessage: null,
      };
    case GET_DOCUMENT_SUCCESS:
      return {
        ...state,
        getDocumentLoading: false,
        document: action.payload.data,
      };
    case GET_DOCUMENT_FAILURE:
      return {
        ...state,
        getDocumentLoading: false,
        getDocumentError: action.payload,
      };

    // --- Update ---
    case UPDATE_DOCUMENT_REQUEST:
      return {
        ...state,
        updateDocumentLoading: true,
        updateDocumentError: null,
        updateDocumentSuccessMessage: null,
      };
    case UPDATE_DOCUMENT_SUCCESS:
      return {
        ...state,
        updateDocumentLoading: false,
        updateDocumentSuccessMessage:
          action.payload.message || "Document updated successfully",
        documents: state.documents.map((doc: any) =>
          doc.id === action.payload.data.id ? action.payload.data : doc,
        ),
        document: action.payload.data,
      };
    case UPDATE_DOCUMENT_FAILURE:
      return {
        ...state,
        updateDocumentLoading: false,
        updateDocumentError: action.payload,
      };

    // --- Delete ---
    case DELETE_DOCUMENT_REQUEST:
      return {
        ...state,
        deleteDocumentLoading: true,
        deleteDocumentError: null,
        deleteDocumentSuccessMessage: null,
      };
    case DELETE_DOCUMENT_SUCCESS:
      return {
        ...state,
        deleteDocumentLoading: false,
        deleteDocumentSuccessMessage:
          action.payload.message || "Document deleted successfully",
        documents: state.documents.filter(
          (doc: any) => doc.id !== action.payload.id,
        ),
      };
    case DELETE_DOCUMENT_FAILURE:
      return {
        ...state,
        deleteDocumentLoading: false,
        deleteDocumentError: action.payload,
      };

    // --- Clear Details ---
    case CLEAR_DOCUMENT_DETAILS:
      return {
        ...state,
        document: null,

        createDocumentError: null,
        createDocumentSuccessMessage: null,

        getDocumentsError: null,
        getDocumentsSuccessMessage: null,

        getDocumentError: null,
        getDocumentSuccessMessage: null,

        updateDocumentError: null,
        updateDocumentSuccessMessage: null,

        deleteDocumentError: null,
        deleteDocumentSuccessMessage: null,
      };

    default:
      return state;
  }
};

export default documentReducer;
