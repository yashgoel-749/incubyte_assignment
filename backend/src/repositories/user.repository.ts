import { prisma } from '../config/db';

/**
 * User repository – data-access layer.
 * Isolates all database queries behind a clean interface.
 */

export const findUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
};

export const createUser = async (email: string, passwordHash: string, role: string = 'USER') => {
    const user = await prisma.user.create({
        data: {
            email,
            password: passwordHash,
            role,
        },
        select: {
            id: true,
            email: true,
            role: true,
        },
    });
    return user;
};
