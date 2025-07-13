// (c) 2025 CFH, All Rights Reserved
// Purpose: Tests for auction routes
import request from 'supertest';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import app from '@root/app';
const logTestExecution = (testName, result) => {
    const logDir = path.resolve(__dirname, '../../logs');
    if (!fs.existsSync(logDir))
        fs.mkdirSync(logDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logFile = path.resolve(logDir, uctions_test_exec_.log);
    const logData = [], nStatus, nBody, n;
    fs.appendFileSync(logFile, logData);
};
describe('Auction Routes', () => {
    const auctionId = '12345';
    let token;
    beforeAll(() => {
        token = jwt.sign({ id: 'test-user-id', role: 'user' }, 'test-secret', { expiresIn: '1h' });
    });
    it('GET /api/auctions/:auctionId returns auction item', async () => {
        const res = await request(app)
            .get(/api/auctions / )
            .set('Authorization', Bearer);
        logTestExecution('GET /api/auctions/:auctionId', res);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', auctionId);
    });
    it('POST /api/auctions/:auctionId/bids with invalid bid returns 400', async () => {
        const res = await request(app)
            .post(/api/auctions //bids)
            .set('Authorization', Bearer)
            .send({ amount: -100 }));
        logTestExecution('POST /api/auctions/:auctionId/bids invalid', res);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message');
    });
    it('POST /api/auctions/:auctionId/bids with valid bid returns 201', async () => {
        const res = await request(app)
            .post(/api/auctions //bids)
            .set('Authorization', Bearer)
            .send({ amount: 1000 }));
        logTestExecution('POST /api/auctions/:auctionId/bids valid', res);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message');
    });
});


