import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types';

const MOCK_USER: User = {
    id: 'usr_123',
    name: 'Alex Rivera',
    email: 'manager@autocommand.com',
    role: 'MANAGER',
    createdAt: new Date().toISOString(),
};

const MOCK_TOKEN = 'mock.jwt.token.12345';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        await delay(1200); // Mock network latency
        if (credentials.email === 'error@autocommand.com') {
            throw new Error('Invalid credentials');
        }
        return { user: MOCK_USER, token: MOCK_TOKEN };
    },

    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        await delay(1200);
        if (credentials.email === 'error@autocommand.com') {
            throw new Error('Email already in use');
        }
        return {
            user: { ...MOCK_USER, name: credentials.name, email: credentials.email },
            token: MOCK_TOKEN
        };
    },

    async getProfile(): Promise<AuthResponse['user']> {
        await delay(500);
        return MOCK_USER;
    },
};

export default authService;
