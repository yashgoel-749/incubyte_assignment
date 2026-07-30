import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Select, Card } from '../../components/ui';
import { isValidYear } from '../../utils/validators';
import type { CreateVehicleDto, FuelType, Transmission, VehicleStatus } from '../../types';
import vehicleService from '../../services/vehicleService';
import { useAppDispatch } from '../../hooks';
import { addVehicle } from '../../store/slices/vehicleSlice';
import { ROUTES } from '../../utils/constants';
import { ImagePlus, Info } from 'lucide-react';
import { useState } from 'react';

const addVehicleSchema = z.object({
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

export default function AddVehiclePage() {
    const { register, handleSubmit, control, formState: { errors } } = useForm<CreateVehicleDto>({
        resolver: zodResolver(addVehicleSchema),
        defaultValues: {
            stock: 1,
            fuelType: 'Petrol',
            transmission: 'Automatic',
            year: new Date().getFullYear(),
            price: 0,
            make: '',
            model: '',
            imageUrl: '',
            description: '',
            vin: '',
            color: '',
            mileage: undefined,
        },
    });

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const onSubmit = async (data: CreateVehicleDto) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            // Ensure numbers are properly parsed
            const payload = {
                ...data,
                year: Number(data.year),
                price: Number(data.price),
                stock: Number(data.stock),
            };

            const response = await vehicleService.create(payload);
            const newVehicle = ('vehicle' in response) ? (response as any).vehicle : response;

            if (newVehicle && newVehicle.id) {
                dispatch(addVehicle(newVehicle));
            }

            navigate(ROUTES.DASHBOARD);
        } catch (error: any) {
            setSubmitError(error.response?.data?.message || error.message || 'Failed to create vehicle');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                        <span>Inventory</span>
                        <span>›</span>
                        <span className="text-emerald-700 font-medium">Add Vehicle</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">New Inventory Entry</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Enter vehicle specifications and details to list in the central catalog.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => navigate(ROUTES.DASHBOARD)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
                        Publish Listing
                    </Button>
                </div>
            </div>

            {submitError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                    {submitError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (Main Details) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* VEHICLE ASSETS */}
                    <Card className="space-y-4 shadow-sm border-slate-200">
                        <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">Vehicle Assets</h3>

                        <div className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-8 flex flex-col items-center justify-center text-center hover:bg-slate-100 transition-colors">
                            <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 mb-3 border border-slate-100">
                                <ImagePlus size={24} />
                            </div>
                            <h4 className="text-sm font-bold text-slate-700">Enter Primary Image URL</h4>
                            <p className="text-xs text-slate-500 mt-1 mb-4">High-res JPEG or PNG linked via remote URL.</p>

                            <div className="w-full max-w-sm">
                                <Input
                                    id="imageUrl"
                                    placeholder="https://example.com/image.jpg"
                                    error={errors.imageUrl?.message}
                                    {...register('imageUrl')}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* PRIMARY SPECIFICATIONS */}
                    <Card className="space-y-5 shadow-sm border-slate-200">
                        <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">Primary Specifications</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Input
                                id="make"
                                label="Vehicle Make"
                                placeholder="e.g. Porsche"
                                error={errors.make?.message}
                                {...register('make', { required: 'Make is required' })}
                            />

                            <Input
                                id="model"
                                label="Model"
                                placeholder="e.g. Taycan Turbo S"
                                error={errors.model?.message}
                                {...register('model', { required: 'Model is required' })}
                            />

                            <Input
                                id="year"
                                label="Manufacturing Year"
                                type="number"
                                placeholder="2024"
                                error={errors.year?.message}
                                {...register('year', { required: 'Year is required', validate: v => isValidYear(Number(v)) || 'Invalid year' })}
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
                                rules={{ required: 'Transmission is required' }}
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
                </div>

                {/* Right Column (Pricing & Status) */}
                <div className="space-y-6">

                    {/* PRICING & ALLOCATION */}
                    <Card className="space-y-5 shadow-sm border-slate-200">
                        <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">Pricing & Allocation</h3>

                        <div className="relative">
                            <Input
                                id="price"
                                label="Listing Price (USD)"
                                type="number"
                                placeholder="0.00"
                                className="pl-6 font-medium text-slate-900"
                                error={errors.price?.message}
                                {...register('price', { required: 'Price is required', min: { value: 1, message: 'Must be greater than 0' } })}
                            />
                            <div className="absolute top-[28px] left-3 text-slate-500 font-medium">$</div>
                        </div>

                        <div>
                            <Input
                                id="stock"
                                label="Quantity in Stock"
                                type="number"
                                min={1}
                                className="text-center font-bold text-slate-700"
                                error={errors.stock?.message}
                                {...register('stock', { required: 'Stock is required', min: { value: 1, message: 'Must be at least 1' } })}
                            />
                        </div>
                    </Card>

                    {/* VEHICLE DESCRIPTION */}
                    <Card className="space-y-4 shadow-sm border-slate-200">
                        <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">Vehicle Notes</h3>
                        <label className="block text-sm font-medium text-slate-700">Description</label>
                        <textarea
                            className="w-full min-h-[120px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none"
                            placeholder="Add vehicle details, features and selling highlights"
                            {...register('description')}
                        />
                        {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
                    </Card>

                    {/* INVENTORY STATUS */}
                    <Card className="space-y-3 shadow-sm border-slate-200">
                        <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">Inventory Status</h3>

                        <div className="space-y-2">
                            <label className="flex items-center gap-3 p-3 rounded-xl border border-emerald-500 bg-emerald-50/50 cursor-pointer transition-colors">
                                <input
                                    type="radio"
                                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                    value="AVAILABLE"
                                    {...register('status')}
                                />
                                <div>
                                    <p className="text-sm font-bold text-emerald-900 leading-none">Available</p>
                                    <p className="text-xs text-emerald-700/70 mt-1">Listed on public catalog</p>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors opacity-60">
                                <input
                                    type="radio"
                                    className="w-4 h-4 text-slate-600 focus:ring-slate-500 cursor-pointer"
                                    value="RESERVED"
                                    disabled
                                />
                                <div>
                                    <p className="text-sm font-semibold text-slate-700 leading-none">Reserved</p>
                                    <p className="text-xs text-slate-500 mt-1">Held for specific buyer</p>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors opacity-60">
                                <input
                                    type="radio"
                                    className="w-4 h-4 text-slate-600 focus:ring-slate-500 cursor-pointer"
                                    value="IN_TRANSIT"
                                    disabled
                                />
                                <div>
                                    <p className="text-sm font-semibold text-slate-700 leading-none">In Transit</p>
                                    <p className="text-xs text-slate-500 mt-1">Currently being shipped</p>
                                </div>
                            </label>
                        </div>
                    </Card>

                    {/* EXPERT TIP */}
                    <div className="bg-[#0f2e82] rounded-xl p-5 text-white shadow-md relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-10">
                            <ImagePlus size={100} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 font-bold mb-2">
                                <Info size={16} />
                                <h4>Expert Tip</h4>
                            </div>
                            <p className="text-blue-100 text-xs leading-relaxed">
                                High-quality 4K images increase vehicle inquiry rates by up to 64%. Use the 'In Transit' status if the VIN is assigned but the unit is still at the port.
                            </p>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
}
