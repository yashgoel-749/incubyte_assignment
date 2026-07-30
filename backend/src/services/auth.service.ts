import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../repositories/user.repository';
import { AppError } from '../errors/AppError';

const SALT_ROUNDS = 10;
const JWT_EXPIRY = '1h';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const signToken = (user: { id: number; email: string; role: string }) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY },
    );
};

/**
 * Registers a new user.
 * @throws AppError 409 if email already exists
 */
export const registerUser = async (email: string, passwordPlain: string, role?: string) => {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new AppError('Email is already registered', 409);
    }

    const passwordHash = await bcrypt.hash(passwordPlain, SALT_ROUNDS);
    const newUser = await createUser(email, passwordHash, role);
    return {
        user: { id: newUser.id, email: newUser.email, role: newUser.role },
        token: signToken(newUser),
    };
};

/**
 * Authenticates a user and returns a signed JWT along with user details.
 * @throws AppError 404 if user not found
 * @throws AppError 401 if password does not match
 */
export const loginUser = async (email: string, passwordPlain: string) => {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    const isMatch = await bcrypt.compare(passwordPlain, user.password);
    if (!isMatch) {
        throw new AppError('Invalid credentials', 401);
    }

    const token = signToken(user);
    return {
        user: { id: user.id, email: user.email, role: user.role },
        token,
    };
};
