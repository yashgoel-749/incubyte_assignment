import { Request, Response, NextFunction } from 'express';

/**
 * Wraps an async Express route handler so that any rejected promise
 * is automatically forwarded to Express's next(error) chain.
 *
 * Usage:  router.post('/route', catchAsync(async (req, res) => { ... }));
 */
export const catchAsync = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        fn(req, res, next).catch(next);
    };
};
