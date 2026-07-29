import supertest from 'supertest';
import app from '../src/app';

/**
 * Failing integration tests for POST /api/vehicles/:id/restock
 * 
 * Cover:
 *  - admin restock (success returns 200 and sets status="AVAILABLE")
 *  - forbidden user (403 for non-admins)
 *  - invalid id (400 for malformed, 404 for missing)
 * 
 * Run: npx jest tests/vehicles.restock.test.ts --no-coverage --forceExit
 */

describe('Vehicles API - Restock Vehicle', () => {
    const registerEndpoint = '/api/auth/register';
    const loginEndpoint = '/api/auth/login';
    const vehiclesEndpoint = '/api/vehicles';

    let adminToken: string;
    let userToken: string;
    let soldVehicleId: number;

    const soldVehiclePayload = {
        make: 'Tesla',
        model: 'Model S',
        year: 2023,
        price: 80000,
        status: 'SOLD',
    };

    beforeAll(async () => {
        // ── Register and Login Normal User ──────────────────────────────
        const normalUser = {
            email: 'restock-customer@dealership.com',
            password: 'securePassword123'
        };
        await supertest(app).post(registerEndpoint).send(normalUser);
        const userLogin = await supertest(app).post(loginEndpoint).send(normalUser);
        userToken = userLogin.body.token;

        // ── Register and Login Admin User ───────────────────────────────
        const adminUser = {
            email: 'restock-admin@dealership.com',
            password: 'adminPassword123',
            role: 'ADMIN' // We expect the app to support this from previous prompts
        };
        await supertest(app).post(registerEndpoint).send(adminUser);
        const adminLogin = await supertest(app).post(loginEndpoint).send(adminUser);
        adminToken = adminLogin.body.token;

        // ── Seed a SOLD vehicle using the admin token ───────────────────
        const seedRes = await supertest(app)
            .post(vehiclesEndpoint)
            .set('Authorization', `Bearer ${adminToken}`)
            .send(soldVehiclePayload);

        soldVehicleId = seedRes.body.vehicle.id;
    });

    describe('POST /api/vehicles/:id/restock', () => {

        it('should fail with 401 when no token is provided', async () => {
            const response = await supertest(app)
                .post(`${vehiclesEndpoint}/${soldVehicleId}/restock`);

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
        });

        it('should fail with 403 when a non-admin (normal user) tries to restock', async () => {
            const response = await supertest(app)
                .post(`${vehiclesEndpoint}/${soldVehicleId}/restock`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty('error');
        });

        it('should fail with 400 when the vehicle ID is malformed (invalid id)', async () => {
            const response = await supertest(app)
                .post(`${vehiclesEndpoint}/not-a-number/restock`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should fail with 404 when the vehicle does not exist', async () => {
            const response = await supertest(app)
                .post(`${vehiclesEndpoint}/9999999/restock`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
        });

        it('should successfully restock a vehicle and return 200 (ADMIN)', async () => {
            const response = await supertest(app)
                .post(`${vehiclesEndpoint}/${soldVehicleId}/restock`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('vehicle');
            expect(response.body.vehicle.status).toBe('AVAILABLE');
        });

        it('should verify the vehicle is actually marked as AVAILABLE after restock', async () => {
            // Verify in the database (via GET request) that the status changed
            const response = await supertest(app)
                .get(`${vehiclesEndpoint}`)
                .set('Authorization', `Bearer ${adminToken}`);

            const vehicles = response.body.vehicles;
            const restockedVehicle = vehicles.find((v: any) => v.id === soldVehicleId);

            expect(restockedVehicle).toBeDefined();
            expect(restockedVehicle.status).toBe('AVAILABLE');
        });

    });
});
