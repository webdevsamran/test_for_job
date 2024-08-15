const request = require('supertest');
const app = require('../server');

let server;

beforeAll(() => {
    server = app.listen(4000);  // Use a different port for tests
});

afterAll(() => {
    server.close();
});

describe('API Endpoints', () => {
    it('should return 400 if country and year are not provided', async () => {
        const res = await request(app).get('/holidays');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('should return a list of countries', async () => {
        const res = await request(app).get('/countries');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });
});
