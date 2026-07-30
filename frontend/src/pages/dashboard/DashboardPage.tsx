import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Plus, ClipboardList, CheckCircle, Tag, Banknote, ListFilter, ArrowDownUp, PackageOpen } from 'lucide-react';
import { Button, Pagination, EmptyState, LoadingSpinner, Input, Select } from '../../components/ui';
import { StatisticsCard, VehicleCard } from '../../components/dashboard';
import { useAppDispatch, useAuth } from '../../hooks';
import vehicleService from '../../services/vehicleService';
import { removeVehicle } from '../../store/slices/vehicleSlice';
import { useDashboardViewModel, type DashboardViewModelProps } from '../../hooks/useDashboardViewModel';
import { ROUTES } from '../../utils/constants';

const stats = [
    { id: '1', title: 'TOTAL VEHICLES', value: '1,240', subtext: '↗ 12.5% vs last month', icon: <ClipboardList size={18} /> },
    { id: '2', title: 'AVAILABLE STOCK', value: '850', subtext: '68.5% of total capacity', icon: <CheckCircle size={18} /> },
    { id: '3', title: 'VEHICLES SOLD', value: '390', subtext: '↗ 8.2% conversion rate', icon: <Tag size={18} /> },
    { id: '4', title: 'MONTHLY REVENUE', value: '₹12.4 Cr', subtext: 'Target: ₹15 Cr (82.6%)', icon: <Banknote size={18} />, variant: 'primary' as const },
];

const CATEGORY_OPTIONS = [
    { label: 'All Categories', value: '' },
    { label: 'SUV', value: 'SUV' },
    { label: 'Sedan', value: 'Sedan' },
    { label: 'Coupe', value: 'Coupe' },
    { label: 'MPV', value: 'MPV' },
    { label: 'Hatchback', value: 'Hatchback' },
    { label: 'Luxury', value: 'Luxury' },
];

export default function DashboardPage(props: DashboardViewModelProps) {
    const {
        vehicles, isLoading, error, page, totalPages, total,
        make, setMake,
        model, setModel,
        category, setCategory,
        minPrice, setMinPrice,
        maxPrice, setMaxPrice,
    } = useDashboardViewModel(props);

    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [showFilters, setShowFilters] = useState(true);

    const handleNewVehicle = () => navigate(ROUTES.ADD_VEHICLE);
    const handleEditVehicle = (id?: string) => {
        if (!id) return;
        navigate(ROUTES.EDIT_VEHICLE.replace(':id', id));
    };
    const handleDeleteVehicle = async (id?: string) => {
        if (!id) return;
        const confirmed = window.confirm('Are you sure you want to delete this vehicle?');
        if (!confirmed) return;

        try {
            await vehicleService.remove(id);
            dispatch(removeVehicle(id));
        } catch (error) {
            console.error('Failed to delete vehicle', error);
        }
    };

    const displayLoading = isLoading;
    const displayVehicles = vehicles;
    const displayError = error;
    const displayPage = page;
    const displayTotalPages = totalPages;
    const displayTotal = total || 850;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory Command Center</h2>
                    <p className="text-sm text-slate-500 mt-1">Real-time overview of your dealership's operational performance.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" leftIcon={<Download size={16} />}>Export Report</Button>
                    {isAdmin && (
                        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={handleNewVehicle}>
                            New Vehicle
                        </Button>
                    )}
                </div>
            </div>

            {/* ── Stats ────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(s => (
                    <StatisticsCard key={s.id} {...s} />
                ))}
            </div>

            {/* ── Search Filters ───────────────────────────────────────── */}
            {showFilters && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
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
                        options={CATEGORY_OPTIONS}
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
                </div>
            </div>
            )}

            {/* ── Tab Bar ──────────────────────────────────────────────── */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-2 border-b border-slate-200 mt-2 mb-4">
                <div className="flex flex-nowrap items-center gap-6 overflow-x-auto no-scrollbar w-full">
                    <button className="flex items-center gap-2 text-sm font-bold text-emerald-700 pb-2.5 border-b-2 border-emerald-600 whitespace-nowrap">
                        All Stock <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">1,240</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors pb-2.5 border-b-2 border-transparent whitespace-nowrap">
                        SUV <span className="text-slate-400 text-xs">840</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors pb-2.5 border-b-2 border-transparent whitespace-nowrap">
                        Sedan <span className="text-slate-400 text-xs">210</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors pb-2.5 border-b-2 border-transparent whitespace-nowrap">
                        In Transit <span className="text-slate-400 text-xs">45</span>
                    </button>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Button
                        variant="outline" size="sm"
                        leftIcon={<ListFilter size={15} />}
                        className="font-semibold text-slate-600"
                        onClick={() => setShowFilters(f => !f)}
                    >
                        Filters
                    </Button>
                    <Button variant="outline" size="sm" leftIcon={<ArrowDownUp size={15} />} className="font-semibold text-slate-600">Newest First</Button>
                </div>
            </div>

            {/* ── Error ────────────────────────────────────────────────── */}
            {displayError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md">
                    {displayError}
                </div>
            )}

            {/* ── Vehicle Grid ─────────────────────────────────────────── */}
            {!displayError && (
                <>
                    {displayLoading ? (
                        <LoadingSpinner label="Loading vehicles..." />
                    ) : displayVehicles.length === 0 ? (
                        <EmptyState
                            icon={<PackageOpen size={28} />}
                            title="No vehicles available."
                            description="Your inventory is currently empty. Add a new vehicle to get started."
                        />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {displayVehicles.map((vehicle) => (
                                <VehicleCard
                                    key={vehicle.id}
                                    vehicle={vehicle as any}
                                    onEdit={() => handleEditVehicle(vehicle.id)}
                                    onDelete={() => handleDeleteVehicle(vehicle.id)}
                                />
                            ))}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center justify-between pt-5 pb-8 border-t border-slate-200 mt-6 gap-4">
                        <p className="text-xs text-slate-500 font-semibold tracking-wide">
                            Showing {displayVehicles.length} of {displayTotal} available vehicles
                        </p>
                        <Pagination
                            currentPage={displayPage}
                            totalPages={displayTotalPages}
                            onPageChange={() => { }}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
