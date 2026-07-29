import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../../types';

// ─── Initial State ─────────────────────────────────────────────────────────
const storedToken = localStorage.getItem('ac_token');
const storedUser = localStorage.getItem('ac_user');

const initialState: AuthState = {
    user: storedUser ? (JSON.parse(storedUser) as User) : null,
    token: storedToken ?? null,
    isAuthenticated: !!storedToken,
    isLoading: false,
    error: null,
};

// ─── Slice ─────────────────────────────────────────────────────────────────
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        /** Called after a successful login/register API response */
        setCredentials(state, action: PayloadAction<{ user: User; token: string }>) {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;

            localStorage.setItem('ac_token', action.payload.token);
            localStorage.setItem('ac_user', JSON.stringify(action.payload.user));
        },

        /** Clear everything on logout */
        logout(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;

            localStorage.removeItem('ac_token');
            localStorage.removeItem('ac_user');
        },

        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },

        setAuthError(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.isLoading = false;
        },

        clearAuthError(state) {
            state.error = null;
        },
    },
});

export const { setCredentials, logout, setLoading, setAuthError, clearAuthError } =
    authSlice.actions;

export default authSlice.reducer;
