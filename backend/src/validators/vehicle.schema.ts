import { z } from 'zod';

export const createVehicleSchema = z.object({
    make: z.string().min(1, 'Make is required'),
    model: z.string().min(1, 'Model is required'),
    year: z.number().int().positive('Year must be valid'),
    price: z.number().positive('Price must be positive'),
    status: z.string().optional().default('AVAILABLE')
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
