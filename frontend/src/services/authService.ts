import apiClient from './api';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../types';

// ─── Auth Service (Axios / Real Backend) ───────────────────────────────────
// All endpoints hit the Express backend at /api/auth/*
// apiClient base URL = http://localhost:3000/api (or VITE_API_BASE_URL)

const authService = {
    /**
     * POST /auth/register
     * Creates a new user account and returns { user, token }.
     */
    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const { data } = await apiClient.post<AuthResponse>('/auth/register', credentials);
        return data;
    },

    /**
     * POST /auth/login
     * Authenticates an existing user and returns { user, token }.
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
        return data;
    },

    /**
     * GET /auth/me
     * Returns the current authenticated user profile.
     * Requires a valid JWT (attached automatically via request interceptor).
     */
    async getProfile(): Promise<AuthResponse['user']> {
        const { data } = await apiClient.get<AuthResponse['user']>('/auth/me');
        return data;
    },
};

export default authService;
