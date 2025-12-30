import {
    CREATE_CLIENT_REQUEST, CREATE_CLIENT_SUCCESS, CREATE_CLIENT_FAILURE,
    GET_CLIENTS_REQUEST, GET_CLIENTS_SUCCESS, GET_CLIENTS_FAILURE,
    GET_CLIENT_REQUEST, GET_CLIENT_SUCCESS, GET_CLIENT_FAILURE,
    UPDATE_CLIENT_REQUEST, UPDATE_CLIENT_SUCCESS, UPDATE_CLIENT_FAILURE,
    DELETE_CLIENT_REQUEST, DELETE_CLIENT_SUCCESS, DELETE_CLIENT_FAILURE,
    CLEAR_CLIENT_DETAILS
} from "./actionType";

// Create Client
export const createClientRequest = (payload: FormData) => ({
    type: CREATE_CLIENT_REQUEST,
    payload,
});
export const createClientSuccess = (response: any) => ({
    type: CREATE_CLIENT_SUCCESS,
    payload: response,
});
export const createClientFailure = (error: any) => ({
    type: CREATE_CLIENT_FAILURE,
    payload: error,
});

// Get All Clients
export const getClientsRequest = () => ({
    type: GET_CLIENTS_REQUEST,
});
export const getClientsSuccess = (response: any) => ({
    type: GET_CLIENTS_SUCCESS,
    payload: response,
});
export const getClientsFailure = (error: any) => ({
    type: GET_CLIENTS_FAILURE,
    payload: error,
});

// Get Single Client
export const getClientRequest = (id: string) => ({
    type: GET_CLIENT_REQUEST,
    payload: id,
});
export const getClientSuccess = (response: any) => ({
    type: GET_CLIENT_SUCCESS,
    payload: response,
});
export const getClientFailure = (error: any) => ({
    type: GET_CLIENT_FAILURE,
    payload: error,
});

// Update Client
export const updateClientRequest = (id: string, payload: FormData) => ({
    type: UPDATE_CLIENT_REQUEST,
    payload: { id, payload },
});
export const updateClientSuccess = (response: any) => ({
    type: UPDATE_CLIENT_SUCCESS,
    payload: response,
});
export const updateClientFailure = (error: any) => ({
    type: UPDATE_CLIENT_FAILURE,
    payload: error,
});

// Delete Client
export const deleteClientRequest = (id: string) => ({
    type: DELETE_CLIENT_REQUEST,
    payload: id,
});
export const deleteClientSuccess = (response: any) => ({
    type: DELETE_CLIENT_SUCCESS,
    payload: response,
});
export const deleteClientFailure = (error: any) => ({
    type: DELETE_CLIENT_FAILURE,
    payload: error,
});

// Clear Details
export const clearClientDetails = () => ({
    type: CLEAR_CLIENT_DETAILS,
});
