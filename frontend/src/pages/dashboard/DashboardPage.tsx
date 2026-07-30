import { Download, Plus, ClipboardList, CheckCircle, Tag, Banknote, ListFilter, ArrowDownUp, PackageOpen } from 'lucide-react';
import { Button, Pagination, EmptyState, LoadingSpinner } from '../../components/ui';
import { StatisticsCard, VehicleCard } from '../../components/dashboard';
import { useDashboardViewModel, type DashboardViewModelProps } from '../../hooks/useDashboardViewModel';

const stats = [
    { id: '1', title: 'TOTAL VEHICLES', value: '1,240', subtext: '↗ 12.5% vs last month', icon: <ClipboardList size={18} /> },
    { id: '2', title: 'AVAILABLE STOCK', value: '850', subtext: '68.5% of total capacity', icon: <CheckCircle size={18} /> },
    { id: '3', title: 'VEHICLES SOLD', value: '390', subtext: '↗ 8.2% conversion rate', icon: <Tag size={18} /> },
    { id: '4', title: 'MONTHLY REVENUE', value: '₹12.4 Cr', subtext: 'Target: ₹15 Cr (82.6%)', icon: <Banknote size={18} />, variant: 'primary' as const },
];

export default function DashboardPage(props: DashboardViewModelProps) {
    const { vehicles, isLoading, error, page, totalPages, total } = useDashboardViewModel(props);

    const displayLoading = isLoading;
    const displayVehicles = vehicles;
    const displayError = error;
    const displayPage = page;
    const displayTotalPages = totalPages;
    const displayTotal = total || 850;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(s => (
                    <StatisticsCard key={s.id} {...s} />
                ))}
            </div>

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

            {displayError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md">
                    {displayError}
                </div>
            )}

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
