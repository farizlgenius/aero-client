// src/api/api.ts
import axios, { AxiosInstance } from "axios";
import Logger from "../utility/Logger";

const API_BASE = import.meta.env.VITE_SERVER_IP;

let accessToken: string | null = null;

const api: AxiosInstance = axios.create({
    baseURL: API_BASE,
    timeout: 15000,
    withCredentials: true, // remove if you don't need cookies
});

// ---- Token Setters -----------------------------------------------------

export function setAccessToken(token: string | null) {
    accessToken = token;

    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
}

export function getAccessToken() {
    return accessToken;
}

export function clearAccessToken() {
    accessToken = null;
    delete api.defaults.headers.common["Authorization"];
}


export const send = {
    get: async (endpoint: string) => {
        try {
            return await api.get(endpoint);
        } catch (e: any) {
            Logger.error(e)
            return e.response;
        }
    },

    post: async (endpoint: string, payload?: Object) => {
        try {
            return await api.post(endpoint, payload);
        } catch (e: any) {
            Logger.error(e)
            return e;
        }
    },
    put: async (endpoint: string, payload: Object) => {
        try {
            return await api.put(endpoint, payload);
        } catch (e: any) {
            Logger.error(e)
            return e.response;
        }
    },
    delete: async (endpoint: string) => {
        try {
            return await api.delete(endpoint);
        } catch (e: any) {
            Logger.error(e)
            return e.response;
        }
    }
}


// ---- Request Interceptor (optional) ------------------------------------

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers = {
            ...(config.headers as any),
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        };
    }
    return config;
});



// ---- Export -------------------------------------------------------------

export default api;
