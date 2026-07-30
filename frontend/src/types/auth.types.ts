// ─── Auth Domain Types ─────────────────────────────────────────────────────

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
    avatarUrl?: string;
    createdAt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    role?: User['role'];
}

export interface AuthResponse {
    user?: User;
    token: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
