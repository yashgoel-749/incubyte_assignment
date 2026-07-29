import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';
import { AppError } from '../errors/AppError';

/**
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const newUser = await registerUser(email, password);

        res.status(201).json({
            message: 'User registered successfully',
            user: { email: newUser.email },
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const token = await loginUser(email, password);

        res.status(200).json({ token });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * GET /api/auth/me
 */
export const getMe = (req: Request, res: Response): void => {
    res.status(200).json(req.user);
};
