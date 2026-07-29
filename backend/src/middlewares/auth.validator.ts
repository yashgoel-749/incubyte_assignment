import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';
import { registerSchema, loginSchema } from '../validators/auth.schema';

/**
 * Generic Zod validation middleware factory.
 * Eliminates copy-paste validation handlers for every endpoint.
 */
const validate = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const firstIssue = result.error.issues[0];
            res.status(400).json({ error: firstIssue.message });
            return;
        }

        req.body = result.data;
        next();
    };
};

// ── Exported middleware instances ────────────────────────────────
export const validateRegistration = validate(registerSchema);
export const validateLogin = validate(loginSchema);
