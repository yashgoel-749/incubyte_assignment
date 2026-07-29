import { z } from 'zod';

export const createVehicleSchema = z.object({
    make: z.string().min(1, 'Make is required'),
    model: z.string().min(1, 'Model is required'),
    year: z.number().int().positive('Year must be valid'),
    price: z.number().positive('Price must be positive'),
    status: z.string().optional().default('AVAILABLE'),
    category: z.string().optional()
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;

// ── Update schema (full replacement, same field rules) ───────────
export const updateVehicleSchema = z.object({
    make: z.string().min(1, 'Make is required').optional(),
    model: z.string().min(1, 'Model is required').optional(),
    year: z.number().int().positive('Year must be valid').optional(),
    price: z.number().positive('Price must be positive').optional(),
    status: z.string().optional(),
    category: z.string().optional()
});

export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
