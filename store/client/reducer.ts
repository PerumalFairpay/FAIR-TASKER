import {
    CREATE_CLIENT_REQUEST, CREATE_CLIENT_SUCCESS, CREATE_CLIENT_FAILURE,
    GET_CLIENTS_REQUEST, GET_CLIENTS_SUCCESS, GET_CLIENTS_FAILURE,
    GET_CLIENT_REQUEST, GET_CLIENT_SUCCESS, GET_CLIENT_FAILURE,
    UPDATE_CLIENT_REQUEST, UPDATE_CLIENT_SUCCESS, UPDATE_CLIENT_FAILURE,
    DELETE_CLIENT_REQUEST, DELETE_CLIENT_SUCCESS, DELETE_CLIENT_FAILURE,
    CLEAR_CLIENT_DETAILS
} from "./actionType";

interface ClientState {
    clients: any[];
    client: any | null;
    loading: boolean;
    error: string | null;
    success: string | null;
}

const initialClientState: ClientState = {
    clients: [],
    client: null,
    loading: false,
    error: null,
    success: null,
};

const clientReducer = (state: ClientState = initialClientState, action: any): ClientState => {
    switch (action.type) {
        // Create
        case CREATE_CLIENT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: null,
            };
        case CREATE_CLIENT_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.message || "Client created successfully",
                clients: [...state.clients, action.payload.data],
            };
        case CREATE_CLIENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Get All
        case GET_CLIENTS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_CLIENTS_SUCCESS:
            return {
                ...state,
                loading: false,
                clients: action.payload.data,
            };
        case GET_CLIENTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Get Single
        case GET_CLIENT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                client: null,
            };
        case GET_CLIENT_SUCCESS:
            return {
                ...state,
                loading: false,
                client: action.payload.data,
            };
        case GET_CLIENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Update
        case UPDATE_CLIENT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: null,
            };
        case UPDATE_CLIENT_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.message || "Client updated successfully",
                clients: state.clients.map(client =>
                    client.id === action.payload.data.id ? action.payload.data : client
                ),
                client: action.payload.data,
            };
        case UPDATE_CLIENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Delete
        case DELETE_CLIENT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: null,
            };
        case DELETE_CLIENT_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.message || "Client deleted successfully",
                clients: state.clients.filter(client => client.id !== action.payload.id),
            };
        case DELETE_CLIENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case CLEAR_CLIENT_DETAILS:
            return {
                ...state,
                error: null,
                success: null,
                client: null,
            };

        default:
            return state;
    }
};

export default clientReducer;
