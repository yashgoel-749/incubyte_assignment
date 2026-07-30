import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../../types';
import { fetchProfile, loginUser, registerUser } from '../thunks/authThunks';

// ─── Initial State ─────────────────────────────────────────────────────────
let storedToken = localStorage.getItem('ac_token');
const storedUserStr = localStorage.getItem('ac_user');

let parsedUser: User | null = null;

if (storedUserStr) {
    try {
        if (storedUserStr === 'undefined') throw new Error('Invalid JSON');
        parsedUser = JSON.parse(storedUserStr) as User;
    } catch (error) {
        localStorage.removeItem('ac_token');
        localStorage.removeItem('ac_user');
        storedToken = null;
        parsedUser = null;
    }
}

const initialState: AuthState = {
    user: parsedUser,
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
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.error = null;

                localStorage.setItem('ac_token', action.payload.token);
                localStorage.setItem('ac_user', JSON.stringify(action.payload.user));
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? 'Failed to register';
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.error = null;

                localStorage.setItem('ac_token', action.payload.token);
                localStorage.setItem('ac_user', JSON.stringify(action.payload.user));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? 'Failed to login';
            })
            .addCase(fetchProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? 'Failed to fetch profile';
            });
    },
});

export const { setCredentials, logout, setLoading, setAuthError, clearAuthError } =
    authSlice.actions;

export default authSlice.reducer;
