import {
  CLOCK_IN_REQUEST,
  CLOCK_IN_SUCCESS,
  CLOCK_IN_FAILURE,
  CLOCK_OUT_REQUEST,
  CLOCK_OUT_SUCCESS,
  CLOCK_OUT_FAILURE,
  GET_MY_ATTENDANCE_HISTORY_REQUEST,
  GET_MY_ATTENDANCE_HISTORY_SUCCESS,
  GET_MY_ATTENDANCE_HISTORY_FAILURE,
  GET_ALL_ATTENDANCE_REQUEST,
  GET_ALL_ATTENDANCE_SUCCESS,
  GET_ALL_ATTENDANCE_FAILURE,
  IMPORT_ATTENDANCE_REQUEST,
  IMPORT_ATTENDANCE_SUCCESS,
  IMPORT_ATTENDANCE_FAILURE,
  UPDATE_ATTENDANCE_STATUS_REQUEST,
  UPDATE_ATTENDANCE_STATUS_SUCCESS,
  UPDATE_ATTENDANCE_STATUS_FAILURE,
  CLEAR_ATTENDANCE_STATUS,
} from "./actionType";

interface AttendanceState {
  attendanceHistory: any[];
  allAttendance: any[];
  metrics: any | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  clockedIn: boolean; // Optional: track if currently clocked in based on last record
}

const initialAttendanceState: AttendanceState = {
  attendanceHistory: [],
  allAttendance: [],
  metrics: null,
  loading: false,
  error: null,
  success: null,
  clockedIn: false,
};

const attendanceReducer = (
  state: AttendanceState = initialAttendanceState,
  action: any,
): AttendanceState => {
  switch (action.type) {
    // Clock In
    case CLOCK_IN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: null,
      };
    case CLOCK_IN_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload.message || "Clocked in successfully",
        clockedIn: true,
        // Optimistically add to history if needed, or rely on refetch
        attendanceHistory: [action.payload.data, ...state.attendanceHistory],
      };
    case CLOCK_IN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Clock Out
    case CLOCK_OUT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: null,
      };
    case CLOCK_OUT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload.message || "Clocked out successfully",
        clockedIn: false,
        attendanceHistory: state.attendanceHistory.map((item) =>
          item.id === action.payload.data.id ? action.payload.data : item,
        ),
      };
    case CLOCK_OUT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // My History
    case GET_MY_ATTENDANCE_HISTORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_MY_ATTENDANCE_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        attendanceHistory: action.payload.data,
        metrics: action.payload.metrics,
      };
    case GET_MY_ATTENDANCE_HISTORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // All Attendance
    case GET_ALL_ATTENDANCE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_ALL_ATTENDANCE_SUCCESS:
      return {
        ...state,
        loading: false,
        allAttendance: action.payload.data,
        metrics: action.payload.metrics,
      };
    case GET_ALL_ATTENDANCE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Import Attendance
    case IMPORT_ATTENDANCE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: null,
      };
    case IMPORT_ATTENDANCE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload.message || "Attendance imported successfully",
      };
    case IMPORT_ATTENDANCE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Update Status
    case UPDATE_ATTENDANCE_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: null,
      };
    case UPDATE_ATTENDANCE_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        success:
          action.payload.message || "Attendance status updated successfully",
        // Update the record in both lists if it exists
        attendanceHistory: state.attendanceHistory.map((item) =>
          item.id === action.payload.data.id ? action.payload.data : item,
        ),
        allAttendance: state.allAttendance.map((item) =>
          item.id === action.payload.data.id ? action.payload.data : item,
        ),
      };
    case UPDATE_ATTENDANCE_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ATTENDANCE_STATUS:
      return {
        ...state,
        error: null,
        success: null,
      };

    default:
      return state;
  }
};

export default attendanceReducer;
