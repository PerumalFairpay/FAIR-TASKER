import {
  CREATE_EXPENSE_REQUEST,
  CREATE_EXPENSE_SUCCESS,
  CREATE_EXPENSE_FAILURE,
  GET_EXPENSES_REQUEST,
  GET_EXPENSES_SUCCESS,
  GET_EXPENSES_FAILURE,
  GET_EXPENSE_REQUEST,
  GET_EXPENSE_SUCCESS,
  GET_EXPENSE_FAILURE,
  UPDATE_EXPENSE_REQUEST,
  UPDATE_EXPENSE_SUCCESS,
  UPDATE_EXPENSE_FAILURE,
  DELETE_EXPENSE_REQUEST,
  DELETE_EXPENSE_SUCCESS,
  DELETE_EXPENSE_FAILURE,
  CLEAR_EXPENSE_DETAILS,
} from "./actionType";

const initialState = {
  expenses: [],
  expense: null,

  // Create
  createExpenseLoading: false,
  createExpenseError: null,
  createExpenseSuccessMessage: null,

  // Get All
  getExpensesLoading: false,
  getExpensesError: null,
  getExpensesSuccessMessage: null,

  // Get Single
  getExpenseLoading: false,
  getExpenseError: null,
  getExpenseSuccessMessage: null,

  // Update
  updateExpenseLoading: false,
  updateExpenseError: null,
  updateExpenseSuccessMessage: null,

  // Delete
  deleteExpenseLoading: false,
  deleteExpenseError: null,
  deleteExpenseSuccessMessage: null,
};

const expenseReducer = (state = initialState, action: any) => {
  switch (action.type) {
    // CREATE
    case CREATE_EXPENSE_REQUEST:
      return {
        ...state,
        createExpenseLoading: true,
        createExpenseError: null,
        createExpenseSuccessMessage: null,
      };
    case CREATE_EXPENSE_SUCCESS:
        return {
            ...state,
        createExpenseLoading: false,
        createExpenseSuccessMessage: action.payload.message,
        expenses: [...state.expenses, action.payload.data],
    };
    case CREATE_EXPENSE_FAILURE: 
      return {
        ...state,
        createExpenseLoading: false,
        createExpenseError: action.payload,
        createExpenseSuccessMessage: null,
      };

    // GET ALL
    case GET_EXPENSES_REQUEST:
      return {
        ...state,
        getExpensesLoading: true,
        getExpensesError: null,
        getExpensesSuccessMessage: null,
      };
    case GET_EXPENSES_SUCCESS:
      return {
        ...state,
        getExpensesLoading: false,
        expenses: action.payload.data,
        getExpensesSuccessMessage: action.payload.message || null,
        getExpensesError: null,
      };
    case GET_EXPENSES_FAILURE:
      return {
        ...state,
        getExpensesLoading: false,
        getExpensesError: action.payload,
        getExpensesSuccessMessage: null,
      };

    // GET SINGLE
    case GET_EXPENSE_REQUEST:
      return {
        ...state,
        getExpenseLoading: true,
        getExpenseError: null,
        getExpenseSuccessMessage: null,
      };
    case GET_EXPENSE_SUCCESS:
      return {
        ...state,
        getExpenseLoading: false,
        expense: action.payload.data,
        getExpenseSuccessMessage: action.payload.message || null,
        getExpenseError: null,
      };
    case GET_EXPENSE_FAILURE:
      return {
        ...state,
        getExpenseLoading: false,
        getExpenseError: action.payload,
        getExpenseSuccessMessage: null,
      };

    // UPDATE
    case UPDATE_EXPENSE_REQUEST:
      return {
        ...state,
        updateExpenseLoading: true,
        updateExpenseError: null,
        updateExpenseSuccessMessage: null,
      };
    case UPDATE_EXPENSE_SUCCESS:
      return {
        ...state,
        updateExpenseLoading: false,
        updateExpenseSuccessMessage: action.payload.message,
        expenses: state.expenses.map((exp: any) =>
          exp.id === action.payload.data.id ? action.payload.data : exp,
        ),
        expense: action.payload.data,
      };
    case UPDATE_EXPENSE_FAILURE:
      return {
        ...state,
        updateExpenseLoading: false,
        updateExpenseError: action.payload,
        updateExpenseSuccessMessage: null,
      };

    // DELETE
    case DELETE_EXPENSE_REQUEST:
      return {
        ...state,
        deleteExpenseLoading: true,
        deleteExpenseError: null,
        deleteExpenseSuccessMessage: null,
      };
    case DELETE_EXPENSE_SUCCESS:
      return {
        ...state,
        deleteExpenseLoading: false,
        deleteExpenseSuccessMessage: action.payload.message,
        expenses: state.expenses.filter(
          (exp: any) => exp.id !== action.payload.id,
        ),
      };
    case DELETE_EXPENSE_FAILURE:
      return {
        ...state,
        deleteExpenseLoading: false,
        deleteExpenseError: action.payload,
        deleteExpenseSuccessMessage: null,
      };

    // CLEAR
    case CLEAR_EXPENSE_DETAILS:
      return {
        ...state,
        expense: null,
        createExpenseSuccessMessage: null,
        createExpenseError: null,
        getExpensesError: null,
        getExpensesSuccessMessage: null,
        getExpenseError: null,
        getExpenseSuccessMessage: null,
        updateExpenseSuccessMessage: null,
        updateExpenseError: null,
        deleteExpenseSuccessMessage: null,
        deleteExpenseError: null,
      };

    default:
      return state;
  }
};

export default expenseReducer;
