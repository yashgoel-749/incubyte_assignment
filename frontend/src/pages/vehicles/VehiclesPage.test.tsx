import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../store';
import VehiclesPage from './VehiclesPage';
import { vehicleService } from '../../services';

jest.mock('../../services', () => ({
  vehicleService: {
    getAll: jest.fn(),
  },
}));

const mockVehicles = [
  { id: 1, make: 'Ford', model: 'Mustang', category: 'Coupe', price: 60000, stock: 1, status: 'AVAILABLE' },
  { id: 2, make: 'BMW', model: 'M4', category: 'Coupe', price: 80000, stock: 1, status: 'AVAILABLE' },
  { id: 3, make: 'Ford', model: 'Explorer', category: 'SUV', price: 45000, stock: 1, status: 'AVAILABLE' },
  { id: 4, make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 25000, stock: 1, status: 'AVAILABLE' },
];

describe('VehiclesPage search', () => {
  beforeEach(() => {
    (vehicleService.getAll as jest.Mock).mockImplementation((filters = {}) => {
      let filtered = mockVehicles;
      if (filters.make) filtered = filtered.filter(v => v.make.toLowerCase().includes(filters.make.toLowerCase()));
      if (filters.model) filtered = filtered.filter(v => v.model.toLowerCase().includes(filters.model.toLowerCase()));
      if (filters.category) filtered = filtered.filter(v => v.category === filters.category);
      if (filters.maxPrice) filtered = filtered.filter(v => v.price <= Number(filters.maxPrice));

      return Promise.resolve({
        data: filtered,
        total: filtered.length,
        page: 1,
        totalPages: 1
      });
    });
  });

  it('filters vehicles by make', async () => {
    const user = userEvent.setup();
    render(<Provider store={store}><VehiclesPage /></Provider>);

    await user.type(await screen.findByLabelText(/make/i), 'Ford');

    expect(await screen.findByText(/Ford Mustang/i)).toBeInTheDocument();
    expect(screen.queryByText(/BMW M4/i)).not.toBeInTheDocument();
  });

  it('filters vehicles by model', async () => {
    const user = userEvent.setup();
    render(<Provider store={store}><VehiclesPage /></Provider>);

    await user.type(await screen.findByLabelText(/model/i), 'Mustang');

    expect(await screen.findByText(/Ford Mustang/i)).toBeInTheDocument();
    expect(screen.queryByText(/BMW M4/i)).not.toBeInTheDocument();
  });

  it('filters vehicles by category', async () => {
    const user = userEvent.setup();
    render(<Provider store={store}><VehiclesPage /></Provider>);

    await user.selectOptions(await screen.findByLabelText(/category/i), 'SUV');

    expect(await screen.findByText(/Ford Explorer/i)).toBeInTheDocument();
    expect(screen.queryByText(/BMW M4/i)).not.toBeInTheDocument();
  });

  it('filters vehicles by price', async () => {
    const user = userEvent.setup();
    render(<Provider store={store}><VehiclesPage /></Provider>);

    const maxPriceInput = await screen.findByLabelText(/max price/i);
    await user.clear(maxPriceInput);
    await user.type(maxPriceInput, '50000');

    expect(await screen.findByText(/Toyota Corolla/i)).toBeInTheDocument();
    expect(screen.queryByText(/Ford Mustang/i)).not.toBeInTheDocument();
  });
});
