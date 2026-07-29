import bcrypt from 'bcrypt';
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
