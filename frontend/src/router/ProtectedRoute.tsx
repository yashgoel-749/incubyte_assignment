import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks';
import { ROUTES } from '../utils/constants';
import { Spinner } from '../components/ui';

interface ProtectedRouteProps {
    /** If provided, only users with one of these roles can access the route */
    allowedRoles?: Array<'ADMIN' | 'MANAGER' | 'SALES'>;
}

/**
 * ProtectedRoute
 * ─────────────────────────────────────────────────────────────────────────
 * 1. Shows a spinner while auth state is resolving.
 * 2. Redirects unauthenticated users to /login (preserving the return URL).
 * 3. If allowedRoles is specified, redirects unauthorised users to /dashboard.
 * 4. Renders <Outlet /> for all valid users.
 */
export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    // While checking token / rehydrating
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <Spinner size="lg" label="Authenticating…" />
            </div>
        );
    }

    // Not logged in → go to login and remember where we came from
    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    // Role-based guard
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    return <Outlet />;
}
