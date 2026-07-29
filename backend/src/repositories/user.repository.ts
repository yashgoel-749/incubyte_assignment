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

export const createUser = async (email: string, passwordHash: string, role: string = 'USER') => {
    const result: any[] = await prisma.$queryRawUnsafe(
        'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role',
        email,
        passwordHash,
        role,
    );
    return result[0];
};
