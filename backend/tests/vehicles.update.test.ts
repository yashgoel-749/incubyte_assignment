import supertest from 'supertest';
import app from '../src/app';

describe('Vehicles API - Update Vehicle', () => {
    const createEndpoint = '/api/vehicles';
    const registerEndpoint = '/api/auth/register';
    const loginEndpoint = '/api/auth/login';

    let validToken: string;
    let vehicleId: number;

    const initialVehicle = {
        make: 'Honda',
        model: 'Civic',
        year: 2019,
        price: 20000,
        status: 'AVAILABLE'
    };

    beforeAll(async () => {
        // Setup state: Create user and acquire JWT token
        const user = { email: 'updater-dealer@dealership.com', password: 'securePassword123' };
        await supertest(app).post(registerEndpoint).send(user);
        const loginRes = await supertest(app).post(loginEndpoint).send(user);
        validToken = loginRes.body.token;

        // Seed a target vehicle in the database
        const res = await supertest(app)
            .post(createEndpoint)
            .set('Authorization', `Bearer ${validToken}`)
            .send(initialVehicle);

        vehicleId = res.body.vehicle.id;
    });

    describe('PUT /api/vehicles/:id', () => {
        it('should fail with 401 when request is unauthorized (no token provided)', async () => {
            const response = await supertest(app)
                .put(`/api/vehicles/${vehicleId}`)
                .send({ ...initialVehicle, price: 19000 });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
        });

        it('should fail with 400 when validation errors occur (e.g., negative price)', async () => {
            const response = await supertest(app)
                .put(`/api/vehicles/${vehicleId}`)
                .set('Authorization', `Bearer ${validToken}`)
                .send({ ...initialVehicle, price: -5000 }); // Price must be positive

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should fail with 404 when providing a non-existent vehicle ID', async () => {
            const response = await supertest(app)
                .put(`/api/vehicles/9999999`)
                .set('Authorization', `Bearer ${validToken}`)
                .send({ ...initialVehicle, price: 21000 });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
        });

        it('should fail with 400 when providing a malformed ID', async () => {
            const response = await supertest(app)
                .put(`/api/vehicles/invalid-string-id`)
                .set('Authorization', `Bearer ${validToken}`)
                .send({ ...initialVehicle, price: 21000 });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should successfully update the vehicle and return 200 properly', async () => {
            const updatedPayload = {
                make: 'Honda',
                model: 'Civic',
                year: 2019,
                price: 18500, // Price dropped!
                status: 'SOLD',
                category: 'SEDAN'
            };

            const response = await supertest(app)
                .put(`/api/vehicles/${vehicleId}`)
                .set('Authorization', `Bearer ${validToken}`)
                .send(updatedPayload);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('vehicle');
            expect(response.body.vehicle.price).toBe(18500);
            expect(response.body.vehicle.status).toBe('SOLD');
            expect(response.body.vehicle.category).toBe('SEDAN');
        });
    });
});
