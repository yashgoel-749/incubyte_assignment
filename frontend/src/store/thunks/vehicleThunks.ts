import { createAsyncThunk } from '@reduxjs/toolkit';
import { vehicleService } from '../../services';
import { extractErrorMessage } from '../../services/api';
import { setVehicleLoading, setVehicles, setVehicleError } from '../slices/vehicleSlice';
import type { VehicleFilters } from '../../types';

// ─── Shared thunk config ───────────────────────────────────────────────────
type ThunkConfig = { rejectValue: string };

// ─── Fetch Vehicles ────────────────────────────────────────────────────────
/**
 * fetchVehicles — async thunk that calls GET /api/vehicles.
 * Manually dispatches slice actions to avoid circular module dependencies (where slice imports thunk).
 */
export const fetchVehicles = createAsyncThunk<
    void,
    VehicleFilters | undefined,
    ThunkConfig
>(
    'vehicles/fetchAll',
    async (filters, { dispatch, rejectWithValue }) => {
        try {
            dispatch(setVehicleLoading(true));
            const response = await vehicleService.getAll(filters);
            dispatch(setVehicles(response));
        } catch (error) {
            const errorMsg = extractErrorMessage(error, 'Failed to load vehicles');
            dispatch(setVehicleError(errorMsg));
            return rejectWithValue(errorMsg);
        }
    },
);
