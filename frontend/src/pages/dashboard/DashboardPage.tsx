import { TrendingUp, Car, ShoppingBag, DollarSign } from 'lucide-react';
import { Card, Badge } from '../../components/ui';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';

// ─── Stat card data (static until API connected) ──────────────────────────
const stats = [
    { id: 'total-vehicles', label: 'Total Vehicles', value: 1240, delta: '+12.5% vs last month', icon: <Car size={20} />, color: 'text-blue-400' },
    { id: 'available-stock', label: 'Available Stock', value: 850, delta: '68.5% of total capacity', icon: <ShoppingBag size={20} />, color: 'text-green-400' },
    { id: 'vehicles-sold', label: 'Vehicles Sold', value: 390, delta: '↑ 8.2% conversion rate', icon: <TrendingUp size={20} />, color: 'text-amber-400' },
];

/**
 * DashboardPage
 * ─────────────────────────────────────────────────────────────────────────
 * Architecture stub matching the "Inventory Command Center" screenshot.
 * Static data — API integration in Sprint 3.
 */
export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* ── Page header ─────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-slate-100">Inventory Command Center</h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                        Real-time overview of your dealership's operational performance.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        id="export-report-btn"
                        className="flex items-center gap-2 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-300 hover:border-slate-500 transition-all"
                    >
                        ↓ Export Report
                    </button>
                    <button
                        id="add-vehicle-header-btn"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 text-sm text-white font-medium transition-all"
                    >
                        + New Vehicle
                    </button>
                </div>
            </div>

            {/* ── Stat cards ──────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.id} padding="md">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                                    {stat.label}
                                </p>
                                <p className="mt-1.5 text-3xl font-bold text-slate-100">
                                    {stat.value.toLocaleString()}
                                </p>
                                <p className="mt-1 text-xs text-slate-400">{stat.delta}</p>
                            </div>
                            <span className={`${stat.color} opacity-80`}>{stat.icon}</span>
                        </div>
                    </Card>
                ))}

                {/* Revenue card — highlighted */}
                <Card padding="md" className="bg-blue-600 border-blue-500/50">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">
                                Monthly Revenue
                            </p>
                            <p className="mt-1.5 text-3xl font-bold text-white">
                                {formatCompactCurrency(12_400_000)}
                            </p>
                            <p className="mt-1 text-xs text-blue-200">
                                Target: $15M (82.6%)
                            </p>
                        </div>
                        <DollarSign size={20} className="text-blue-200 opacity-80" />
                    </div>
                </Card>
            </div>

            {/* ── Filter tabs (placeholder) ───────────────────────────── */}
            <div className="flex flex-wrap items-center gap-2">
                {['All Stock', 'Luxury', 'Electric', 'In Transit'].map((tab, i) => (
                    <button
                        key={tab}
                        id={`stock-tab-${tab.toLowerCase().replace(' ', '-')}`}
                        className={[
                            'rounded-full px-4 py-1.5 text-xs font-medium transition-all',
                            i === 0
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700',
                        ].join(' ')}
                    >
                        {tab}
                    </button>
                ))}
                <span className="ml-auto text-xs text-slate-500">
                    Showing 1–12 of 850 available vehicles
                </span>
            </div>

            {/* ── Vehicle grid placeholder ─────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} hoverable padding="none" className="overflow-hidden">
                        {/* Placeholder image */}
                        <div className="h-40 bg-slate-800 flex items-center justify-center relative">
                            <Badge variant="success" dot className="absolute top-2 left-2">AVAILABLE</Badge>
                            <Car size={40} className="text-slate-700" />
                        </div>
                        <div className="p-4 space-y-2">
                            <p className="font-semibold text-slate-100 text-sm">BMW M4 Competition</p>
                            <p className="text-xs text-slate-500">2024 · Petrol · Automatic</p>
                            <p className="text-lg font-bold text-slate-100">
                                {formatCurrency(85000)}
                                <span className="ml-2 text-xs font-normal text-slate-500">3 in stock</span>
                            </p>
                            <div className="flex gap-2 pt-1">
                                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md py-1.5 font-medium transition-all">
                                    Purchase
                                </button>
                                <button className="px-3 text-xs text-slate-400 hover:text-slate-100 border border-slate-700 rounded-md transition-all">
                                    Edit
                                </button>
                                <button className="px-3 text-xs text-red-400 hover:text-red-300 border border-slate-700 rounded-md transition-all">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* ── Pagination ───────────────────────────────────────────── */}
            <div className="flex justify-end gap-1">
                {[1, 2, 3].map((p) => (
                    <button
                        key={p}
                        className={[
                            'h-8 w-8 rounded-lg text-sm font-medium transition-all',
                            p === 1 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800',
                        ].join(' ')}
                    >
                        {p}
                    </button>
                ))}
            </div>
        </div>
    );
}
