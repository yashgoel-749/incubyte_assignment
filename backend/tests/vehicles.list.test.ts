import supertest from 'supertest';
import app from '../src/app';

describe('Vehicles API - List Vehicles', () => {
    const vehiclesEndpoint = '/api/vehicles';
    const registerEndpoint = '/api/auth/register';
    const loginEndpoint = '/api/auth/login';

    let validToken: string;

    beforeAll(async () => {
        // Setup: Create a user and get a valid token
        const user = { email: 'listing-dealer@dealership.com', password: 'password123' };
        await supertest(app).post(registerEndpoint).send(user);
        const loginRes = await supertest(app).post(loginEndpoint).send(user);
        validToken = loginRes.body.token;
    });

    describe(`GET ${vehiclesEndpoint}`, () => {
        it('should fail with 401 when the request is unauthenticated', async () => {
            const response = await supertest(app).get(vehiclesEndpoint);

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
        });

        it('should return 200 and an empty array when inventory is empty', async () => {
            const response = await supertest(app)
                .get(vehiclesEndpoint)
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('vehicles');
            expect(Array.isArray(response.body.vehicles)).toBe(true);
            expect(response.body.vehicles.length).toBe(0);
        });

        it('should return 200 and a populated array when inventory has vehicles', async () => {
            // First, populate the inventory
            const vehicleData = {
                make: 'Ford',
                model: 'Mustang',
                year: 2023,
                price: 35000,
                status: 'AVAILABLE'
            };

            await supertest(app)
                .post(vehiclesEndpoint)
                .set('Authorization', `Bearer ${validToken}`)
                .send(vehicleData);

            // Fetch the updated inventory
            const response = await supertest(app)
                .get(vehiclesEndpoint)
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('vehicles');
            expect(Array.isArray(response.body.vehicles)).toBe(true);
            expect(response.body.vehicles.length).toBe(1);

            // Validate the populated data
            const fetchedVehicle = response.body.vehicles[0];
            expect(fetchedVehicle).toHaveProperty('id');
            expect(fetchedVehicle).toHaveProperty('make', vehicleData.make);
            expect(fetchedVehicle).toHaveProperty('model', vehicleData.model);
            expect(fetchedVehicle).toHaveProperty('year', vehicleData.year);
        });
    });
});
