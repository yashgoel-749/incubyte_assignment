import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import vehicleReducer from '../../store/slices/vehicleSlice';
import { authService } from '../../services';
import RegisterPage from './RegisterPage';

jest.mock('../../services/api', () => ({
  extractErrorMessage: (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback,
}));

jest.mock('../../utils/constants', () => ({
  ROUTES: {
    DASHBOARD: '/dashboard',
    LOGIN: '/login',
  },
}));

jest.mock('../../services', () => ({
  authService: {
    register: jest.fn(),
  },
}));

const mockedRegister = authService.register as jest.Mock;

const renderRegisterPage = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      vehicles: vehicleReducer,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('RegisterPage', () => {
  beforeEach(() => {
    mockedRegister.mockReset();
    sessionStorage.clear();
  });

  it('submits valid registration data and creates the user account', async () => {
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

    const user = userEvent.setup();
    renderRegisterPage();

    await user.type(screen.getByLabelText(/full name/i), 'Alice Johnson');
    await user.type(screen.getByLabelText(/email address/i), 'alice@example.com');
    await user.type(screen.getByLabelText(/password/i), 'strongpassword');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() =>
      expect(mockedRegister).toHaveBeenCalledWith({
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'strongpassword',
      })
    );
  });

  it('shows an invalid email validation error', async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    await user.type(screen.getByLabelText(/full name/i), 'Alice Johnson');
    await user.type(screen.getByLabelText(/email address/i), 'not-an-email');
    await user.type(screen.getByLabelText(/password/i), 'strongpassword');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
  });

  it('shows required field errors for empty submission', async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText('Full name is required')).toBeInTheDocument();
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  it('shows a duplicate email error when the service rejects the request', async () => {
    mockedRegister.mockRejectedValueOnce(new Error('Email already in use'));

    const user = userEvent.setup();
    renderRegisterPage();

    await user.type(screen.getByLabelText(/full name/i), 'Alice Johnson');
    await user.type(screen.getByLabelText(/email address/i), 'error@premiumdeluxemotors.com');
    await user.type(screen.getByLabelText(/password/i), 'strongpassword');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText('Email already in use')).toBeInTheDocument();
  });

  it('shows a loading state while registration is pending', async () => {
    mockedRegister.mockImplementation(() => new Promise(() => undefined));

    const user = userEvent.setup();
    renderRegisterPage();

    await user.type(screen.getByLabelText(/full name/i), 'Alice Johnson');
    await user.type(screen.getByLabelText(/email address/i), 'alice@example.com');
    await user.type(screen.getByLabelText(/password/i), 'strongpassword');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText(/creating account/i)).toBeInTheDocument();
  });

  it('navigates to the dashboard after a successful registration', async () => {
    mockedRegister.mockResolvedValueOnce({
      user: {
        id: 'usr_002',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'MANAGER',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
      token: 'token-456',
    });

    const user = userEvent.setup();
    renderRegisterPage();

    await user.type(screen.getByLabelText(/full name/i), 'Alice Johnson');
    await user.type(screen.getByLabelText(/email address/i), 'alice@example.com');
    await user.type(screen.getByLabelText(/password/i), 'strongpassword');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText('Dashboard Page')).toBeInTheDocument();
  });
});
