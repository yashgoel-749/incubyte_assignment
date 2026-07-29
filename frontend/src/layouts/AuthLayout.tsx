import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { ROUTES } from '../utils/constants';
import { Zap } from 'lucide-react';

/**
 * AuthLayout
 * ─────────────────────────────────────────────────────────────────────────
 * Wraps /login and /register with a centered, full-height split layout:
 *   Left  — brand panel with gradient background (hidden on mobile)
 *   Right — form panel via <Outlet />
 *
 * If the user is already authenticated, redirects to /dashboard.
 */
export default function AuthLayout() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    return (
        <div className="flex min-h-screen bg-slate-950">
            {/* ── Brand panel (desktop only) ───────────────────────────── */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 items-center justify-center">
                {/* Decorative blobs */}
                <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
                <div className="absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />

                <div className="relative z-10 text-center px-12">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-xl shadow-blue-900/60">
                        <Zap size={28} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-white mb-3">AutoCommand</h1>
                    <p className="text-slate-400 text-lg">Executive Suite</p>
                    <p className="mt-4 text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                        Real-time overview of your dealership's operational performance.
                    </p>
                </div>
            </div>

            {/* ── Form panel ───────────────────────────────────────────── */}
            <div className="flex flex-1 flex-col items-center justify-center p-6 lg:p-12">
                {/* Mobile brand */}
                <div className="mb-8 flex items-center gap-3 lg:hidden">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
                        <Zap size={17} className="text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">AutoCommand</span>
                </div>

                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
