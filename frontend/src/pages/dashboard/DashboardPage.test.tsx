import { render, screen } from '@testing-library/react';
import DashboardPage from './DashboardPage';

jest.mock('../../hooks', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: () => ({
    vehicles: [],
    isLoading: false,
    error: null,
    total: 0,
    page: 1,
    totalPages: 1
  })
}));

describe('DashboardPage', () => {
  it('shows a loading spinner while vehicle data is loading', () => {
    render(<DashboardPage {...({ isLoading: true } as any)} />);

    expect(screen.getByText(/loading vehicles/i)).toBeInTheDocument();
  });

  it('shows an empty-state message when there are no vehicles', () => {
    render(<DashboardPage {...({ vehicles: [] } as any)} />);

    expect(screen.getByText(/no vehicles available/i)).toBeInTheDocument();
  });

  it('renders vehicles from the provided data set', () => {
    const vehicles = [
      {
        id: 101,
        make: 'Ford',
        model: 'Mustang',
        year: 2023,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        price: 4200000,
        stock: 3,
        status: 'AVAILABLE',
      },
    ];

    render(<DashboardPage {...({ vehicles } as any)} />);

    expect(screen.getByText(/Ford Mustang/i)).toBeInTheDocument();
    expect(screen.getByText(/2023/i)).toBeInTheDocument();
  });

  it('renders an API failure message when vehicle loading fails', () => {
    render(<DashboardPage {...({ error: 'Failed to load vehicles' } as any)} />);

    expect(screen.getByText(/failed to load vehicles/i)).toBeInTheDocument();
  });

  it('renders pagination controls for the provided page state', () => {
    render(
      <DashboardPage
        {...({
          pagination: { currentPage: 2, totalPages: 5 },
        } as any)}
      />
    );

    expect(screen.getByRole('button', { name: /page 2/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /page 5/i })).toBeInTheDocument();
  });
});
