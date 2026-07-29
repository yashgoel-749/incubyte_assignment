import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';
import { catchAsync } from '../utils/catchAsync';

/**
 * POST /api/auth/register
 */
export const register = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, password, role } = req.body;
    const newUser = await registerUser(email, password, role);

    res.status(201).json({
        message: 'User registered successfully',
        user: { email: newUser.email },
    });
});

/**
 * POST /api/auth/login
 */
export const login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const token = await loginUser(email, password);

    res.status(200).json({ token });
});

/**
 * GET /api/auth/me
 */
export const getMe = (req: Request, res: Response): void => {
    res.status(200).json(req.user);
};
