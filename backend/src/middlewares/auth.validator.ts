import { Request, Response, NextFunction } from 'express';

export const validateRegistration = (req: Request, res: Response, next: NextFunction): void => {
    const { email, password } = req.body;

    if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
    }
    if (!password) {
        res.status(400).json({ error: 'Password is required' });
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
    }

    next();
};
