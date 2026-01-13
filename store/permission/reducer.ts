import * as actionType from "./actionType";

const initialState = {
    permissions: [],
    permission: null,
    loading: false,
    error: null,
};

export default function permissionReducer(state = initialState, action: any) {
    switch (action.type) {
        case actionType.CREATE_PERMISSION_REQUEST:
        case actionType.GET_PERMISSIONS_REQUEST:
        case actionType.GET_PERMISSION_REQUEST:
        case actionType.UPDATE_PERMISSION_REQUEST:
        case actionType.DELETE_PERMISSION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case actionType.CREATE_PERMISSION_SUCCESS:
            return {
                ...state,
                loading: false,
                permissions: [...state.permissions, action.payload] as any,
            };

        case actionType.GET_PERMISSIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                permissions: action.payload,
            };

        case actionType.GET_PERMISSION_SUCCESS:
            return {
                ...state,
                loading: false,
                permission: action.payload,
            };

        case actionType.UPDATE_PERMISSION_SUCCESS:
            return {
                ...state,
                loading: false,
                permissions: state.permissions.map((p: any) =>
                    p.id === action.payload.id ? action.payload : p
                ),
                permission: action.payload,
            };

        case actionType.DELETE_PERMISSION_SUCCESS:
            return {
                ...state,
                loading: false,
                permissions: state.permissions.filter(
                    (p: any) => p.id !== action.payload
                ),
            };

        case actionType.CREATE_PERMISSION_FAILURE:
        case actionType.GET_PERMISSIONS_FAILURE:
        case actionType.GET_PERMISSION_FAILURE:
        case actionType.UPDATE_PERMISSION_FAILURE:
        case actionType.DELETE_PERMISSION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case actionType.CLEAR_PERMISSION_DETAILS:
            return {
                ...state,
                permission: null,
                error: null,
            };

        default:
            return state;
    }
}
