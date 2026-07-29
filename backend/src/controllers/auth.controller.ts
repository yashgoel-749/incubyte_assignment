import { Request, Response } from 'express';
import { registerUser } from '../services/auth.service';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email) {
            res.status(400).json({ error: 'Email is required' });
            return;
        }
        if (!password) {
            res.status(400).json({ error: 'Password is required' });
            return;
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: 'Invalid email format' });
            return;
        }

        const unsecureUser = await registerUser(email, password);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                email: unsecureUser.email
            }
        });
    } catch (error: any) {
        if (error.message === 'Email is already registered') {
            res.status(409).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};
