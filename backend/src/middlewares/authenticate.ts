import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Extend Express Request to carry the authenticated user payload.
 */
export interface AuthPayload {
    id: number;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

/**
 * Reusable JWT authentication middleware.
 * Extracts the Bearer token from the Authorization header,
 * verifies it, and attaches the decoded payload to req.user.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Authentication token is required' });
        return;
    }

    const token = header.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'dev-secret';

    try {
        const decoded = jwt.verify(token, secret) as AuthPayload;
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};
