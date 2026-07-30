import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { loginUser, registerUser } from '../thunks/authThunks';
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

interface AuthTestState {
  auth: {
    isAuthenticated: boolean;
    user: { email?: string | null } | null;
    token?: string | null;
  };
}

describe('auth thunk flow', () => {
  beforeEach(() => {
    mockedRegister.mockReset();
    sessionStorage.clear();
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

    const currentState = store.getState() as { auth: { isAuthenticated: boolean; user: { email?: string | null } | null } };
    expect(currentState.auth.isAuthenticated).toBe(true);
    expect(currentState.auth.user?.email).toBe('alice@example.com');
    expect(sessionStorage.getItem('ac_token')).toBe('token-123');
  });

  it('rehydrates the auth state from sessionStorage after a refresh', () => {
    sessionStorage.setItem('ac_token', 'token-456');
    sessionStorage.setItem('ac_user', JSON.stringify({
      id: 'usr_002',
      name: 'Bob Smith',
      email: 'bob@example.com',
      role: 'SALES',
      createdAt: '2024-01-01T00:00:00.000Z',
    }));

    jest.isolateModules(() => {
      const freshAuthReducer = require('./authSlice').default;
      const store = configureStore({
        reducer: {
          auth: freshAuthReducer,
        },
      });

      const isolatedState = store.getState() as AuthTestState;
      expect(isolatedState.auth.isAuthenticated).toBe(true);
      expect(isolatedState.auth.user?.email).toBe('bob@example.com');
    });
  });

  it('keeps the session alive when the backend only returns a token', async () => {
    (authService.login as jest.Mock).mockResolvedValueOnce({ token: 'token-789' });

    const store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });

    await store.dispatch(loginUser({ email: 'alice@example.com', password: 'strongpassword' }));

    const loginState = store.getState() as { auth: { isAuthenticated: boolean; token?: string | null } };
    expect(loginState.auth.isAuthenticated).toBe(true);
    expect(loginState.auth.token).toBe('token-789');
    expect(sessionStorage.getItem('ac_token')).toBe('token-789');

    jest.isolateModules(() => {
      const freshAuthReducer = require('./authSlice').default;
      const rehydratedStore = configureStore({
        reducer: {
          auth: freshAuthReducer,
        },
      });

      const rehydratedState = rehydratedStore.getState() as AuthTestState;
      expect(rehydratedState.auth.isAuthenticated).toBe(true);
      expect(rehydratedState.auth.token).toBe('token-789');
    });
  });
});

describe('auth slice initialization (corrupted sessionStorage)', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('does not crash and clears storage when ac_user is literal "undefined"', () => {
    sessionStorage.setItem('ac_user', 'undefined');
    sessionStorage.setItem('ac_token', 'corrupted-token');

    jest.isolateModules(() => {
      // Re-requiring the slice evaluates the top-level sessionStorage checks
      const authSlice = require('./authSlice').default;
      const initialState = authSlice(undefined, { type: '@@INIT' });

      expect(initialState.user).toBeNull();
      expect(initialState.token).toBe('corrupted-token');
      expect(initialState.isAuthenticated).toBe(true);
      expect(sessionStorage.getItem('ac_user')).toBeNull();
      expect(sessionStorage.getItem('ac_token')).toBe('corrupted-token');
    });
  });

  it('does not crash and clears storage when ac_user is malformed JSON', () => {
    sessionStorage.setItem('ac_user', '{"id": "usr_001", "name": "broken');
    sessionStorage.setItem('ac_token', 'corrupted-token');

    jest.isolateModules(() => {
      const authSlice = require('./authSlice').default;
      const initialState = authSlice(undefined, { type: '@@INIT' });

      expect(initialState.user).toBeNull();
      expect(initialState.token).toBe('corrupted-token');
      expect(initialState.isAuthenticated).toBe(true);
      expect(sessionStorage.getItem('ac_user')).toBeNull();
      expect(sessionStorage.getItem('ac_token')).toBe('corrupted-token');
    });
  });
});
