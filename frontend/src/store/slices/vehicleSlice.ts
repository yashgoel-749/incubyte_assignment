import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Vehicle, VehicleFilters, VehicleState } from '../../types';

// ─── Initial State ─────────────────────────────────────────────────────────
const initialState: VehicleState = {
    vehicles: [],
    selectedVehicle: null,
    total: 0,
    page: 1,
    totalPages: 1,
    filters: { page: 1, limit: 12, sortBy: 'createdAt', sortOrder: 'desc' },
    isLoading: false,
    error: null,
};

// ─── Slice ─────────────────────────────────────────────────────────────────
const vehicleSlice = createSlice({
    name: 'vehicles',
    initialState,
    reducers: {
        /** Replace the full vehicle list (after a fetch) */
        setVehicles(
            state,
            action: PayloadAction<{ data: Vehicle[]; total: number; page: number; totalPages: number }>,
        ) {
            state.vehicles = action.payload.data;
            state.total = action.payload.total;
            state.page = action.payload.page;
            state.totalPages = action.payload.totalPages;
            state.isLoading = false;
            state.error = null;
        },

        /** Set the vehicle being viewed / edited */
        setSelectedVehicle(state, action: PayloadAction<Vehicle | null>) {
            state.selectedVehicle = action.payload;
        },

        /** Optimistically add a newly created vehicle */
        addVehicle(state, action: PayloadAction<Vehicle>) {
            state.vehicles.unshift(action.payload);
            state.total += 1;
        },

        /** Optimistically update an existing vehicle */
        updateVehicle(state, action: PayloadAction<Vehicle>) {
            const idx = state.vehicles.findIndex((v) => v.id === action.payload.id);
            if (idx !== -1) state.vehicles[idx] = action.payload;
            if (state.selectedVehicle?.id === action.payload.id) {
                state.selectedVehicle = action.payload;
            }
        },

        /** Optimistically remove a vehicle */
        removeVehicle(state, action: PayloadAction<string>) {
            state.vehicles = state.vehicles.filter((v) => v.id !== action.payload);
            state.total = Math.max(0, state.total - 1);
        },

        /** Merge / replace active filters */
        setFilters(state, action: PayloadAction<Partial<VehicleFilters>>) {
            state.filters = { ...state.filters, ...action.payload, page: 1 };
        },

        resetFilters(state) {
            state.filters = initialState.filters;
        },

        setVehicleLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
            if (action.payload) state.error = null;
        },

        setVehicleError(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
    // NOTE: extraReducers for fetchVehicles are NOT imported here to avoid a
    // circular dependency (vehicleSlice → vehicleThunks → vehicleService → api).
    // The fetchVehicles thunk manually dispatches setVehicleLoading / setVehicles
    // / setVehicleError instead.
});

export const {
    setVehicles,
    setSelectedVehicle,
    addVehicle,
    updateVehicle,
    removeVehicle,
    setFilters,
    resetFilters,
    setVehicleLoading,
    setVehicleError,
} = vehicleSlice.actions;

export default vehicleSlice.reducer;
