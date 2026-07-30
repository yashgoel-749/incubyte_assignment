import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '.';
import { selectDashboardViewModel } from '../store/selectors/vehicleSelectors';
import { fetchVehicles } from '../store/thunks/vehicleThunks';
import type { Vehicle } from '../types';

export interface DashboardViewModelProps {
    isLoading?: boolean;
    vehicles?: Vehicle[];
    error?: string | null;
    pagination?: {
        currentPage: number;
        totalPages: number;
    };
}

export interface DashboardViewModel {
    vehicles: Vehicle[];
    isLoading: boolean;
    error: string | null;
    page: number;
    totalPages: number;
    total: number;
}

export function useDashboardViewModel({
    isLoading,
    vehicles,
    error,
    pagination,
}: DashboardViewModelProps): DashboardViewModel {
    const dispatch = useAppDispatch();
    const dashboardState = useAppSelector(selectDashboardViewModel);

    const resolvedVehicles = vehicles ?? dashboardState.vehicles ?? [];
    const resolvedLoading = isLoading ?? dashboardState.isLoading ?? false;
    const resolvedError = error ?? dashboardState.error ?? null;
    const resolvedPage = pagination?.currentPage ?? dashboardState.page ?? 1;
    const resolvedTotalPages = pagination?.totalPages ?? dashboardState.totalPages ?? 1;
    const resolvedTotal = dashboardState.total ?? 0;

    useEffect(() => {
        if (vehicles !== undefined || isLoading !== undefined || error !== undefined) {
            return;
        }

        dispatch(fetchVehicles());
    }, [dispatch, vehicles, isLoading, error]);

    return {
        vehicles: resolvedVehicles,
        isLoading: resolvedLoading,
        error: resolvedError,
        page: resolvedPage,
        totalPages: resolvedTotalPages,
        total: resolvedTotal,
    };
}
