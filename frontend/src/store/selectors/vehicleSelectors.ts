import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

const selectVehiclesState = (state: RootState) => state.vehicles;

export const selectVehicleList = createSelector(
    [selectVehiclesState],
    (vehiclesState) => vehiclesState.vehicles,
);

export const selectVehicleLoading = createSelector(
    [selectVehiclesState],
    (vehiclesState) => vehiclesState.isLoading,
);

export const selectVehicleError = createSelector(
    [selectVehiclesState],
    (vehiclesState) => vehiclesState.error,
);

export const selectVehiclePagination = createSelector(
    [selectVehiclesState],
    (vehiclesState) => ({
        page: vehiclesState.page,
        totalPages: vehiclesState.totalPages,
        total: vehiclesState.total,
    }),
);

export const selectDashboardViewModel = createSelector(
    [selectVehicleList, selectVehicleLoading, selectVehicleError, selectVehiclePagination],
    (vehicles, isLoading, error, pagination) => ({
        vehicles,
        isLoading,
        error,
        ...pagination,
    }),
);
