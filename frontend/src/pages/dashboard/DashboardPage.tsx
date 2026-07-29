import { Download, Plus, ClipboardList, CheckCircle, Tag, Banknote, ListFilter, SortDesc } from 'lucide-react';
import { Button } from '../../components/ui';
import { StatisticsCard, VehicleCard } from '../../components/dashboard';
import Pagination from '../../components/ui/Pagination';

const stats = [
    { id: '1', title: 'TOTAL VEHICLES', value: '1,240', subtext: '↗ 12.5% vs last month', icon: <ClipboardList size={18} /> },
    { id: '2', title: 'AVAILABLE STOCK', value: '850', subtext: '68.5% of total capacity', icon: <CheckCircle size={18} /> },
    { id: '3', title: 'VEHICLES SOLD', value: '390', subtext: '↗ 8.2% conversion rate', icon: <Tag size={18} /> },
    { id: '4', title: 'MONTHLY REVENUE', value: '$12.4M', subtext: 'Target: $15M (82.6%)', icon: <Banknote size={18} />, variant: 'primary' as const },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory Command Center</h2>
                    <p className="text-sm text-slate-500 mt-1">Real-time overview of your dealership's operational performance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" leftIcon={<Download size={16} />}>Export Report</Button>
                    <Button variant="primary" leftIcon={<Plus size={16} />}>New Vehicle</Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(s => (
                    <StatisticsCard key={s.id} {...s} />
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-slate-200 gap-4 mt-2 mb-2">
                <div className="flex items-center gap-6 overflow-x-auto">
                    {/* Custom interactive tabs replicating the screenshot */}
                    <button className="flex items-center gap-2 text-sm font-semibold text-blue-700 pb-2 border-b-2 border-blue-600 whitespace-nowrap">
                        All Stock <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none">1,240</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 pb-2 border-b-2 border-transparent whitespace-nowrap">
                        Luxury <span className="text-slate-400 text-xs">412</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 pb-2 border-b-2 border-transparent whitespace-nowrap">
                        Electric <span className="text-slate-400 text-xs">128</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 pb-2 border-b-2 border-transparent whitespace-nowrap">
                        In Transit <span className="text-slate-400 text-xs">45</span>
                    </button>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" leftIcon={<ListFilter size={14} />}>Filters</Button>
                    <Button variant="outline" size="sm" leftIcon={<SortDesc size={14} />}>Newest First</Button>
                </div>
            </div>

            {/* Vehicles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {[1, 2, 3, 4].map(id => (
                    <VehicleCard
                        key={id}
                        make="BMW" model="M4 Competition" year={2024} fuelType="Petrol" transmission="Automatic"
                        price={85000} stock={3}
                        statusStatus={id === 4 ? 'IN_TRANSIT' : 'AVAILABLE'}
                    />
                ))}
            </div>

            {/* Footer / Pagination */}
            <div className="flex items-center justify-between pt-4 pb-8 border-t border-slate-200 mt-6">
                <p className="text-xs text-slate-500 font-medium">Showing 1-12 of 850 available vehicles</p>
                <Pagination currentPage={1} totalPages={3} onPageChange={() => { }} />
            </div>
        </div>
    );
}
