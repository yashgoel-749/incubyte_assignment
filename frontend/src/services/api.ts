import axios, {
    type AxiosInstance,
    type InternalAxiosRequestConfig,
    type AxiosResponse,
    type AxiosError,
} from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

// ─── Base URL ──────────────────────────────────────────────────────────────
// Reads from Vite env vars; falls back to local dev server.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

// ─── Axios Instance ────────────────────────────────────────────────────────
const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 15_000,
    headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor ───────────────────────────────────────────────────
// Automatically attaches the JWT Bearer token from the Redux store.
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
// Handles 401 globally (token expired / invalid) by dispatching logout.
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expired — clear auth state so <ProtectedRoute> redirects to /login
            store.dispatch(logout());
        }
        return Promise.reject(error);
    },
);

export default apiClient;
