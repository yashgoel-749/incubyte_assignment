// ─── Application-wide constants ───────────────────────────────────────────

/** Base URL for the backend REST API (overridden via .env VITE_API_BASE_URL) */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

/** localStorage keys */
export const STORAGE_KEYS = {
    TOKEN: 'ac_token',
    USER: 'ac_user',
} as const;

/** Navigation route paths — single source of truth */
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    VEHICLES: '/vehicles',
    VEHICLE_DETAIL: '/vehicles/:id',
    EDIT_VEHICLE: '/vehicles/:id/edit',
    ADD_VEHICLE: '/vehicles/new',
    INVENTORY: '/inventory',
    PURCHASES: '/purchases',
    PROFILE: '/profile',
    SETTINGS: '/settings',
} as const;

/** Vehicle filter tab labels shown in the dashboard */
export const STOCK_TABS = ['All Stock', 'Luxury', 'Electric', 'In Transit'] as const;

/** Default pagination */
export const DEFAULT_PAGE_SIZE = 12;
