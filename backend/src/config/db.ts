import dotenv from 'dotenv';
dotenv.config();

// Define a singleton Prisma Client to avoid connection exhaustion
let prismaInstance: any;

if (process.env.NODE_ENV === 'test') {
    // Isolated Mock
    const users: any[] = [];
    prismaInstance = {
        $queryRawUnsafe: async (query: string, ...args: any[]) => {
            const text = query.toUpperCase();
            if (text.startsWith('SELECT * FROM USERS')) {
                const user = users.find((u: any) => u.email === args[0]);
                return user ? [user] : [];
            }
            if (text.startsWith('INSERT INTO USERS')) {
                const newUser = { id: users.length + 1, email: args[0], password: args[1] };
                users.push(newUser);
                return [{ id: newUser.id, email: newUser.email }];
            }
            return [];
        }
    } as any;
} else {
    // Only import Prisma when not testing so missing client doesn't crash testing!
    const { PrismaClient } = require('@prisma/client');
    prismaInstance = new PrismaClient({
        datasources: {
            db: { url: process.env.DATABASE_URL }
        }
    });
}


export const prisma = prismaInstance;

/**
 * Validates connection to the Neon Postgres database.
 */
export const checkDbConnection = async (): Promise<void> => {
    if (process.env.NODE_ENV === 'test') return;
    try {
        await prisma.$connect();
        console.log('✅ Prisma connected to Neon PostgreSQL successfully.');
    } catch (error) {
        console.error('❌ Failed to connect Prisma to Neon PostgreSQL:', error);
        process.exit(1);
    }
};
