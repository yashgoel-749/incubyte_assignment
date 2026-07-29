import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError';

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
 *
 * Errors are forwarded to the centralized error handler via next().
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return next(new AppError('Authentication token is required', 401));
    }

    const token = header.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'dev-secret';

    try {
        const decoded = jwt.verify(token, secret) as AuthPayload;
        req.user = decoded;
        next();
    } catch {
        next(new AppError('Invalid or expired token', 401));
    }
};
