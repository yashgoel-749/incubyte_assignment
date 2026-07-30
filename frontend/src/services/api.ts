import axios, {
    type AxiosInstance,
    type InternalAxiosRequestConfig,
    type AxiosResponse,
    type AxiosError,
} from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

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

// ─── Base URL ──────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

// ─── Axios Instance ────────────────────────────────────────────────────────
const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 15_000,
    headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor ───────────────────────────────────────────────────
// Attaches the JWT Bearer token from the Redux store to every request.
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = store.getState().auth.token;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// ─── Response Interceptor ──────────────────────────────────────────────────
// Handles 401 globally — expired / invalid token triggers a logout so that
// ProtectedRoute automatically redirects the user back to /login.
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            store.dispatch(logout());
        }
        return Promise.reject(error);
    },
);

export default apiClient;
