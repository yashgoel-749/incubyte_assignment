// ─── Barrel export for all domain types ───────────────────────────────────
export * from './auth.types';
export * from './vehicle.types';

// ─── Shared / Generic API types ───────────────────────────────────────────

export interface ApiError {
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
}

export interface PaginatedMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
