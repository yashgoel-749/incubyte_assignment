import { z } from 'zod';

// ── Shared field definitions ────────────────────────────────────
const emailField = z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format');

const passwordField = z
    .string()
    .min(1, 'Password is required');

// ── Endpoint schemas ────────────────────────────────────────────
export const registerSchema = z.object({
    email: emailField,
    password: passwordField,
});

export const loginSchema = z.object({
    email: emailField,
    password: passwordField,
});

// ── Inferred TypeScript types ───────────────────────────────────
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
