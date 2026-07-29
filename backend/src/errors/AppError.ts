/**
 * Custom application error with an HTTP status code.
 * Thrown by services and middleware, caught by the centralized error handler.
 *
 * isOperational = true  → expected business error (bad input, not found, etc.)
 * isOperational = false → unexpected / programming error
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
