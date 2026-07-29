import supertest from 'supertest';
import app from '../src/app';

describe('Auth API - User Registration', () => {
    const endpoint = '/api/auth/register';

    describe(`POST ${endpoint}`, () => {
        it('should successfully register a user and return 201', async () => {
            const payload = {
                email: 'test@dealership.com',
                password: 'password123',
            };

            const response = await supertest(app)
                .post(endpoint)
                .send(payload);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'User registered successfully');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('email', payload.email);
            expect(response.body.user).not.toHaveProperty('password');
        });

        it('should fail with 400 when email is missing', async () => {
            const payload = {
                password: 'password123',
            };

            const response = await supertest(app)
                .post(endpoint)
                .send(payload);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should fail with 400 when password is missing', async () => {
            const payload = {
                email: 'test@dealership.com',
            };

            const response = await supertest(app)
                .post(endpoint)
                .send(payload);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should fail with 400 when email format is invalid', async () => {
            const payload = {
                email: 'invalid-email-format',
                password: 'password123',
            };

            const response = await supertest(app)
                .post(endpoint)
                .send(payload);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should fail with 409 when the email is already registered', async () => {
            const payload = {
                email: 'duplicate@dealership.com',
                password: 'password123',
            };

            // 1. Initial registration
            await supertest(app).post(endpoint).send(payload);

            // 2. Attempt duplicate registration
            const response = await supertest(app)
                .post(endpoint)
                .send(payload);

            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('error');
        });
    });
});
