import {
  CREATE_SHIFT_REQUEST,
  CREATE_SHIFT_SUCCESS,
  CREATE_SHIFT_FAILURE,
  GET_SHIFTS_REQUEST,
  GET_SHIFTS_SUCCESS,
  GET_SHIFTS_FAILURE,
  GET_SHIFT_REQUEST,
  GET_SHIFT_SUCCESS,
  GET_SHIFT_FAILURE,
  UPDATE_SHIFT_REQUEST,
  UPDATE_SHIFT_SUCCESS,
  UPDATE_SHIFT_FAILURE,
  DELETE_SHIFT_REQUEST,
  DELETE_SHIFT_SUCCESS,
  DELETE_SHIFT_FAILURE,
  CLEAR_SHIFT_DETAILS,
} from "./actionType";

interface ShiftState {
  shifts: any[];
  shift: any | null;

  // Create
  createLoading: boolean;
  createSuccess: string | null;
  createError: string | null;

  // List
  listLoading: boolean;
  listSuccess: string | null;
  listError: string | null;

  // Get Single
  getLoading: boolean;
  getSuccess: string | null;
  getError: string | null;

  // Update
  updateLoading: boolean;
  updateSuccess: string | null;
  updateError: string | null;

  // Delete
  deleteLoading: boolean;
  deleteSuccess: string | null;
  deleteError: string | null;
}

const initialShiftState: ShiftState = {
  shifts: [],
  shift: null,

  createLoading: false,
  createSuccess: null,
  createError: null,

  listLoading: false,
  listSuccess: null,
  listError: null,

  getLoading: false,
  getSuccess: null,
  getError: null,

  updateLoading: false,
  updateSuccess: null,
  updateError: null,

  deleteLoading: false,
  deleteSuccess: null,
  deleteError: null,
};

const shiftReducer = (
  state: ShiftState = initialShiftState,
  action: any,
): ShiftState => {
  switch (action.type) {
    // Create
    case CREATE_SHIFT_REQUEST:
      return {
        ...state,
        createLoading: true,
        createError: null,
        createSuccess: null,
      };
    case CREATE_SHIFT_SUCCESS:
      return {
        ...state,
        createLoading: false,
        createSuccess: action.payload.message || "Shift created successfully",
        shifts: [...state.shifts, action.payload.data],
      };
    case CREATE_SHIFT_FAILURE:
      return {
        ...state,
        createLoading: false,
        createError: action.payload,
      };

    // Get All
    case GET_SHIFTS_REQUEST:
      return {
        ...state,
        listLoading: true,
        listError: null,
      };
    case GET_SHIFTS_SUCCESS:
      return {
        ...state,
        listLoading: false,
        shifts: action.payload.data,
      };
    case GET_SHIFTS_FAILURE:
      return {
        ...state,
        listLoading: false,
        listError: action.payload,
      };

    // Get Single
    case GET_SHIFT_REQUEST:
      return {
        ...state,
        getLoading: true,
        getError: null,
        shift: null,
      };
    case GET_SHIFT_SUCCESS:
      return {
        ...state,
        getLoading: false,
        shift: action.payload.data,
      };
    case GET_SHIFT_FAILURE:
      return {
        ...state,
        getLoading: false,
        getError: action.payload,
      };

    // Update
    case UPDATE_SHIFT_REQUEST:
      return {
        ...state,
        updateLoading: true,
        updateError: null,
        updateSuccess: null,
      };
    case UPDATE_SHIFT_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        updateSuccess: action.payload.message || "Shift updated successfully",
        shifts: state.shifts.map((shift) =>
          shift.id === action.payload.data.id ? action.payload.data : shift,
        ),
        shift: action.payload.data,
      };
    case UPDATE_SHIFT_FAILURE:
      return {
        ...state,
        updateLoading: false,
        updateError: action.payload,
      };

    // Delete
    case DELETE_SHIFT_REQUEST:
      return {
        ...state,
        deleteLoading: true,
        deleteError: null,
        deleteSuccess: null,
      };
    case DELETE_SHIFT_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        deleteSuccess: action.payload.message || "Shift deleted successfully",
        shifts: state.shifts.filter((shift) => shift.id !== action.payload.id),
      };
    case DELETE_SHIFT_FAILURE:
      return {
        ...state,
        deleteLoading: false,
        deleteError: action.payload,
      };

    case CLEAR_SHIFT_DETAILS:
      return {
        ...state,
        createError: null,
        createSuccess: null,
        listError: null,
        listSuccess: null,
        getError: null,
        getSuccess: null,
        updateError: null,
        updateSuccess: null,
        deleteError: null,
        deleteSuccess: null,
        shift: null,
      };

    default:
      return state;
  }
};

export default shiftReducer;
