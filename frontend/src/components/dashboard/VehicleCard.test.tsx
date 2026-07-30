import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VehicleCard from './VehicleCard';
import vehicleService from '../../services/vehicleService';

jest.mock('../../services/vehicleService', () => ({
  __esModule: true,
  default: {
    purchase: jest.fn(),
  },
}));

jest.mock('../../hooks', () => ({
  useAppDispatch: () => jest.fn(),
}));

const mockedPurchase = vehicleService.purchase as jest.MockedFunction<typeof vehicleService.purchase>;

const baseVehicle = {
  id: 'vehicle-1',
  make: 'Ford',
  model: 'Mustang',
  year: 2023,
  fuelType: 'Electric',
  transmission: 'Automatic',
  price: 42000,
  stock: 5,
  status: 'AVAILABLE' as const,
};

describe('VehicleCard purchase workflow', () => {
  beforeEach(() => {
    mockedPurchase.mockReset();
  });

  it('completes a purchase successfully', async () => {
    mockedPurchase.mockResolvedValueOnce({ ...baseVehicle, stock: 3 });
    const user = userEvent.setup();

    render(<VehicleCard vehicle={baseVehicle} />);

    await user.click(screen.getByRole('button', { name: /purchase/i }));

    const quantityInput = screen.getByLabelText(/quantity/i);
    await user.clear(quantityInput);
    await user.type(quantityInput, '2');
    await user.click(screen.getByRole('button', { name: /confirm purchase/i }));

    expect(mockedPurchase).toHaveBeenCalledWith('vehicle-1', 2);
    expect(await screen.findByText(/purchase completed successfully/i)).toBeInTheDocument();
  });

  it('shows an out-of-stock message when stock is exhausted', async () => {
    const user = userEvent.setup();

    render(<VehicleCard vehicle={{ ...baseVehicle, stock: 0 }} />);

    await user.click(screen.getByRole('button', { name: /purchase/i }));

    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
    expect(mockedPurchase).not.toHaveBeenCalled();
  });

  it('updates the quantity before submitting', async () => {
    mockedPurchase.mockResolvedValueOnce({ ...baseVehicle, stock: 4 });
    const user = userEvent.setup();

    render(<VehicleCard vehicle={baseVehicle} />);

    await user.click(screen.getByRole('button', { name: /purchase/i }));

    const quantityInput = screen.getByLabelText(/quantity/i);
    await user.clear(quantityInput);
    await user.type(quantityInput, '3');

    expect(quantityInput).toHaveValue(3);
    await user.click(screen.getByRole('button', { name: /confirm purchase/i }));

    expect(mockedPurchase).toHaveBeenCalledWith('vehicle-1', 3);
  });

  it('shows a loading state while the purchase request is pending', async () => {
    mockedPurchase.mockImplementationOnce(() => new Promise(() => undefined));
    const user = userEvent.setup();

    render(<VehicleCard vehicle={baseVehicle} />);

    await user.click(screen.getByRole('button', { name: /purchase/i }));
    await user.click(screen.getByRole('button', { name: /confirm purchase/i }));

    expect(await screen.findByText(/processing purchase/i)).toBeInTheDocument();
  });

  it('shows a backend error message when the request fails', async () => {
    mockedPurchase.mockRejectedValueOnce(new Error('Backend error'));
    const user = userEvent.setup();

    render(<VehicleCard vehicle={baseVehicle} />);

    await user.click(screen.getByRole('button', { name: /purchase/i }));
    const quantityInput = screen.getByLabelText(/quantity/i);
    await user.clear(quantityInput);
    await user.type(quantityInput, '1');
    await user.click(screen.getByRole('button', { name: /confirm purchase/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to complete purchase/i)).toBeInTheDocument();
    });
  });
});
