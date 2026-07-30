import apiClient from './api';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../types';

// ─── Auth Service ──────────────────────────────────────────────────────────
// Thin Axios wrappers around /api/auth/* endpoints.
// Errors are intentionally NOT caught here — they propagate to the calling
// thunk, which formats them with extractErrorMessage before rejecting.

const authService = {
    /** POST /auth/register — creates account, returns { user, token } */
    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const { data } = await apiClient.post<AuthResponse>('/auth/register', credentials);
        return data;
    },

    /** POST /auth/login — authenticates user, returns { user, token } */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
        return data;
    },

    /** GET /auth/me — returns current user profile (requires Bearer token) */
    async getProfile(): Promise<AuthResponse['user']> {
        const { data } = await apiClient.get<AuthResponse['user']>('/auth/me');
        return data;
    },
};

export default authService;
