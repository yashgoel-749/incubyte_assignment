import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import vehicleReducer from '../../store/slices/vehicleSlice';
import { authService } from '../../services';
import LoginPage from './LoginPage';

jest.mock('../../services/api', () => ({
  extractErrorMessage: (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback,
}));

jest.mock('../../utils/constants', () => ({
  ROUTES: {
    DASHBOARD: '/dashboard',
    REGISTER: '/register',
    LOGIN: '/login',
  },
}));

jest.mock('../../services', () => ({
  authService: {
    login: jest.fn(),
  },
}));

const mockedLogin = authService.login as jest.Mock;

const renderLoginPage = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      vehicles: vehicleReducer,
    },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    ),
  };
};

describe('LoginPage', () => {
  beforeEach(() => {
    mockedLogin.mockReset();
    sessionStorage.clear();
  });

  it('logs the user in successfully', async () => {
    mockedLogin.mockResolvedValueOnce({
      user: {
        id: 'usr_001',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'MANAGER',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
      token: 'token-123',
    });

    const user = userEvent.setup();
    const { store } = renderLoginPage();

    await user.type(screen.getByLabelText(/email address/i), 'alice@example.com');
    await user.type(screen.getByLabelText(/password/i), 'strongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith({
        email: 'alice@example.com',
        password: 'strongpassword',
      });
    });

    expect(store.getState().auth.isAuthenticated).toBe(true);
  });

  it('shows an invalid credentials error', async () => {
    mockedLogin.mockRejectedValueOnce(new Error('Invalid credentials'));

    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText(/email address/i), 'error@premiumdeluxemotors.com');
    await user.type(screen.getByLabelText(/password/i), 'strongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });

  it('shows a loading state while login is pending', async () => {
    mockedLogin.mockImplementation(() => new Promise(() => undefined));

    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText(/email address/i), 'alice@example.com');
    await user.type(screen.getByLabelText(/password/i), 'strongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('button', { name: /sign in/i })).toBeDisabled();
  });

  it('stores the JWT after a successful login', async () => {
    mockedLogin.mockResolvedValueOnce({
      user: {
        id: 'usr_002',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'MANAGER',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
      token: 'jwt-token-123',
    });

    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText(/email address/i), 'alice@example.com');
    await user.type(screen.getByLabelText(/password/i), 'strongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(sessionStorage.getItem('ac_token')).toBe('jwt-token-123');
    });
  });

  it('updates Redux auth state after a successful login', async () => {
    mockedLogin.mockResolvedValueOnce({
      user: {
        id: 'usr_003',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'MANAGER',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
      token: 'jwt-token-456',
    });

    const user = userEvent.setup();
    const { store } = renderLoginPage();

    await user.type(screen.getByLabelText(/email address/i), 'alice@example.com');
    await user.type(screen.getByLabelText(/password/i), 'strongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(store.getState().auth.user?.email).toBe('alice@example.com');
      expect(store.getState().auth.isAuthenticated).toBe(true);
    });
  });

  it('redirects to the dashboard after a successful login', async () => {
    mockedLogin.mockResolvedValueOnce({
      user: {
        id: 'usr_004',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'MANAGER',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
      token: 'jwt-token-789',
    });

    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText(/email address/i), 'alice@example.com');
    await user.type(screen.getByLabelText(/password/i), 'strongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Dashboard Page')).toBeInTheDocument();
  });
});
