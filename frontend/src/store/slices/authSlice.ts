import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../../types';
import { fetchProfile, loginUser, registerUser } from '../thunks/authThunks';

const storage = typeof window !== 'undefined' ? window.sessionStorage : null;

const persistAuthSession = (user: User | null | undefined, token: string) => {
    if (!storage) return;

    if (!token) {
        clearAuthSession();
        return;
    }

    storage.setItem('ac_token', token);
    if (user) {
        storage.setItem('ac_user', JSON.stringify(user));
    } else {
        storage.removeItem('ac_user');
    }
};

const clearAuthSession = () => {
    storage?.removeItem('ac_token');
    storage?.removeItem('ac_user');
};

// ─── Initial State ─────────────────────────────────────────────────────────
let storedToken = storage?.getItem('ac_token') ?? null;
const storedUserStr = storage?.getItem('ac_user') ?? null;

let parsedUser: User | null = null;

if (storedToken && storedUserStr) {
    try {
        if (storedUserStr === 'undefined') throw new Error('Invalid JSON');
        parsedUser = JSON.parse(storedUserStr) as User;
    } catch (error) {
        storage?.removeItem('ac_user');
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

            persistAuthSession(action.payload.user, action.payload.token);
        },

        /** Clear everything on logout */
        logout(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;

            clearAuthSession();
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
                state.user = action.payload.user ?? null;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.error = null;

                persistAuthSession(action.payload.user ?? null, action.payload.token);
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
                state.user = action.payload.user ?? null;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.error = null;

                persistAuthSession(action.payload.user ?? null, action.payload.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? 'Failed to login';
            })
            .addCase(fetchProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.user = action.payload ?? null;
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
