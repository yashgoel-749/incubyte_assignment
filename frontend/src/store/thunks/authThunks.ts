import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services';
import { extractErrorMessage } from '../../services/api';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../../types';

export const registerUser = createAsyncThunk<AuthResponse, RegisterCredentials, { rejectValue: string }>(
    'auth/register',
    async (credentials, { rejectWithValue }) => {
        try {
            return await authService.register(credentials);
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, 'Failed to register'));
        }
    },
);

export const loginUser = createAsyncThunk<AuthResponse, LoginCredentials, { rejectValue: string }>(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            return await authService.login(credentials);
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, 'Failed to login'));
        }
    },
);

export const fetchProfile = createAsyncThunk<AuthResponse['user'], void, { rejectValue: string }>(
    'auth/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            return await authService.getProfile();
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, 'Failed to fetch profile'));
        }
    },
);
