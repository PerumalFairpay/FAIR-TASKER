import {
    CREATE_ASSET_REQUEST, CREATE_ASSET_SUCCESS, CREATE_ASSET_FAILURE,
    GET_ASSETS_REQUEST, GET_ASSETS_SUCCESS, GET_ASSETS_FAILURE,
    GET_ASSET_REQUEST, GET_ASSET_SUCCESS, GET_ASSET_FAILURE,
    UPDATE_ASSET_REQUEST, UPDATE_ASSET_SUCCESS, UPDATE_ASSET_FAILURE,
    DELETE_ASSET_REQUEST, DELETE_ASSET_SUCCESS, DELETE_ASSET_FAILURE,
    ASSIGN_ASSET_REQUEST, ASSIGN_ASSET_SUCCESS, ASSIGN_ASSET_FAILURE,
    GET_ASSETS_BY_EMPLOYEE_REQUEST, GET_ASSETS_BY_EMPLOYEE_SUCCESS, GET_ASSETS_BY_EMPLOYEE_FAILURE,
    CLEAR_ASSET_DETAILS
} from "./actionType";

interface AssetState {
    assets: any[];
    employeeAssets: any[];
    asset: any | null;
    loading: boolean;
    error: string | null;
    success: string | null;
}

const initialAssetState: AssetState = {
    assets: [],
    employeeAssets: [],
    asset: null,
    loading: false,
    error: null,
    success: null,
};

const assetReducer = (state: AssetState = initialAssetState, action: any): AssetState => {
    switch (action.type) {
        case CREATE_ASSET_REQUEST:
        case GET_ASSETS_REQUEST:
        case GET_ASSET_REQUEST:
        case UPDATE_ASSET_REQUEST:
        case DELETE_ASSET_REQUEST:
        case ASSIGN_ASSET_REQUEST:
        case GET_ASSETS_BY_EMPLOYEE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: null,
            };

        case CREATE_ASSET_SUCCESS:
            return {
                ...state,
                loading: false,
                success: "Asset created successfully",
                assets: [...state.assets, action.payload],
            };

        case GET_ASSETS_SUCCESS:
            return {
                ...state,
                loading: false,
                assets: action.payload,
            };

        case GET_ASSET_SUCCESS:
            return {
                ...state,
                loading: false,
                asset: action.payload,
            };

        case UPDATE_ASSET_SUCCESS:
            return {
                ...state,
                loading: false,
                success: "Asset updated successfully",
                assets: state.assets.map(asset =>
                    asset.id === action.payload.id ? action.payload : asset
                ),
                asset: action.payload,
            };

        case DELETE_ASSET_SUCCESS:
            return {
                ...state,
                loading: false,
                success: "Asset deleted successfully",
                assets: state.assets.filter(asset => asset.id !== action.payload.id),
            };

        case ASSIGN_ASSET_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.assigned_to ? "Asset assigned successfully" : "Asset unassigned successfully",
                assets: state.assets.map(asset =>
                    asset.id === action.payload.id ? action.payload : asset
                ),
                asset: action.payload,
            };

        case GET_ASSETS_BY_EMPLOYEE_SUCCESS:
            return {
                ...state,
                loading: false,
                employeeAssets: action.payload,
            };

        case CREATE_ASSET_FAILURE:
        case GET_ASSETS_FAILURE:
        case GET_ASSET_FAILURE:
        case UPDATE_ASSET_FAILURE:
        case DELETE_ASSET_FAILURE:
        case ASSIGN_ASSET_FAILURE:
        case GET_ASSETS_BY_EMPLOYEE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case CLEAR_ASSET_DETAILS:
            return {
                ...state,
                error: null,
                success: null,
                asset: null,
                employeeAssets: [],
            };

        default:
            return state;
    }
};

export default assetReducer;
