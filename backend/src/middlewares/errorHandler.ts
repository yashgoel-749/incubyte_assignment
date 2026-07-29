import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

/**
 * Centralized Express error-handling middleware.
 * Must have the 4-argument signature so Express recognises it as an error handler.
 *
 * - AppError (operational) → respond with its statusCode + message
 * - Unknown errors         → respond with 500 + generic message
 */
export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
    }

    // Unexpected / programming error — don't leak details
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
};
