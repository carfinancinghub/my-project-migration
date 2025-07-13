// File: insights.test.js
// Path: backend/tests/routes/auction/insights.test.js
// Purpose: Test insights route for metrics and premium analytics
// Author: Cod1 - Rivers Auction QA
// Date: May 14, 2025
// 👑 Cod1 Crown Certified

const request = require('supertest');
const express = require('express');
const insightsRouter = require('@routes/auction/insights');

jest.mock('@utils/logger');

const app = express();
app.use(express.json());
app.use(insightsRouter);

describe('GET /api/auction/insights', () => {
  it('returns summary metrics for free users', async () => {
    const res = await request(app).get('/api/auction/insights?roleId=abc');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.summary).toHaveProperty('totalAuctions');
    expect(res.body.data.premiumAnalytics).toBeUndefined();
  });

  it('returns premium analytics when isPremium=true', async () => {
    const res = await request(app).get('/api/auction/insights?roleId=abc&isPremium=true');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.premiumAnalytics).toBeDefined();
    expect(res.body.data.premiumAnalytics.engagementTrends).toBeInstanceOf(Array);
  });

  it('returns 400 if roleId is missing', async () => {
    const res = await request(app).get('/api/auction/insights');
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/roleId/i);
  });

  it('respects rate limits (simulate too many requests)', async () => {
    for (let i = 0; i < 16; i++) {
      await request(app).get('/api/auction/insights?roleId=abc');
    }
    const res = await request(app).get('/api/auction/insights?roleId=abc');
    expect(res.statusCode).toBe(429);
    expect(res.body.error).toMatch(/too many requests/i);
  });

  it('returns 500 on internal error (mock failure)', async () => {
    const brokenApp = express();
    brokenApp.use((req, res, next) => {
      throw new Error('Mock crash');
    });
    brokenApp.use(insightsRouter);

    const res = await request(brokenApp).get('/api/auction/insights?roleId=abc');
    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });
});


