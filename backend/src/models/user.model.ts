import { prisma } from '../config/db';

export const findUserByEmail = async (email: string) => {
    // Using queryRawUnsafe to mimic our prior SQL behavior since we have no Prisma models yet
    const result: any[] = await prisma.$queryRawUnsafe('SELECT * FROM users WHERE email = $1', email);
    return result[0] || null;
};

export const createUser = async (email: string, passwordHash: string) => {
    const result: any[] = await prisma.$queryRawUnsafe(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
        email,
        passwordHash
    );
    return result[0];
};
