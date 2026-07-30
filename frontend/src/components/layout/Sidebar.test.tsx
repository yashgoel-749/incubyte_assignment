import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks';

jest.mock('../../utils/constants', () => ({
  ROUTES: {
    DASHBOARD: '/dashboard',
    VEHICLES: '/vehicles',
    ADD_VEHICLE: '/vehicles/new',
    INVENTORY: '/inventory',
    PURCHASES: '/purchases',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    LOGIN: '/login',
  },
}));

jest.mock('../../hooks', () => ({
  useAuth: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('Sidebar role-based navigation', () => {
  beforeEach(() => {
    mockedUseAuth.mockReturnValue({
      user: { id: 'user-1', name: 'Alice', email: 'alice@example.com', role: 'USER', createdAt: '2024-01-01T00:00:00.000Z' },
      token: 'token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
      handleLogout: jest.fn(),
    } as any);
  });

  it('shows only the basic navigation for regular users', () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} />
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Vehicles')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();

    expect(screen.queryByText('Add Vehicle')).not.toBeInTheDocument();
    expect(screen.queryByText('Inventory')).not.toBeInTheDocument();
    expect(screen.queryByText('Purchases')).not.toBeInTheDocument();
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });
});
