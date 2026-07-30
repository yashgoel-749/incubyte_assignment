import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchVehicles } from '../../store/thunks/vehicleThunks';
import { Input, Select, Card, EmptyState, LoadingSpinner } from '../../components/ui';

export default function VehiclesPage() {
    const dispatch = useAppDispatch();
    const { vehicles = [], isLoading, error } = useAppSelector(state => state.vehicles);

    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {
        dispatch(fetchVehicles({
            make: make || undefined,
            model: model || undefined,
            category: category || undefined,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
        }));
    }, [dispatch, make, model, category, minPrice, maxPrice]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-100">Vehicle Search</h2>

            <Card className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
                <Input
                    label="Make"
                    id="make"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    placeholder="e.g. Ford"
                />
                <Input
                    label="Model"
                    id="model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. Mustang"
                />
                <Select
                    label="Category"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    options={[
                        { label: 'All Categories', value: '' },
                        { label: 'SUV', value: 'SUV' },
                        { label: 'Sedan', value: 'Sedan' },
                        { label: 'Coupe', value: 'Coupe' },
                    ]}
                />
                <Input
                    label="Min Price"
                    id="minPrice"
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                />
                <Input
                    label="Max Price"
                    id="maxPrice"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                />
            </Card>

            {error && <div className="text-red-500">{error}</div>}

            {isLoading ? (
                <div className="flex justify-center p-8"><LoadingSpinner className="w-full" /></div>
            ) : vehicles.length === 0 ? (
                <EmptyState
                    icon={<span className="text-4xl">🔍</span>}
                    title="No vehicles found"
                    description="Try adjusting your filters"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {vehicles.map((v) => (
                        <Card key={v.id} className="p-4">
                            <h3 className="font-bold text-lg">{v.make} {v.model}</h3>
                            <p className="text-sm text-slate-500">{v.category}</p>
                            <p className="mt-2 font-semibold">${v.price.toLocaleString()}</p>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
