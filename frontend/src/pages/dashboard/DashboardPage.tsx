import { Download, Plus, ClipboardList, CheckCircle, Tag, Banknote, ListFilter, ArrowDownUp } from 'lucide-react';
import { Button, Pagination } from '../../components/ui';
import { StatisticsCard, VehicleCard } from '../../components/dashboard';

const stats = [
    { id: '1', title: 'TOTAL VEHICLES', value: '1,240', subtext: '↗ 12.5% vs last month', icon: <ClipboardList size={18} /> },
    { id: '2', title: 'AVAILABLE STOCK', value: '850', subtext: '68.5% of total capacity', icon: <CheckCircle size={18} /> },
    { id: '3', title: 'VEHICLES SOLD', value: '390', subtext: '↗ 8.2% conversion rate', icon: <Tag size={18} /> },
    { id: '4', title: 'MONTHLY REVENUE', value: '₹12.4 Cr', subtext: 'Target: ₹15 Cr (82.6%)', icon: <Banknote size={18} />, variant: 'primary' as const },
];

const mockVehicles = [
    {
        id: 1,
        make: 'Tata',
        model: 'Safari Dark Edition',
        year: 2024,
        fuelType: 'Diesel',
        transmission: 'Automatic',
        price: 2750000,
        stock: 5,
        status: 'AVAILABLE' as const,
        imageUrl: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 2,
        make: 'Mahindra',
        model: 'XUV700 AX7',
        year: 2024,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        price: 2680000,
        stock: 2,
        status: 'AVAILABLE' as const,
        imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 3,
        make: 'Hyundai',
        model: 'Creta N Line',
        year: 2024,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        price: 2050000,
        stock: 8,
        status: 'AVAILABLE' as const,
        imageUrl: 'https://images.unsplash.com/photo-1629897048514-3dd7414df9fc?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 4,
        make: 'Kia',
        model: 'Seltos X-Line',
        year: 2024,
        fuelType: 'Diesel',
        transmission: 'Automatic',
        price: 2035000,
        stock: 0,
        status: 'IN_TRANSIT' as const,
        imageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=800&auto=format&fit=crop'
    }
];

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchVehicles } from '../../store/thunks/vehicleThunks';
import type { Vehicle } from '../../types';

export default function DashboardPage(props: {
    isLoading?: boolean;
    vehicles?: Vehicle[];
    error?: string | null;
    pagination?: { currentPage: number; totalPages: number };
}) {
    const dispatch = useAppDispatch();
    const storeVehiclesState = useAppSelector(state => state.vehicles);

    const displayLoading = props.isLoading ?? storeVehiclesState.isLoading;
    const displayVehicles = props.vehicles ?? storeVehiclesState.vehicles ?? [];
    const displayError = props.error ?? storeVehiclesState.error;

    const displayPage = props.pagination?.currentPage ?? storeVehiclesState.page ?? 1;
    const displayTotalPages = props.pagination?.totalPages ?? storeVehiclesState.totalPages ?? 1;

    useEffect(() => {
        // If testing props are provided, skip API fetch
        if (props.vehicles !== undefined || props.isLoading !== undefined || props.error !== undefined) return;

        dispatch(fetchVehicles());
    }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory Command Center</h2>
                    <p className="text-sm text-slate-500 mt-1">Real-time overview of your dealership's operational performance.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" leftIcon={<Download size={16} />}>Export Report</Button>
                    <Button variant="primary" leftIcon={<Plus size={16} />}>New Vehicle</Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(s => (
                    <StatisticsCard key={s.id} {...s} />
                ))}
            </div>

            {/* Filter Tabs & Toolbar */}
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
                    <Button variant="outline" size="sm" leftIcon={<ListFilter size={15} />} className="font-semibold text-slate-600">Filters</Button>
                    <Button variant="outline" size="sm" leftIcon={<ArrowDownUp size={15} />} className="font-semibold text-slate-600">Newest First</Button>
                </div>
            </div>

            {/* Error State */}
            {displayError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md">
                    {displayError}
                </div>
            )}

            {/* Content Area */}
            {!displayError && (
                <>
                    {displayLoading ? (
                        <div className="py-20 flex justify-center text-slate-500">
                            Loading vehicles...
                        </div>
                    ) : displayVehicles.length === 0 ? (
                        <div className="py-20 flex justify-center text-slate-500">
                            No vehicles available.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {displayVehicles.map(v => (
                                <VehicleCard
                                    key={v.id}
                                    make={v.make}
                                    model={v.model}
                                    year={v.year}
                                    fuelType={v.fuelType}
                                    transmission={v.transmission}
                                    price={v.price}
                                    stock={v.stock}
                                    status={v.status}
                                    imageUrl={v.imageUrl || 'https://via.placeholder.com/800'}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between pt-5 pb-8 border-t border-slate-200 mt-6 gap-4">
                        <p className="text-xs text-slate-500 font-semibold tracking-wide">
                            Showing {displayVehicles.length} of {storeVehiclesState.total || 850} available vehicles
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
