import dotenv from 'dotenv';
dotenv.config();

// Define a singleton Prisma Client to avoid connection exhaustion
let prismaInstance: any;

if (process.env.NODE_ENV === 'test') {
    // Isolated Mock
    const users: any[] = [];
    const vehicles: any[] = [];
    prismaInstance = {
        $transaction: async (cb: any) => {
            return await cb(prismaInstance);
        },
        $queryRawUnsafe: async (query: string, ...args: any[]) => {
            const text = query.toUpperCase();
            if (text.startsWith('SELECT * FROM USERS')) {
                const user = users.find((u: any) => u.email === args[0]);
                return user ? [user] : [];
            }
            if (text.startsWith('INSERT INTO USERS')) {
                const newUser = { id: users.length + 1, email: args[0], password: args[1], role: args[2] || 'USER' };
                users.push(newUser);
                return [{ id: newUser.id, email: newUser.email, role: newUser.role }];
            }
            return [];
        },
        vehicle: {
            create: async (args: any) => {
                const newVehicle = { id: vehicles.length + 1, ...args.data };
                vehicles.push(newVehicle);
                return newVehicle;
            },
            findMany: async (args: any) => {
                let result = vehicles;
                if (args && args.where) {
                    const w = args.where;
                    if (w.make) result = result.filter(v => v.make === w.make);
                    if (w.model) result = result.filter(v => v.model === w.model);
                    if (w.category) result = result.filter(v => v.category === w.category);
                    if (w.price) {
                        if (w.price.gte !== undefined) result = result.filter(v => v.price >= w.price.gte);
                        if (w.price.lte !== undefined) result = result.filter(v => v.price <= w.price.lte);
                    }
                }
                return result;
            },
            // ── Find single vehicle by primary key (mirrors Prisma) ───────
            findUnique: async (args: any) => {
                const id = args?.where?.id;
                return vehicles.find(v => v.id === id) ?? null;
            },
            // ── Update a vehicle in-place ────────────────────────────
            update: async (args: any) => {
                const id = args?.where?.id;
                const idx = vehicles.findIndex(v => v.id === id);
                if (idx === -1) throw new Error(`Record with id ${id} not found`);
                vehicles[idx] = { ...vehicles[idx], ...args.data };
                return vehicles[idx];
            },
            // ── Delete a vehicle ──────────────────────────────────────
            delete: async (args: any) => {
                const id = args?.where?.id;
                const idx = vehicles.findIndex(v => v.id === id);
                if (idx === -1) throw new Error(`Record with id ${id} not found`);
                const deleted = vehicles[idx];
                vehicles.splice(idx, 1);
                return deleted;
            }
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
