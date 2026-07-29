import { Request, Response } from 'express';
import { registerUser } from '../services/auth.service';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;


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
