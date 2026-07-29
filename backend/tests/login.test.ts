import supertest from 'supertest';
import app from '../src/app';

describe('Auth API - User Login', () => {
    const loginEndpoint = '/api/auth/login';
    const registerEndpoint = '/api/auth/register';

    // Seed a verified user before login tests run
    const validUser = {
        email: 'login-test@dealership.com',
        password: 'securePassword123',
    };

    beforeAll(async () => {
        // Register the user so login tests have someone to authenticate against
        await supertest(app).post(registerEndpoint).send(validUser);
    });

    describe(`POST ${loginEndpoint}`, () => {

        it('should login successfully and return 200 with a JWT token', async () => {
            const response = await supertest(app)
                .post(loginEndpoint)
                .send(validUser);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(typeof response.body.token).toBe('string');
        });

        it('should fail with 401 when password is wrong', async () => {
            const response = await supertest(app)
                .post(loginEndpoint)
                .send({
                    email: validUser.email,
                    password: 'wrongPassword!',
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
        });

        it('should fail with 404 when user is not found', async () => {
            const response = await supertest(app)
                .post(loginEndpoint)
                .send({
                    email: 'ghost@dealership.com',
                    password: 'password123',
                });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
        });

        it('should fail with 400 when email is missing', async () => {
            const response = await supertest(app)
                .post(loginEndpoint)
                .send({
                    password: 'password123',
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should fail with 400 when password is missing', async () => {
            const response = await supertest(app)
                .post(loginEndpoint)
                .send({
                    email: validUser.email,
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

    });
});
