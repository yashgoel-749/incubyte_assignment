import supertest from 'supertest';
import app from '../src/app';

describe('App Integration Tests', () => {
    describe('GET /health', () => {
        it('should return strong 200 OK and { status: "UP" }', async () => {
            const response = await supertest(app).get('/health');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ status: 'UP' });
        });
    });
});

