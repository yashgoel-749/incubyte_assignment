import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

describe('JWT Authentication Middleware', () => {
    const protectedEndpoint = '/api/auth/me';
    const registerEndpoint = '/api/auth/register';
    const loginEndpoint = '/api/auth/login';

    // Seed a user and obtain a valid token before all tests
    let validToken: string;

    beforeAll(async () => {
        const user = { email: 'jwt-test@dealership.com', password: 'securePassword123' };
        await supertest(app).post(registerEndpoint).send(user);
        const loginRes = await supertest(app).post(loginEndpoint).send(user);
        validToken = loginRes.body.token;
    });

    it('should allow access with a valid token and return user payload', async () => {
        const response = await supertest(app)
            .get(protectedEndpoint)
            .set('Authorization', `Bearer ${validToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('email', 'jwt-test@dealership.com');
    });

    it('should reject with 401 when token is invalid', async () => {
        const response = await supertest(app)
            .get(protectedEndpoint)
            .set('Authorization', 'Bearer invalid.token.here');

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
    });

    it('should reject with 401 when token is expired', async () => {
        const expiredToken = jwt.sign(
            { id: 1, email: 'expired@dealership.com', exp: Math.floor(Date.now() / 1000) - 10 },
            JWT_SECRET,
        );

        const response = await supertest(app)
            .get(protectedEndpoint)
            .set('Authorization', `Bearer ${expiredToken}`);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
    });

    it('should reject with 401 when Authorization header is missing', async () => {
        const response = await supertest(app)
            .get(protectedEndpoint);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
    });
});
