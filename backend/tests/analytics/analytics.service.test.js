/**
 * @file analytics.service.test.ts
 * @path C:\CFH\backend\tests\analytics\analytics.service.test.ts
 * @author Cod1 Team
 * @created 2025-06-11 [1810]
 * @purpose Tests the Analytics API endpoints for functionality and security.
 * @user_impact Ensures reliable analytics data delivery.
 * @version 1.0.0
 */
import request from 'supertest';
import app from '../../app'; // Express app
describe('Analytics API', () => {
    it('rejects unauthenticated users', async () => {
        const res = await request(app).get('/api/analytics');
        expect(res.status).toBe(401);
    });
    it('rejects invalid tier', async () => {
        const token = 'valid-jwt-token'; // Mock JWT
        const res = await request(app)
            .get('/api/analytics?from=2025-01-01&to=2025-01-02&tier=invalid')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Invalid subscription tier');
    });
    it('returns data for valid request', async () => {
        const token = 'valid-jwt-token'; // Mock JWT
        const res = await request(app)
            .get('/api/analytics?from=2025-01-01&to=2025-01-02&tier=premium')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.totalTimeMs).toBeLessThan(500);
    });
    it('creates custom report with valid data', async () => {
        const token = 'valid-jwt-token'; // Mock JWT
        const res = await request(app)
            .post('/api/analytics/reports/custom')
            .set('Authorization', `Bearer ${token}`)
            .send({ tier: 'premium', metrics: ['sales'], filters: { dateFrom: '2025-01-01', dateTo: '2025-01-02' } });
        expect(res.status).toBe(201);
        expect(res.body.id).toBeDefined();
    });
    it('rejects invalid custom report data', async () => {
        const token = 'valid-jwt-token'; // Mock JWT
        const res = await request(app)
            .post('/api/analytics/reports/custom')
            .set('Authorization', `Bearer ${token}`)
            .send({ tier: 'premium', metrics: [], filters: { dateFrom: '2025-01-02', dateTo: '2025-01-01' } });
        expect(res.status).toBe(400);
    });
});


