import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select, Card, Spinner } from '../../components/ui';
import { isValidYear } from '../../utils/validators';
import type { CreateVehicleDto, Vehicle } from '../../types';
import vehicleService from '../../services/vehicleService';
import { useAppDispatch } from '../../hooks';
import { updateVehicle } from '../../store/slices/vehicleSlice';
import { ROUTES } from '../../utils/constants';
import { ImagePlus, Info } from 'lucide-react';

const editVehicleSchema = z.object({
    make: z.string().min(1, 'Make is required'),
    model: z.string().min(1, 'Model is required'),
    year: z.preprocess((value) => Number(value), z.number().int().gte(1900, 'Invalid year').lte(new Date().getFullYear() + 1, 'Invalid year')),
    price: z.preprocess((value) => Number(value), z.number().positive('Price must be greater than 0')),
    stock: z.preprocess((value) => Number(value), z.number().int().min(1, 'Stock must be at least 1')),
    fuelType: z.enum(['Petrol', 'Diesel', 'Electric', 'Hybrid']),
    transmission: z.enum(['Automatic', 'Manual']),
    imageUrl: z.string().url('Enter a valid image URL').optional().or(z.literal('')).transform((value) => value || undefined),
    description: z.string().max(500, 'Description must be 500 characters or less').optional().or(z.literal('')).transform((value) => value || undefined),
    vin: z.string().max(17, 'VIN is too long').optional().or(z.literal('')).transform((value) => value || undefined),
    color: z.string().max(50, 'Color is too long').optional().or(z.literal('')).transform((value) => value || undefined),
    mileage: z.preprocess((value) => (value === '' || value === undefined ? undefined : Number(value)), z.number().int().min(0, 'Mileage must be 0 or greater').optional()),
});

const FUEL_OPTIONS = [
    { value: 'Petrol', label: 'Petrol' },
    { value: 'Diesel', label: 'Diesel' },
    { value: 'Electric', label: 'Electric' },
    { value: 'Hybrid', label: 'Hybrid' },
];

const TRANSMISSION_OPTIONS = [
    { value: 'Automatic', label: 'Automatic' },
    { value: 'Manual', label: 'Manual' },
];

