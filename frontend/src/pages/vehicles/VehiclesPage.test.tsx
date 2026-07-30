import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VehiclesPage from './VehiclesPage';

describe('VehiclesPage search', () => {
  it('filters vehicles by make', async () => {
    const user = userEvent.setup();
    render(<VehiclesPage />);

    await user.type(screen.getByLabelText(/make/i), 'Ford');

    expect(screen.getByText(/Ford Mustang/i)).toBeInTheDocument();
    expect(screen.queryByText(/BMW M4/i)).not.toBeInTheDocument();
  });

  it('filters vehicles by model', async () => {
    const user = userEvent.setup();
    render(<VehiclesPage />);

    await user.type(screen.getByLabelText(/model/i), 'Mustang');

    expect(screen.getByText(/Ford Mustang/i)).toBeInTheDocument();
    expect(screen.queryByText(/BMW M4/i)).not.toBeInTheDocument();
  });

  it('filters vehicles by category', async () => {
    const user = userEvent.setup();
    render(<VehiclesPage />);

    await user.selectOptions(screen.getByLabelText(/category/i), 'SUV');

    expect(screen.getByText(/Ford Explorer/i)).toBeInTheDocument();
    expect(screen.queryByText(/BMW M4/i)).not.toBeInTheDocument();
  });

  it('filters vehicles by price', async () => {
    const user = userEvent.setup();
    render(<VehiclesPage />);

    await user.clear(screen.getByLabelText(/max price/i));
    await user.type(screen.getByLabelText(/max price/i), '50000');

    expect(screen.getByText(/Toyota Corolla/i)).toBeInTheDocument();
    expect(screen.queryByText(/Ford Mustang/i)).not.toBeInTheDocument();
  });
});
