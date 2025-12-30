import {
    CREATE_ASSET_CATEGORY_REQUEST, CREATE_ASSET_CATEGORY_SUCCESS, CREATE_ASSET_CATEGORY_FAILURE,
    GET_ASSET_CATEGORIES_REQUEST, GET_ASSET_CATEGORIES_SUCCESS, GET_ASSET_CATEGORIES_FAILURE,
    GET_ASSET_CATEGORY_REQUEST, GET_ASSET_CATEGORY_SUCCESS, GET_ASSET_CATEGORY_FAILURE,
    UPDATE_ASSET_CATEGORY_REQUEST, UPDATE_ASSET_CATEGORY_SUCCESS, UPDATE_ASSET_CATEGORY_FAILURE,
    DELETE_ASSET_CATEGORY_REQUEST, DELETE_ASSET_CATEGORY_SUCCESS, DELETE_ASSET_CATEGORY_FAILURE,
    CLEAR_ASSET_CATEGORY_DETAILS
} from "./actionType";

interface AssetCategoryState {
    assetCategories: any[];
    assetCategory: any | null;
    loading: boolean;
    error: string | null;
    success: string | null;
}

const initialAssetCategoryState: AssetCategoryState = {
    assetCategories: [],
    assetCategory: null,
    loading: false,
    error: null,
    success: null,
};

const assetCategoryReducer = (state: AssetCategoryState = initialAssetCategoryState, action: any): AssetCategoryState => {
    switch (action.type) {
        case CREATE_ASSET_CATEGORY_REQUEST:
        case GET_ASSET_CATEGORIES_REQUEST:
        case GET_ASSET_CATEGORY_REQUEST:
        case UPDATE_ASSET_CATEGORY_REQUEST:
        case DELETE_ASSET_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: null,
            };

        case CREATE_ASSET_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                success: "Asset category created successfully",
                assetCategories: [...state.assetCategories, action.payload],
            };

        case GET_ASSET_CATEGORIES_SUCCESS:
            return {
                ...state,
                loading: false,
                assetCategories: action.payload,
            };

        case GET_ASSET_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                assetCategory: action.payload,
            };

        case UPDATE_ASSET_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                success: "Asset category updated successfully",
                assetCategories: state.assetCategories.map(cat =>
                    cat.id === action.payload.id ? action.payload : cat
                ),
                assetCategory: action.payload,
            };

        case DELETE_ASSET_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                success: "Asset category deleted successfully",
                assetCategories: state.assetCategories.filter(cat => cat.id !== action.payload.id),
            };

        case CREATE_ASSET_CATEGORY_FAILURE:
        case GET_ASSET_CATEGORIES_FAILURE:
        case GET_ASSET_CATEGORY_FAILURE:
        case UPDATE_ASSET_CATEGORY_FAILURE:
        case DELETE_ASSET_CATEGORY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case CLEAR_ASSET_CATEGORY_DETAILS:
            return {
                ...state,
                error: null,
                success: null,
                assetCategory: null,
            };

        default:
            return state;
    }
};

export default assetCategoryReducer;
