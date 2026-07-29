import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import { AuthLayout } from '../layouts';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import { Spinner } from '../components/ui';
import { ROUTES } from '../utils/constants';

// ─── Lazy-loaded pages ────────────────────────────────────────────────────
// Code-split every page so the initial bundle stays small.
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const VehiclesPage = lazy(() => import('../pages/vehicles/VehiclesPage'));
const AddVehiclePage = lazy(() => import('../pages/vehicles/AddVehiclePage'));
const VehicleDetailPage = lazy(() => import('../pages/vehicles/VehicleDetailPage'));
const InventoryPage = lazy(() => import('../pages/inventory/InventoryPage'));
const PurchasesPage = lazy(() => import('../pages/purchases/PurchasesPage'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// ─── Suspense fallback ────────────────────────────────────────────────────
function PageLoader() {
    return (
        <div className="flex h-full min-h-64 items-center justify-center">
            <Spinner size="lg" />
        </div>
    );
}

// ─── Router definition ────────────────────────────────────────────────────
const router = createBrowserRouter([
    // ── Public root: redirect / → /login ──────────────────────────
    {
        path: ROUTES.HOME,
        element: <Navigate to={ROUTES.LOGIN} replace />,
    },

    // ── Auth routes ───────────────────────────────────────────────
    {
        element: <AuthLayout />,
        children: [
            {
                path: ROUTES.LOGIN,
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <LoginPage />
                    </Suspense>
                ),
            },
            {
                path: ROUTES.REGISTER,
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <RegisterPage />
                    </Suspense>
                ),
            },
        ],
    },

    // ── Protected dashboard routes ────────────────────────────────
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    {
                        path: ROUTES.DASHBOARD,
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <DashboardPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: ROUTES.VEHICLES,
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <VehiclesPage />
                            </Suspense>
                        ),
                    },
                    {
                        // Admin / Manager only
                        element: <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']} />,
                        children: [
                            {
                                path: ROUTES.ADD_VEHICLE,
                                element: (
                                    <Suspense fallback={<PageLoader />}>
                                        <AddVehiclePage />
                                    </Suspense>
                                ),
                            },
                        ],
                    },
                    {
                        path: ROUTES.VEHICLE_DETAIL,
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <VehicleDetailPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: ROUTES.INVENTORY,
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <InventoryPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: ROUTES.PURCHASES,
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <PurchasesPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: ROUTES.PROFILE,
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <ProfilePage />
                            </Suspense>
                        ),
                    },
                    {
                        path: ROUTES.SETTINGS,
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <SettingsPage />
                            </Suspense>
                        ),
                    },
                ],
            },
        ],
    },

    // ── 404 catch-all ─────────────────────────────────────────────
    {
        path: '*',
        element: (
            <Suspense fallback={<PageLoader />}>
                <NotFoundPage />
            </Suspense>
        ),
    },
]);

export default router;
