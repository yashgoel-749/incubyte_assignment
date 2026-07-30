import axios, {
    type AxiosInstance,
    type InternalAxiosRequestConfig,
    type AxiosResponse,
    type AxiosError,
} from 'axios';

// ─── Types ─────────────────────────────────────────────────────────────────
/** Shape of the JSON body returned by the Express error handler. */
type ApiErrorShape = { message?: unknown; error?: unknown };

// ─── Error Utility ─────────────────────────────────────────────────────────
/**
 * Extracts a human-readable message from any thrown value.
 * Handles Axios errors (reads response.data.message / response.data.error),
 * plain Error instances, and everything else via the fallback string.
 */
export const extractErrorMessage = (error: unknown, fallback: string): string => {
    if (axios.isAxiosError(error)) {
        const body = error.response?.data as ApiErrorShape | undefined;
        const msg =
            typeof body?.message === 'string' ? body.message :
                typeof body?.error === 'string' ? body.error :
                    error.message;
        if (msg) return msg;
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallback;
};

// ─── Token Provider ─────────────────────────────────────────────────────────
// Injectable getter — avoids circular dependency (api → store → slices → thunks → services → api).
// Call setTokenProvider() once in main.tsx after the store is initialised.
let _getToken: (() => string | null) | null = null;
let _onUnauthorized: (() => void) | null = null;

export function setTokenProvider(
    getToken: () => string | null,
    onUnauthorized: () => void,
) {
    _getToken = getToken;
    _onUnauthorized = onUnauthorized;
}

// ─── Base URL ──────────────────────────────────────────────────────────────
// Supports both Vite (import.meta.env) and Jest (process.env) environments.
// __VITE_API_BASE_URL__ is replaced at build time by vite.config.ts define.
declare const __VITE_API_BASE_URL__: string | undefined;
const BASE_URL: string =
    (typeof __VITE_API_BASE_URL__ !== 'undefined' ? __VITE_API_BASE_URL__ : undefined)
    ?? (typeof process !== 'undefined' ? process.env['VITE_API_BASE_URL'] : undefined)
    ?? 'http://localhost:3000/api';

// ─── Axios Instance ────────────────────────────────────────────────────────
const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 15_000,
    headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor ───────────────────────────────────────────────────
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = _getToken?.();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// ─── Response Interceptor ──────────────────────────────────────────────────
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            _onUnauthorized?.();
        }
        return Promise.reject(error);
    },
);

export default apiClient;
