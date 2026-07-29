import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

/**
 * Generic Zod validation middleware factory.
 * Eliminates copy-paste validation handlers across different endpoints.
 */
export const validate = (schema: ZodType) => {
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
