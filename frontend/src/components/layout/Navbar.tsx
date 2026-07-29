import { useState } from 'react';
import { Search, Bell, Sun, Moon, Menu } from 'lucide-react';
import { useAuth } from '../../hooks';
import { getInitials } from '../../utils/formatters';

interface NavbarProps {
    onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
    const { user } = useAuth();
    const [isDark, setIsDark] = useState(true);

    return (
        <header
            id="top-navbar"
            className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 lg:px-6"
        >
            {/* Mobile hamburger */}
            <button
                id="mobile-menu-btn"
                onClick={onMenuClick}
                className="lg:hidden text-slate-400 hover:text-slate-100 transition-colors"
                aria-label="Open navigation menu"
            >
                <Menu size={22} />
            </button>

            {/* ── Search bar ────────────────────────────────────────────── */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        id="navbar-search"
                        type="search"
                        placeholder="Search VIN, model or client…"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                    />
                </div>
            </div>

            {/* ── Right actions ─────────────────────────────────────────── */}
            <div className="ml-auto flex items-center gap-2">
                {/* Notification bell */}
                <button
                    id="navbar-notifications"
                    className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all"
                    aria-label="Notifications"
                >
                    <Bell size={18} />
                    {/* Unread dot */}
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500" />
                </button>

                {/* Theme toggle */}
                <button
                    id="navbar-theme-toggle"
                    onClick={() => setIsDark((d) => !d)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all"
                    aria-label="Toggle theme"
                >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* User avatar */}
                <button
                    id="navbar-user-menu"
                    className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-slate-800 transition-all"
                    aria-label="User menu"
                >
                    {user?.avatarUrl ? (
                        <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500/40"
                        />
                    ) : (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                            {user ? getInitials(user.name) : 'U'}
                        </span>
                    )}
                    <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-slate-100 leading-none">{user?.name ?? 'User'}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{user?.role ?? ''}</p>
                    </div>
                </button>
            </div>
        </header>
    );
}
