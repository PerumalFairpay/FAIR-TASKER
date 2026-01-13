import {
    CREATE_ROLE_REQUEST, CREATE_ROLE_SUCCESS, CREATE_ROLE_FAILURE,
    GET_ROLES_REQUEST, GET_ROLES_SUCCESS, GET_ROLES_FAILURE,
    GET_ROLE_REQUEST, GET_ROLE_SUCCESS, GET_ROLE_FAILURE,
    UPDATE_ROLE_REQUEST, UPDATE_ROLE_SUCCESS, UPDATE_ROLE_FAILURE,
    DELETE_ROLE_REQUEST, DELETE_ROLE_SUCCESS, DELETE_ROLE_FAILURE,
    CLEAR_ROLE_DETAILS
} from "./actionType";

interface RoleState {
    roles: any[];
    role: any | null;
    loading: boolean;
    error: string | null;
    success: string | null;
}

const initialRoleState: RoleState = {
    roles: [],
    role: null,
    loading: false,
    error: null,
    success: null,
};

const roleReducer = (state: RoleState = initialRoleState, action: any): RoleState => {
    switch (action.type) {
        // Create
        case CREATE_ROLE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: null,
            };
        case CREATE_ROLE_SUCCESS:
            return {
                ...state,
                loading: false,
                success: "Role created successfully", // Or use action.payload.message if available
                roles: [...state.roles, action.payload],
            };
        case CREATE_ROLE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Get All
        case GET_ROLES_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_ROLES_SUCCESS:
            return {
                ...state,
                loading: false,
                roles: action.payload,
            };
        case GET_ROLES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Get Single
        case GET_ROLE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                role: null,
            };
        case GET_ROLE_SUCCESS:
            return {
                ...state,
                loading: false,
                role: action.payload,
            };
        case GET_ROLE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Update
        case UPDATE_ROLE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: null,
            };
        case UPDATE_ROLE_SUCCESS:
            return {
                ...state,
                loading: false,
                success: "Role updated successfully",
                roles: state.roles.map(role =>
                    role.id === action.payload.id ? action.payload : role
                ),
                role: action.payload,
            };
        case UPDATE_ROLE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Delete
        case DELETE_ROLE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: null,
            };
        case DELETE_ROLE_SUCCESS:
            return {
                ...state,
                loading: false,
                success: "Role deleted successfully",
                roles: state.roles.filter(role => role.id !== action.payload.id),
            };
        case DELETE_ROLE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case CLEAR_ROLE_DETAILS:
            return {
                ...state,
                error: null,
                success: null,
                role: null,
            };

        default:
            return state;
    }
};

export default roleReducer;
