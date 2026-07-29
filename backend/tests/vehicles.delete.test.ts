import supertest from 'supertest';
import app from '../src/app';

/**
 * Failing integration tests for DELETE /api/vehicles/:id
 *
 * These tests drive the following NOT-YET-IMPLEMENTED behaviour:
 *  - User.role field ('USER' | 'ADMIN') on the User model
 *  - role embedded inside the JWT payload
 *  - authorizeAdmin middleware that enforces ADMIN-only access
 *  - DELETE /api/vehicles/:id route
 *
 * Run:   npx jest tests/vehicles.delete.test.ts --no-coverage --forceExit
 * All tests in this file should FAIL until the implementation is added.
 */

describe('Vehicles API - Delete Vehicle', () => {
    const registerEndpoint = '/api/auth/register';
    const loginEndpoint = '/api/auth/login';
    const vehiclesEndpoint = '/api/vehicles';

    let adminToken: string;
    let userToken: string;
    let vehicleId: number;

    const seedVehicle = {
        make: 'Toyota',
        model: 'Supra',
        year: 2022,
        price: 55000,
        status: 'AVAILABLE',
    };

    beforeAll(async () => {
        // ── Register a normal USER ───────────────────────────────────
        const normalUser = {
            email: 'normal-user@dealership.com',
            password: 'securePassword123',
            // role defaults to 'USER' when omitted
        };
        await supertest(app).post(registerEndpoint).send(normalUser);
        const userLogin = await supertest(app).post(loginEndpoint).send(normalUser);
        userToken = userLogin.body.token;

        // ── Register an ADMIN user ───────────────────────────────────
        const adminUser = {
            email: 'admin@dealership.com',
            password: 'adminPassword123',
            role: 'ADMIN',                  // drives User.role on the schema
        };
        await supertest(app).post(registerEndpoint).send(adminUser);
        const adminLogin = await supertest(app).post(loginEndpoint).send(adminUser);
        adminToken = adminLogin.body.token;

        // ── Seed a vehicle to delete (using admin token) ─────────────
        const res = await supertest(app)
            .post(vehiclesEndpoint)
            .set('Authorization', `Bearer ${adminToken}`)
            .send(seedVehicle);

        vehicleId = res.body.vehicle.id;
    });

    describe('DELETE /api/vehicles/:id', () => {

        // ── 401 — no token ───────────────────────────────────────────
        it('should fail with 401 when no authentication token is provided', async () => {
            const response = await supertest(app)
                .delete(`${vehiclesEndpoint}/${vehicleId}`);

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
        });

        // ── 403 — authenticated but not ADMIN ────────────────────────
        it('should fail with 403 when a non-admin user attempts to delete a vehicle', async () => {
            const response = await supertest(app)
                .delete(`${vehiclesEndpoint}/${vehicleId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty('error');
        });

        // ── 400 — malformed id ────────────────────────────────────────
        it('should fail with 400 when the vehicle ID is not a valid integer', async () => {
            const response = await supertest(app)
                .delete(`${vehiclesEndpoint}/not-a-number`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        // ── 404 — valid id but vehicle does not exist ─────────────────
        it('should fail with 404 when the vehicle ID does not exist', async () => {
            const response = await supertest(app)
                .delete(`${vehiclesEndpoint}/9999999`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
        });

        // ── 200 — admin successfully deletes ─────────────────────────
        it('should allow an ADMIN user to delete a vehicle and return 200', async () => {
            const response = await supertest(app)
                .delete(`${vehiclesEndpoint}/${vehicleId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
        });
    });
});
