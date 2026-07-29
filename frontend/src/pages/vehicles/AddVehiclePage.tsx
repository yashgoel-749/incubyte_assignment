import { useForm } from 'react-hook-form';
import { Button, Input, Card } from '../../components/ui';
import { isValidYear } from '../../utils/validators';
import type { CreateVehicleDto } from '../../types';

/** AddVehiclePage — Admin/Manager only. Form wired with RHF. */
export default function AddVehiclePage() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } =
        useForm<CreateVehicleDto>();

    // TODO Sprint 3: dispatch vehicleService.create() → addVehicle
    const onSubmit = async (_data: CreateVehicleDto) => { };

    return (
        <div className="max-w-2xl space-y-5">
            <h2 className="text-2xl font-bold text-slate-100">Add New Vehicle</h2>
            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <Input id="av-make" label="Make" placeholder="BMW" error={errors.make?.message}
                            {...register('make', { required: 'Make is required' })} />
                        <Input id="av-model" label="Model" placeholder="M4 Competition" error={errors.model?.message}
                            {...register('model', { required: 'Model is required' })} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <Input id="av-year" label="Year" type="number" placeholder="2024" error={errors.year?.message}
                            {...register('year', { required: 'Year is required', validate: v => isValidYear(Number(v)) || 'Invalid year' })} />
                        <Input id="av-price" label="Price ($)" type="number" placeholder="85000" error={errors.price?.message}
                            {...register('price', { required: 'Price is required', min: { value: 1, message: 'Must be > 0' } })} />
                        <Input id="av-stock" label="Stock" type="number" placeholder="3" error={errors.stock?.message}
                            {...register('stock', { required: 'Stock is required', min: { value: 0, message: 'Cannot be negative' } })} />
                    </div>
                    <Input id="av-vin" label="VIN (optional)" placeholder="WBS3R9C56FK334455"
                        {...register('vin')} />
                    <Button id="av-submit-btn" type="submit" variant="primary" isLoading={isSubmitting}>
                        Add Vehicle
                    </Button>
                </form>
            </Card>
        </div>
    );
}
