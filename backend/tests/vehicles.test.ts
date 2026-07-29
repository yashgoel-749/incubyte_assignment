import supertest from 'supertest';
import app from '../src/app';

describe('Vehicles API - Create Vehicle', () => {
    const vehiclesEndpoint = '/api/vehicles';
    const registerEndpoint = '/api/auth/register';
    const loginEndpoint = '/api/auth/login';

    // Store a valid token to test authenticated requests
    let validToken: string;

    beforeAll(async () => {
        // Register and login a user to acquire a JWT token
        const user = { email: 'dealer@dealership.com', password: 'securePassword123' };
        await supertest(app).post(registerEndpoint).send(user);
        const loginRes = await supertest(app).post(loginEndpoint).send(user);
        validToken = loginRes.body.token;
    });

    describe(`POST ${vehiclesEndpoint}`, () => {
        const validPayload = {
            make: 'Toyota',
            model: 'Camry',
            year: 2024,
            price: 28000,
            status: 'AVAILABLE'
        };

        it('should fail with 401 when the request is unauthenticated', async () => {
            const response = await supertest(app)
                .post(vehiclesEndpoint)
                .send(validPayload);

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
        });

        it('should fail with 400 when validation fails (e.g., missing required fields)', async () => {
            // Missing 'model' and 'year', which Zod should enforce
            const invalidPayload = {
                make: 'Toyota',
                price: 28000
            };

            const response = await supertest(app)
                .post(vehiclesEndpoint)
                .set('Authorization', `Bearer ${validToken}`)
                .send(invalidPayload);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should fail with 400 when validation fails (e.g., invalid data types or constraints)', async () => {
            const invalidPayload = {
                ...validPayload,
                year: 'twenty-twenty-four', // Should be a number
                price: -5000 // Should be positive
            };

            const response = await supertest(app)
                .post(vehiclesEndpoint)
                .set('Authorization', `Bearer ${validToken}`)
                .send(invalidPayload);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should successfully create a vehicle and return 201 when authenticated and payload is valid', async () => {
            const response = await supertest(app)
                .post(vehiclesEndpoint)
                .set('Authorization', `Bearer ${validToken}`)
                .send(validPayload);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Vehicle created successfully');

            // Checking the returned vehicle object structure
            expect(response.body).toHaveProperty('vehicle');
            expect(response.body.vehicle).toHaveProperty('id');
            expect(response.body.vehicle).toHaveProperty('make', validPayload.make);
            expect(response.body.vehicle).toHaveProperty('model', validPayload.model);
            expect(response.body.vehicle).toHaveProperty('year', validPayload.year);
            expect(response.body.vehicle).toHaveProperty('price', validPayload.price);
        });
    });
});
