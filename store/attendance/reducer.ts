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
  CLEAR_ATTENDANCE_STATUS,
} from "./actionType";

interface AttendanceState {
  attendanceHistory: any[];
  allAttendance: any[];
  metrics: any | null;
  pagination: {
    total_records: number;
    current_page: number;
    limit: number;
    total_pages: number;
  } | null;
  clockedIn: boolean;

  clockInLoading: boolean;
  clockInSuccess: boolean;
  clockInError: string | null;

  clockOutLoading: boolean;
  clockOutSuccess: boolean;
  clockOutError: string | null;

  getMyHistoryLoading: boolean;
  getMyHistorySuccess: boolean;
  getMyHistoryError: string | null;

  getAllAttendanceLoading: boolean;
  getAllAttendanceSuccess: boolean;
  getAllAttendanceError: string | null;

  importAttendanceLoading: boolean;
  importAttendanceSuccess: boolean;
  importAttendanceError: string | null;
}

const initialAttendanceState: AttendanceState = {
  attendanceHistory: [],
  allAttendance: [],
  metrics: null,
  pagination: null,
  clockedIn: false,

  clockInLoading: false,
  clockInSuccess: false,
  clockInError: null,

  clockOutLoading: false,
  clockOutSuccess: false,
  clockOutError: null,

  getMyHistoryLoading: false,
  getMyHistorySuccess: false,
  getMyHistoryError: null,

  getAllAttendanceLoading: false,
  getAllAttendanceSuccess: false,
  getAllAttendanceError: null,

  importAttendanceLoading: false,
  importAttendanceSuccess: false,
  importAttendanceError: null,
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
        clockInLoading: true,
        clockInSuccess: false,
        clockInError: null,
      };
    case CLOCK_IN_SUCCESS:
      return {
        ...state,
        clockInLoading: false,
        clockInSuccess: true,
        clockedIn: true,
        attendanceHistory: [action.payload.data, ...state.attendanceHistory],
      };
    case CLOCK_IN_FAILURE:
      return {
        ...state,
        clockInLoading: false,
        clockInError: action.payload,
        clockInSuccess: false,
      };

    // Clock Out
    case CLOCK_OUT_REQUEST:
      return {
        ...state,
        clockOutLoading: true,
        clockOutSuccess: false,
        clockOutError: null,
      };
    case CLOCK_OUT_SUCCESS:
      return {
        ...state,
        clockOutLoading: false,
        clockOutSuccess: true,
        clockedIn: false,
        attendanceHistory: state.attendanceHistory.map((item) =>
          item.id === action.payload.data.id ? action.payload.data : item,
        ),
      };
    case CLOCK_OUT_FAILURE:
      return {
        ...state,
        clockOutLoading: false,
        clockOutError: action.payload,
        clockOutSuccess: false,
      };

    // My History
    case GET_MY_ATTENDANCE_HISTORY_REQUEST:
      return {
        ...state,
        getMyHistoryLoading: true,
        getMyHistorySuccess: false,
        getMyHistoryError: null,
      };
    case GET_MY_ATTENDANCE_HISTORY_SUCCESS:
      return {
        ...state,
        getMyHistoryLoading: false,
        getMyHistorySuccess: true,
        attendanceHistory: action.payload.data,
        metrics: action.payload.metrics,
      };
    case GET_MY_ATTENDANCE_HISTORY_FAILURE:
      return {
        ...state,
        getMyHistoryLoading: false,
        getMyHistoryError: action.payload,
        getMyHistorySuccess: false,
      };

    // All Attendance
    case GET_ALL_ATTENDANCE_REQUEST:
      return {
        ...state,
        getAllAttendanceLoading: true,
        getAllAttendanceSuccess: false,
        getAllAttendanceError: null,
      };
    case GET_ALL_ATTENDANCE_SUCCESS:
      return {
        ...state,
        getAllAttendanceLoading: false,
        getAllAttendanceSuccess: true,
        allAttendance: action.payload.data,
        metrics: action.payload.metrics,
        pagination: action.payload.pagination,
      };
    case GET_ALL_ATTENDANCE_FAILURE:
      return {
        ...state,
        getAllAttendanceLoading: false,
        getAllAttendanceError: action.payload,
        getAllAttendanceSuccess: false,
      };

    // Import Attendance
    case IMPORT_ATTENDANCE_REQUEST:
      return {
        ...state,
        importAttendanceLoading: true,
        importAttendanceSuccess: false,
        importAttendanceError: null,
      };
    case IMPORT_ATTENDANCE_SUCCESS:
      return {
        ...state,
        importAttendanceLoading: false,
        importAttendanceSuccess: true,
      };
    case IMPORT_ATTENDANCE_FAILURE:
      return {
        ...state,
        importAttendanceLoading: false,
        importAttendanceError: action.payload,
        importAttendanceSuccess: false,
      };

    case CLEAR_ATTENDANCE_STATUS:
      return {
        ...state,
        clockInError: null,
        clockInSuccess: false,
        clockOutError: null,
        clockOutSuccess: false,
        importAttendanceError: null,
        importAttendanceSuccess: false,
      };

    default:
      return state;
  }
};

export default attendanceReducer;
