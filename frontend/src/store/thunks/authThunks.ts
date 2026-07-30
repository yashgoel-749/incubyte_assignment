import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services';
import { extractErrorMessage } from '../../services/api';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../../types';

// ─── Shared thunk config ───────────────────────────────────────────────────
/** Rejectvalue is always a plain string — consumed by authSlice.error. */
type ThunkConfig = { rejectValue: string };

// ─── Register ─────────────────────────────────────────────────────────────
export const registerUser = createAsyncThunk<AuthResponse, RegisterCredentials, ThunkConfig>(
    'auth/register',
    async (credentials, { rejectWithValue }) => {
        try {
            return await authService.register(credentials);
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, 'Failed to register'));
        }
    },
);

// ─── Login ─────────────────────────────────────────────────────────────────
export const loginUser = createAsyncThunk<AuthResponse, LoginCredentials, ThunkConfig>(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            return await authService.login(credentials);
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, 'Failed to login'));
        }
    },
);

// ─── Fetch Profile ─────────────────────────────────────────────────────────
export const fetchProfile = createAsyncThunk<AuthResponse['user'], void, ThunkConfig>(
    'auth/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            return await authService.getProfile();
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, 'Failed to fetch profile'));
        }
    },
);
