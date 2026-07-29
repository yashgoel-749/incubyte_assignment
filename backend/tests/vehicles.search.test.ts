import supertest from 'supertest';
import app from '../src/app';

describe('Vehicles API - Search Vehicles', () => {
    const searchEndpoint = '/api/vehicles/search';
    const createEndpoint = '/api/vehicles';
    const registerEndpoint = '/api/auth/register';
    const loginEndpoint = '/api/auth/login';

    let validToken: string;

    beforeAll(async () => {
        // Setup: Create a user and acquire a JWT token
        const user = { email: 'search-dealer@dealership.com', password: 'securePassword123' };
        await supertest(app).post(registerEndpoint).send(user);
        const loginRes = await supertest(app).post(loginEndpoint).send(user);
        validToken = loginRes.body.token;

        // Seed vehicles (Notice the 'category' field is included. Part of the RED phase is expecting 
        // the backend to eventually support this new requirement!)
        const vehiclesToSeed = [
            { make: 'Toyota', model: 'Camry', year: 2021, price: 25000, category: 'SEDAN' },
            { make: 'Toyota', model: 'Corolla', year: 2020, price: 20000, category: 'SEDAN' },
            { make: 'Ford', model: 'F-150', year: 2022, price: 40000, category: 'TRUCK' },
            { make: 'Tesla', model: 'Model 3', year: 2023, price: 50000, category: 'EV' }
        ];

        for (const v of vehiclesToSeed) {
            await supertest(app)
                .post(createEndpoint)
                .set('Authorization', `Bearer ${validToken}`)
                .send(v);
        }
    });

    describe(`GET ${searchEndpoint}`, () => {
        it('should filter vehicles by make', async () => {
            const response = await supertest(app)
                .get(`${searchEndpoint}?make=Toyota`)
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.vehicles)).toBe(true);
            expect(response.body.vehicles.length).toBe(2);
            expect(response.body.vehicles[0].make).toBe('Toyota');
        });

        it('should filter vehicles by model', async () => {
            const response = await supertest(app)
                .get(`${searchEndpoint}?model=F-150`)
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(200);
            expect(response.body.vehicles.length).toBe(1);
            expect(response.body.vehicles[0].model).toBe('F-150');
        });

        it('should filter vehicles by category', async () => {
            const response = await supertest(app)
                .get(`${searchEndpoint}?category=SEDAN`)
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(200);
            expect(response.body.vehicles.length).toBe(2);

            const models = response.body.vehicles.map((v: any) => v.model);
            expect(models).toContain('Camry');
            expect(models).toContain('Corolla');
        });

        it('should filter vehicles by minimum price (minPrice)', async () => {
            const response = await supertest(app)
                .get(`${searchEndpoint}?minPrice=30000`)
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(200);
            expect(response.body.vehicles.length).toBe(2); // Ford (40000) and Tesla (50000)
            const prices = response.body.vehicles.map((v: any) => v.price);
            expect(Math.min(...prices)).toBeGreaterThanOrEqual(30000);
        });

        it('should filter vehicles by maximum price (maxPrice)', async () => {
            const response = await supertest(app)
                .get(`${searchEndpoint}?maxPrice=25000`)
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(200);
            expect(response.body.vehicles.length).toBe(2); // Toyota Camry (25000) and Corolla (20000)
            const prices = response.body.vehicles.map((v: any) => v.price);
            expect(Math.max(...prices)).toBeLessThanOrEqual(25000);
        });

        it('should combine multiple search filters accurately', async () => {
            const response = await supertest(app)
                .get(`${searchEndpoint}?make=Toyota&maxPrice=22000`)
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(200);
            expect(response.body.vehicles.length).toBe(1); // Only Corolla matches this dual condition
            expect(response.body.vehicles[0].model).toBe('Corolla');
        });
    });
});
