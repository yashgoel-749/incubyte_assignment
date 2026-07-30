import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Car, PlusCircle, Package, ShoppingCart, User, Settings, LogOut, Zap
} from 'lucide-react';
import { useAuth } from '../../hooks';
import { ROUTES } from '../../utils/constants';

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: <LayoutDashboard size={18} /> },
    { label: 'Vehicles', path: ROUTES.VEHICLES, icon: <Car size={18} /> },
    { label: 'Add Vehicle', path: ROUTES.ADD_VEHICLE, icon: <PlusCircle size={18} /> },
    { label: 'Inventory', path: ROUTES.INVENTORY, icon: <Package size={18} /> },
    { label: 'Purchases', path: ROUTES.PURCHASES, icon: <ShoppingCart size={18} /> },
    { label: 'Profile', path: ROUTES.PROFILE, icon: <User size={18} /> },
    { label: 'Settings', path: ROUTES.SETTINGS, icon: <Settings size={18} /> },
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose?: () => void }) {
    const { handleLogout } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            {isOpen && <div className="fixed inset-0 z-20 bg-slate-900/50 lg:hidden" onClick={onClose} />}

            <aside
                className={[
                    'fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col',
                    'transition-transform duration-300 ease-in-out',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                    'lg:translate-x-0 lg:static lg:z-auto'
                ].join(' ')}
            >
                <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200">
                    <h1 className="text-xl font-bold text-emerald-700 tracking-tight">
                        Premium Deluxe Motors
                        <span className="block text-[10px] uppercase font-semibold tracking-wider text-slate-400 mt-0.5">
                            Executive Suite
                        </span>
                    </h1>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) => [
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            ].join(' ')}
                        >
                            <span className="shrink-0">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <button
                        onClick={() => { handleLogout(); navigate(ROUTES.LOGIN); }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
