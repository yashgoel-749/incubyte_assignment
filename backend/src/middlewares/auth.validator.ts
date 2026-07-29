import { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from '../validators/auth.schema';

export const validateRegistration = (req: Request, res: Response, next: NextFunction): void => {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
        // Zod v4 uses .issues (previously .errors)
        const firstIssue = result.error.issues[0];
        res.status(400).json({ error: firstIssue.message });
        return;
    }

    // Replace req.body with the safely parsed + typed data
    req.body = result.data;
    next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        const firstIssue = result.error.issues[0];
        res.status(400).json({ error: firstIssue.message });
        return;
    }

    req.body = result.data;
    next();
};
