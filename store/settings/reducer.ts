import {
  GET_SETTINGS_REQUEST,
  GET_SETTINGS_SUCCESS,
  GET_SETTINGS_FAILURE,
  UPDATE_SETTINGS_REQUEST,
  UPDATE_SETTINGS_SUCCESS,
  UPDATE_SETTINGS_FAILURE,
} from "./actionType";

interface SettingsState {
  settingsLoading: boolean;
  settingsError: string | null;
  settings: any | null; // Grouped object
  updateSettingsLoading: boolean;
  updateSettingsError: string | null;
  updateSettingsSuccess: boolean;
}

const initialSettingsState: SettingsState = {
  settingsLoading: false,
  settingsError: null,
  settings: null,
  updateSettingsLoading: false,
  updateSettingsError: null,
  updateSettingsSuccess: false,
};

const settingsReducer = (
  state: SettingsState = initialSettingsState,
  action: any,
): SettingsState => {
  switch (action.type) {
    // GET
    case GET_SETTINGS_REQUEST:
      return {
        ...state,
        settingsLoading: true,
        settingsError: null,
      };
    case GET_SETTINGS_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        settings: action.payload.data,
      };
    case GET_SETTINGS_FAILURE:
      return {
        ...state,
        settingsLoading: false,
        settingsError: action.payload,
      };

    // UPDATE
    case UPDATE_SETTINGS_REQUEST:
      return {
        ...state,
        updateSettingsLoading: true,
        updateSettingsError: null,
        updateSettingsSuccess: false,
      };
    case UPDATE_SETTINGS_SUCCESS:
      return {
        ...state,
        updateSettingsLoading: false,
        updateSettingsSuccess: true,
        settings: action.payload.data, // Update state with response
      };
    case UPDATE_SETTINGS_FAILURE:
      return {
        ...state,
        updateSettingsLoading: false,
        updateSettingsError: action.payload,
      };

    default:
      return state;
  }
};

export default settingsReducer;
