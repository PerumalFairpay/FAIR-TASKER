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


    // Specific states for UI
    getAssetsLoading: boolean; // Added
    getAssetsError: any;
    getAssetLoading: boolean;
    getAssetError: any;
    getEmployeeAssetsLoading: boolean;
    getEmployeeAssetsError: any;

    createAssetLoading: boolean;
    createAssetSuccess: string | null;
    createAssetError: any;

    updateAssetLoading: boolean;
    updateAssetSuccess: string | null;
    updateAssetError: any;

    deleteAssetLoading: boolean;
    deleteAssetSuccess: string | null;
    deleteAssetError: any;

    assignAssetLoading: boolean;
    assignAssetSuccess: string | null;
    assignAssetError: any;
}

const initialAssetState: AssetState = {
    assets: [],
    employeeAssets: [],
    asset: null,


    getAssetsLoading: false, // Added
    getAssetsError: null,
    getAssetLoading: false,
    getAssetError: null,
    getEmployeeAssetsLoading: false,
    getEmployeeAssetsError: null,

    createAssetLoading: false,
    createAssetSuccess: null,
    createAssetError: null,

    updateAssetLoading: false,
    updateAssetSuccess: null,
    updateAssetError: null,

    deleteAssetLoading: false,
    deleteAssetSuccess: null,
    deleteAssetError: null,

    assignAssetLoading: false,
    assignAssetSuccess: null,
    assignAssetError: null,
};

const assetReducer = (state: AssetState = initialAssetState, action: any): AssetState => {
    switch (action.type) {
        // Create Asset
        case CREATE_ASSET_REQUEST:
            return {
                ...state,
                createAssetLoading: true,
                createAssetSuccess: null,
                createAssetError: null,
            };
        case CREATE_ASSET_SUCCESS:
            console.log(action.payload.message, "action.payload.message");
            return {
                ...state,
                createAssetLoading: false,
                createAssetSuccess: action.payload.message || "Asset created successfully",
                assets: [action.payload.data, ...state.assets],
            };
        case CREATE_ASSET_FAILURE:
            return {
                ...state,
                createAssetLoading: false,
                createAssetSuccess: null,
                createAssetError: action.payload,
            };

        // Get Assets
        case GET_ASSETS_REQUEST:
            return {
                ...state,
                getAssetsLoading: true,
                getAssetsError: null,
            };
        case GET_ASSETS_SUCCESS:
            return {
                ...state,
                getAssetsLoading: false,
                assets: action.payload.data,
                getAssetsError: null,
            };
        case GET_ASSETS_FAILURE:
            return {
                ...state,
                getAssetsLoading: false,
                getAssetsError: action.payload
            };

        // Get Single Asset
        case GET_ASSET_REQUEST:
            return {
                ...state,
                getAssetLoading: true,
                getAssetError: null,
            };
        case GET_ASSET_SUCCESS:
            return {
                ...state,
                getAssetLoading: false,
                asset: action.payload.data,
                getAssetError: null,
            };
        case GET_ASSET_FAILURE:
            return {
                ...state,
                getAssetLoading: false,
                getAssetError: action.payload
            };

        // Update Asset
        case UPDATE_ASSET_REQUEST:
            return {
                ...state,
                updateAssetLoading: true,
                updateAssetSuccess: null,
                updateAssetError: null,
            };
        case UPDATE_ASSET_SUCCESS:
            return {
                ...state,
                updateAssetLoading: false,
                updateAssetSuccess: action.payload.message || "Asset updated successfully",
                assets: state.assets.map(asset =>
                    asset.id === action.payload.data.id ? action.payload.data : asset
                ),
                asset: action.payload.data,
            };
        case UPDATE_ASSET_FAILURE:
            return {
                ...state,
                updateAssetLoading: false,
                updateAssetSuccess: null,
                updateAssetError: action.payload,
            };

        // Delete Asset
        case DELETE_ASSET_REQUEST:
            return {
                ...state,
                deleteAssetLoading: true,
                deleteAssetSuccess: null,
                deleteAssetError: null,
            };
        case DELETE_ASSET_SUCCESS:
            return {
                ...state,
                deleteAssetLoading: false,
                deleteAssetSuccess: action.payload.message || "Asset deleted successfully",
                assets: state.assets.filter(asset => asset.id !== action.payload.id),
            };
        case DELETE_ASSET_FAILURE:
            return {
                ...state,
                deleteAssetLoading: false,
                deleteAssetSuccess: null,
                deleteAssetError: action.payload,
            };

        // Assign/Unassign Asset
        case ASSIGN_ASSET_REQUEST:
            return {
                ...state,
                assignAssetLoading: true,
                assignAssetSuccess: null,
                assignAssetError: null,
            };
        case ASSIGN_ASSET_SUCCESS:
            const updatedAsset = action.payload.data;
            let updatedEmployeeAssets = state.employeeAssets.map(asset =>
                asset.id === updatedAsset.id ? updatedAsset : asset
            );

            // If the asset is now unassigned (assigned_to is null), remove it from the employee's list
            if (!updatedAsset.assigned_to) {
                updatedEmployeeAssets = updatedEmployeeAssets.filter(asset => asset.id !== updatedAsset.id);
            }

            return {
                ...state,
                assignAssetLoading: false,
                assignAssetSuccess: action.payload.message || (updatedAsset.assigned_to ? "Asset assigned successfully" : "Asset unassigned successfully"),
                assets: state.assets.map(asset =>
                    asset.id === updatedAsset.id ? updatedAsset : asset
                ),
                employeeAssets: updatedEmployeeAssets,
                asset: updatedAsset,
            };
        case ASSIGN_ASSET_FAILURE:
            return {
                ...state,
                assignAssetLoading: false,
                assignAssetSuccess: null,
                assignAssetError: action.payload,
            };

        // Get Assets by Employee
        case GET_ASSETS_BY_EMPLOYEE_REQUEST:
            return {
                ...state,
                getEmployeeAssetsLoading: true,
                getEmployeeAssetsError: null,
            };
        case GET_ASSETS_BY_EMPLOYEE_SUCCESS:
            return {
                ...state,
                getEmployeeAssetsLoading: false,
                employeeAssets: action.payload.data,
                getEmployeeAssetsError: null,
            };
        case GET_ASSETS_BY_EMPLOYEE_FAILURE:
            return {
                ...state,
                getEmployeeAssetsLoading: false,
                getEmployeeAssetsError: action.payload
            };

        case CLEAR_ASSET_DETAILS:
            return {
                ...state,
                asset: null,
                employeeAssets: [],

                getAssetsError: null,
                getAssetError: null,
                getEmployeeAssetsError: null,

                // Reset specific states
                createAssetSuccess: null,
                createAssetError: null,

                updateAssetSuccess: null,
                updateAssetError: null,

                deleteAssetSuccess: null,
                deleteAssetError: null,

                assignAssetSuccess: null,
                assignAssetError: null,
            };

        default:
            return state;
    }
};

export default assetReducer;
