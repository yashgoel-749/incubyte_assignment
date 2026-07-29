import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Car,
    PlusCircle,
    Package,
    ShoppingCart,
    User,
    Settings,
    LogOut,
    Zap,
} from 'lucide-react';
import { useAuth } from '../../hooks';
import { ROUTES } from '../../utils/constants';

// ─── Nav item definition ───────────────────────────────────────────────────
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

// ─── Active link style helper ──────────────────────────────────────────────
function linkClass({ isActive }: { isActive: boolean }) {
    return [
        'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium',
        'transition-all duration-200 group',
        isActive
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
            : 'text-slate-400 hover:bg-slate-700/60 hover:text-slate-100',
    ].join(' ');
}

// ─── Component ────────────────────────────────────────────────────────────
interface SidebarProps {
    isOpen: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { handleLogout } = useAuth();
    const navigate = useNavigate();

    function handleLogoutClick() {
        handleLogout();
        navigate(ROUTES.LOGIN, { replace: true });
    }

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar panel */}
            <aside
                id="sidebar"
                className={[
                    // Layout
                    'fixed top-0 left-0 z-30 h-full w-64',
                    'flex flex-col',
                    // Background
                    'bg-slate-900 border-r border-slate-800',
                    // Mobile slide-in
                    'transition-transform duration-300 ease-in-out',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                    // Desktop always visible
                    'lg:translate-x-0 lg:static lg:z-auto',
                ].join(' ')}
                aria-label="Main navigation"
            >
                {/* ── Brand ─────────────────────────────────────────────────── */}
                <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-900/50">
                        <Zap size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-white leading-none">AutoCommand</h1>
                        <p className="text-[10px] text-slate-500 mt-0.5">Executive Suite</p>
                    </div>
                </div>

                {/* ── Nav Links ─────────────────────────────────────────────── */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={linkClass}
                            onClick={onClose}
                        >
                            <span className="shrink-0">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* ── Logout ────────────────────────────────────────────────── */}
                <div className="px-3 pb-4 border-t border-slate-800 pt-3">
                    <button
                        id="sidebar-logout-btn"
                        onClick={handleLogoutClick}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 w-full transition-all duration-200"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
