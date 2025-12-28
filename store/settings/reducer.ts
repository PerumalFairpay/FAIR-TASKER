import {
    GET_SETTINGS_REQUEST, GET_SETTINGS_SUCCESS, GET_SETTINGS_FAILURE
} from "./actionType";

interface SettingsState {
    settingsLoading: boolean;
    settingsError: string | null;
    settings: any[] | null;
}

const initialSettingsState: SettingsState = {
    settingsLoading: false,
    settingsError: null,
    settings: null,
};

const settingsReducer = (state: SettingsState = initialSettingsState, action: any): SettingsState => {
    switch (action.type) {
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
        default:
            return state;
    }
};

export default settingsReducer;
