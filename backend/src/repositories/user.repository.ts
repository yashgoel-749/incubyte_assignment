import { prisma } from '../config/db';

/**
 * User repository – data-access layer.
 * Isolates all database queries behind a clean interface.
 */

export const findUserByEmail = async (email: string) => {
    const result: any[] = await prisma.$queryRawUnsafe(
        'SELECT * FROM users WHERE email = $1',
        email,
    );
    return result[0] || null;
};

export const createUser = async (email: string, passwordHash: string) => {
    const result: any[] = await prisma.$queryRawUnsafe(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
        email,
        passwordHash,
    );
    return result[0];
};
