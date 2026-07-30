import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { registerUser } from '../thunks/authThunks';
import { authService } from '../../services';

jest.mock('../../services/api', () => ({
  extractErrorMessage: (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback,
}));

jest.mock('../../services', () => ({
  authService: {
    register: jest.fn(),
    login: jest.fn(),
    getProfile: jest.fn(),
  },
}));

const mockedRegister = authService.register as jest.Mock;

describe('auth thunk flow', () => {
  beforeEach(() => {
    mockedRegister.mockReset();
    localStorage.clear();
  });

  it('stores user credentials after a successful registration', async () => {
    mockedRegister.mockResolvedValueOnce({
      user: {
        id: 'usr_001',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'MANAGER',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
      token: 'token-123',
    });

    const store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });

    await store.dispatch(
      registerUser({
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'strongpassword',
      })
    );

    expect(store.getState().auth.isAuthenticated).toBe(true);
    expect(store.getState().auth.user?.email).toBe('alice@example.com');
    expect(localStorage.getItem('ac_token')).toBe('token-123');
  });
});
