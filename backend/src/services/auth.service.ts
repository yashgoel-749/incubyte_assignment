import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/user.model';

export const registerUser = async (email: string, passwordPlain: string) => {
    // 1. Check if user exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error('Email is already registered');
    }

    // 2. Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(passwordPlain, saltRounds);

    // 3. Create user
    const newUser = await createUser(email, passwordHash);
    return newUser;
};

export const loginUser = async (email: string, passwordPlain: string) => {
    // 1. Find user
    const user = await findUserByEmail(email);
    if (!user) {
        throw Object.assign(new Error('User not found'), { status: 404 });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(passwordPlain, user.password);
    if (!isMatch) {
        throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    }

    // 3. Sign JWT
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1h' });

    return token;
};
