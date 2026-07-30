import { useEffect, useState } from 'react';
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
    // ── Search filters ────────────────────────────────────────────
    make: string;
    model: string;
    category: string;
    minPrice: string;
    maxPrice: string;
    setMake: (v: string) => void;
    setModel: (v: string) => void;
    setCategory: (v: string) => void;
    setMinPrice: (v: string) => void;
    setMaxPrice: (v: string) => void;
}

export function useDashboardViewModel({
    isLoading,
    vehicles,
    error,
    pagination,
}: DashboardViewModelProps): DashboardViewModel {
    const dispatch = useAppDispatch();
    const dashboardState = useAppSelector(selectDashboardViewModel);
    // Read global search query set by the Navbar
    const globalSearch = useAppSelector(s => s.vehicles.globalSearch);

    // ── Local filter state ────────────────────────────────────────
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const resolvedVehicles = vehicles ?? dashboardState.vehicles ?? [];
    const resolvedLoading = isLoading ?? dashboardState.isLoading ?? false;
    const resolvedError = error ?? dashboardState.error ?? null;
    const resolvedPage = pagination?.currentPage ?? dashboardState.page ?? 1;
    const resolvedTotalPages = pagination?.totalPages ?? dashboardState.totalPages ?? 1;
    const resolvedTotal = dashboardState.total ?? 0;

    useEffect(() => {
        // If test props are being injected, skip real fetching.
        if (vehicles !== undefined || isLoading !== undefined || error !== undefined) {
            return;
        }

        dispatch(fetchVehicles({
            // Global Navbar search (takes priority — searches across make & model)
            q: globalSearch || undefined,
            // Field-level filters
            make: make || undefined,
            model: model || undefined,
            category: category || undefined,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
        }));
    }, [dispatch, vehicles, isLoading, error, globalSearch, make, model, category, minPrice, maxPrice]);

    return {
        vehicles: resolvedVehicles,
        isLoading: resolvedLoading,
        error: resolvedError,
        page: resolvedPage,
        totalPages: resolvedTotalPages,
        total: resolvedTotal,
        make, setMake,
        model, setModel,
        category, setCategory,
        minPrice, setMinPrice,
        maxPrice, setMaxPrice,
    };
}
