import { z } from 'zod';

// Reusable Zod v4 schema for the registration payload
export const registerSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email format'),
    password: z
        .string()
        .min(1, 'Password is required'),
});

// Infer the TypeScript type from the schema
export type RegisterInput = z.infer<typeof registerSchema>;
