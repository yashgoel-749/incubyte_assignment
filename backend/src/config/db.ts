import { Pool } from 'pg';

let poolInstance: any;

if (process.env.NODE_ENV === 'test') {
    // In-memory mock for tests
    const users: any[] = [];
    poolInstance = {
        query: async (text: string, params: any[]) => {
            if (text.startsWith('SELECT * FROM users')) {
                const user = users.find(u => u.email === params[0]);
                return { rows: user ? [user] : [] };
            }
            if (text.startsWith('INSERT INTO users')) {
                const newUser = { id: users.length + 1, email: params[0], password: params[1] };
                users.push(newUser);
                return { rows: [{ id: newUser.id, email: newUser.email }] };
            }
            return { rows: [] };
        }
    };
} else {
    poolInstance = new Pool({
        connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/dealership',
    });
}

export const pool = poolInstance;
