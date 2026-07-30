import { Outlet, Navigate } from 'react-router-dom';
import { Car } from 'lucide-react';
import { useAuth } from '../hooks';
import { ROUTES } from '../utils/constants';

export default function AuthLayout() {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) return <Navigate to={ROUTES.DASHBOARD} replace />;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative items-center justify-center p-4">

            {/* Brand Header */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8">
                <h1 className="text-xl font-bold text-emerald-700 flex items-center gap-2 tracking-tight">
                    <Car size={22} className="text-emerald-700" />
                    Premium Deluxe Motors
                </h1>
            </div>

            <div className="w-full max-w-[400px]">
                <Outlet />
            </div>

            {/* Footer Indicators */}
            <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 box-content ring-2 ring-emerald-400/20" />
                    System Operational
                </span>
                <span className="flex items-center gap-1.5 opacity-80">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    AES-256 Secured
                </span>
            </div>

        </div>
    );
}