export default function EditVehiclePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<CreateVehicleDto>({
        resolver: zodResolver(editVehicleSchema),
        defaultValues: {
            make: '',
            model: '',
            year: new Date().getFullYear(),
            price: 0,
            stock: 1,
            fuelType: 'Petrol',
            transmission: 'Automatic',
            imageUrl: '',
            description: '',
            vin: '',
            color: '',
            mileage: undefined,
        },
    });

    useEffect(() => {
        if (!id) {
            setLoadError('Missing vehicle ID');
            setIsLoading(false);
            return;
        }

        vehicleService.getById(id)
            .then((vehicle: Vehicle) => {
                reset({
                    make: vehicle.make,
                    model: vehicle.model,
                    year: vehicle.year,
                    price: vehicle.price,
                    stock: vehicle.stock,
                    fuelType: vehicle.fuelType,
                    transmission: vehicle.transmission,
                    imageUrl: vehicle.imageUrl ?? '',
                    description: vehicle.description ?? '',
                    vin: vehicle.vin ?? '',
                    color: vehicle.color ?? '',
                    mileage: vehicle.mileage ?? undefined,
                });
            })
            .catch((error) => {
                setLoadError('Unable to load vehicle details.');
                console.error(error);
            })
            .finally(() => setIsLoading(false));
    }, [id, reset]);

    const onSubmit = async (data: CreateVehicleDto) => {
        if (!id) return;
        setSubmitError(null);

        try {
            const updatedVehicle = await vehicleService.update(id, data);
            dispatch(updateVehicle(updatedVehicle));
            navigate(ROUTES.DASHBOARD);
        } catch (error: any) {
            setSubmitError(error.response?.data?.message || error.message || 'Failed to update vehicle');
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner size="lg" label="Loading vehicle…" />
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="max-w-4xl mx-auto py-16">
                <p className="text-center text-red-600 font-semibold">{loadError}</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                        <span>Inventory</span>
                        <span>›</span>
                        <span className="text-emerald-700 font-medium">Edit Vehicle</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Vehicle Record</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Update the vehicle details and save the inventory record.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => navigate(ROUTES.DASHBOARD)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
                        Save Changes
                    </Button>
                </div>
            </div>

            {submitError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                    {submitError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="space-y-4 shadow-sm border-slate-200">
                        <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">Primary Specifications</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Input
                                id="make"
                                label="Vehicle Make"
                                placeholder="e.g. Porsche"
                                error={errors.make?.message}
                                {...register('make')}
                            />
                            <Input
                                id="model"
                                label="Model"
                                placeholder="e.g. Taycan Turbo S"
                                error={errors.model?.message}
                                {...register('model')}
                            />
                            <Input
                                id="year"
                                label="Manufacturing Year"
                                type="number"
                                placeholder="2024"
                                error={errors.year?.message}
                                {...register('year')}
                            />
                            <Input
                                id="price"
                                label="Listing Price (USD)"
                                type="number"
                                placeholder="0.00"
                                error={errors.price?.message}
                                {...register('price')}
                            />
                            <Input
                                id="stock"
                                label="Quantity in Stock"
                                type="number"
                                min={1}
                                error={errors.stock?.message}
                                {...register('stock')}
                            />
                            <Input
                                id="vin"
                                label="VIN Number"
                                placeholder="17-DIGIT ALPHANUMERIC CODE"
                                error={errors.vin?.message}
                                {...register('vin')}
                            />
                            <Input
                                id="color"
                                label="Color"
                                placeholder="e.g. Midnight Blue"
                                error={errors.color?.message}
                                {...register('color')}
                            />
                            <Input
                                id="mileage"
                                label="Mileage"
                                type="number"
                                placeholder="0"
                                error={errors.mileage?.message}
                                {...register('mileage')}
                            />
                            <Controller
                                name="fuelType"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        id="fuelType"
                                        label="Fuel Type"
                                        options={FUEL_OPTIONS}
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={errors.fuelType?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="transmission"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        id="transmission"
                                        label="Transmission"
                                        options={TRANSMISSION_OPTIONS}
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={errors.transmission?.message}
                                    />
                                )}
                            />
                        </div>
                    </Card>
                    <Card className="space-y-4 shadow-sm border-slate-200">
                        <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">Vehicle Notes</h3>
                        <textarea
                            className="w-full min-h-[120px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none"
                            placeholder="Update vehicle details, features and selling highlights"
                            {...register('description')}
                        />
                        {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card className="space-y-5 shadow-sm border-slate-200">
                        <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">Vehicle Assets</h3>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-8 flex flex-col items-center justify-center text-center hover:bg-slate-100 transition-colors">
                            <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 mb-3 border border-slate-100">
                                <ImagePlus size={24} />
                            </div>
                            <h4 className="text-sm font-bold text-slate-700">Update Image URL</h4>
                            <p className="text-xs text-slate-500 mt-1 mb-4">High-res JPEG or PNG linked via remote URL.</p>
                            <Input
                                id="imageUrl"
                                placeholder="https://example.com/image.jpg"
                                error={errors.imageUrl?.message}
                                {...register('imageUrl')}
                            />
                        </div>
                    </Card>
                    <Card className="space-y-3 shadow-sm border-slate-200">
                        <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">Expert Tip</h3>
                        <div className="bg-[#0f2e82] rounded-xl p-5 text-white shadow-md relative overflow-hidden">
                            <div className="absolute -right-4 -bottom-4 opacity-10">
                                <Info size={100} />
                            </div>
                            <div className="relative z-10">
                                <p className="text-blue-100 text-xs leading-relaxed">
                                    Saving a vehicle updates the shared catalog instantly — keep your pricing and stock fresh for all users.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </form>
        </div>
    );
}
