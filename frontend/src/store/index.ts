import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import vehicleReducer from './slices/vehicleSlice';

// ─── Root Store ────────────────────────────────────────────────────────────
export const store = configureStore({
    reducer: {
        auth: authReducer,
        vehicles: vehicleReducer,
    },
    // Redux Toolkit ships with redux-thunk by default.
    // Serializable-check middleware auto-enabled in dev.
    devTools: process.env.NODE_ENV !== 'production',
});

// ─── Inferred Types ────────────────────────────────────────────────────────
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
