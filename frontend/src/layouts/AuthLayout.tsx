import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { ROUTES } from '../utils/constants';

export default function AuthLayout() {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) return <Navigate to={ROUTES.DASHBOARD} replace />;

    return (
        <div className="flex min-h-screen bg-slate-50">
            <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 items-center justify-center p-12 overflow-hidden">
                {/* Simple decoratives */}
                <div className="absolute top-0 left-0 w-full h-full bg-blue-700/20 backdrop-blur-3xl" />
                <div className="relative z-10 text-white max-w-lg">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">AutoCommand</h1>
                    <p className="text-blue-100 text-lg leading-relaxed">
                        The Executive Suite for modern dealerships. Manage inventory seamlessly and track your revenue in real-time.
                    </p>
                </div>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
