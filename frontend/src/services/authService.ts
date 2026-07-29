import apiClient from './api';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../types';

/**
 * authService — thin facade over /auth endpoints.
 * Business logic (dispatching to Redux) lives in components/hooks;
 * this layer is purely responsible for network calls.
 */
const authService = {
    /**
     * POST /auth/login
     * Returns { user, token } on success.
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
        return data;
    },

    /**
     * POST /auth/register
     * Returns { user, token } on success.
     */
    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const { data } = await apiClient.post<AuthResponse>('/auth/register', credentials);
        return data;
    },

    /**
     * GET /auth/me
     * Fetches the currently logged-in user profile.
     */
    async getProfile(): Promise<AuthResponse['user']> {
        const { data } = await apiClient.get<AuthResponse['user']>('/auth/me');
        return data;
    },
};

export default authService;
