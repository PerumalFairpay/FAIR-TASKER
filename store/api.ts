import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            if (
                typeof window !== "undefined" &&
                window.location.pathname.startsWith("/console") &&
                !window.location.pathname.startsWith("/console/login")
            ) {
                window.location.href = "/console/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
