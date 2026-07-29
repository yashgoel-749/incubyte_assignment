import supertest from 'supertest';
import app from '../src/app';

/**
 * Failing integration tests for POST /api/vehicles/:id/purchase
 *
 * Cover:
 *  - purchase success
 *  - out of stock
 *  - invalid id
 *
 * Run: npx jest tests/vehicles.purchase.test.ts --no-coverage --forceExit
 */

describe('Vehicles API - Purchase Vehicle', () => {
    const registerEndpoint = '/api/auth/register';
    const loginEndpoint = '/api/auth/login';
    const vehiclesEndpoint = '/api/vehicles';

    let userToken: string;
    let availableVehicleId: number;
    let soldVehicleId: number;

    const availableVehiclePayload = {
        make: 'Toyota',
        model: 'Camry',
        year: 2023,
        price: 30000,
        status: 'AVAILABLE',
    };

    const soldVehiclePayload = {
        make: 'Ford',
        model: 'Mustang',
        year: 2021,
        price: 45000,
        status: 'SOLD',
    };

    beforeAll(async () => {
        // ── Register and Login User ──────────────────────────────────
        const userPayload = {
            email: 'customer@dealership.com',
            password: 'securePassword123'
        };
        await supertest(app).post(registerEndpoint).send(userPayload);
        const loginRes = await supertest(app).post(loginEndpoint).send(userPayload);
        userToken = loginRes.body.token;

        // ── Seed an AVAILABLE vehicle ────────────────────────────────
        const availableRes = await supertest(app)
            .post(vehiclesEndpoint)
            .set('Authorization', `Bearer ${userToken}`)
            .send(availableVehiclePayload);

        availableVehicleId = availableRes.body.vehicle.id;

        // ── Seed a SOLD vehicle (out of stock) ───────────────────────
        const soldRes = await supertest(app)
            .post(vehiclesEndpoint)
            .set('Authorization', `Bearer ${userToken}`)
            .send(soldVehiclePayload);

        soldVehicleId = soldRes.body.vehicle.id;
    });

    describe('POST /api/vehicles/:id/purchase', () => {

        it('should fail with 400 when the vehicle ID is malformed (invalid id)', async () => {
            const response = await supertest(app)
                .post(`${vehiclesEndpoint}/invalid-id/purchase`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should fail with 404 when the vehicle does not exist (invalid id)', async () => {
            const response = await supertest(app)
                .post(`${vehiclesEndpoint}/999999/purchase`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
        });

        it('should fail with 400 when the vehicle is out of stock (already SOLD)', async () => {
            const response = await supertest(app)
                .post(`${vehiclesEndpoint}/${soldVehicleId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
            // We expect an error message like "Vehicle is out of stock"
        });

        it('should successfully purchase an available vehicle and return 200', async () => {
            const response = await supertest(app)
                .post(`${vehiclesEndpoint}/${availableVehicleId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('vehicle');
            expect(response.body.vehicle.status).toBe('SOLD');
        });

        it('should verify the vehicle is actually marked as SOLD after purchase', async () => {
            // Verify in the database (via GET request) that the status changed
            const response = await supertest(app)
                .get(`${vehiclesEndpoint}`)
                .set('Authorization', `Bearer ${userToken}`);

            const vehicles = response.body.vehicles;
            const purchasedVehicle = vehicles.find((v: any) => v.id === availableVehicleId);

            expect(purchasedVehicle).toBeDefined();
            expect(purchasedVehicle.status).toBe('SOLD');
        });

    });
});
