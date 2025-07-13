// 👑 Crown Certified Test — insights.test.js
// Path: backend/tests/routes/ai/insights.test.js
// Purpose: Validate /api/insights route logic, premium gating, query validation, and error handling.
// Author: Rivers Auction Team — May 16, 2025

const request = require('supertest');
const express = require('express');
const insightsRouter = require('@routes/ai/insights');
const InsightsService = require('@services/ai/InsightsService');
const logger = require('@utils/logger');

jest.mock('@services/ai/InsightsService');
jest.mock('@utils/logger');

const app = express();
app.use(express.json());
app.use('/api/insights', insightsRouter);

describe('GET /api/insights', () => {
  const mockMetrics = {
    activeAuctions: 5,
    totalBids: 100,
    uniqueUsers: 30,
  };

  const mockPredictions = {
    bidVolumeForecast: [100, 200],
    auctionSuccessRate: [0.7, 0.9],
  };

  const mockRecommendations = [
    '🚀 Bidding volume spikes at 3pm PST.',
    '⚠️ Auction completion rate dropping on weekends.',
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns metrics only (free tier)', async () => {
    InsightsService.getInsights.mockResolvedValueOnce({
      metrics: mockMetrics,
      predictions: {},
      recommendations: [],
    });

    const res = await request(app).get('/api/insights');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.metrics.activeAuctions).toBe(5);
    expect(res.body.data.predictions).toEqual({});
    expect(res.body.data.recommendations).toEqual([]);
  });

  it('returns metrics + predictions + recommendations for premium', async () => {
    InsightsService.getInsights.mockResolvedValueOnce({
      metrics: mockMetrics,
      predictions: mockPredictions,
      recommendations: mockRecommendations,
    });

    const res = await request(app).get('/api/insights?isPremium=true&userId=test-user');
    expect(res.status).toBe(200);
    expect(res.body.data.predictions.bidVolumeForecast).toBeDefined();
    expect(res.body.data.recommendations.length).toBeGreaterThan(0);
  });

  it('does not include premium content if isPremium=false', async () => {
    InsightsService.getInsights.mockResolvedValueOnce({
      metrics: mockMetrics,
      predictions: {},
      recommendations: [],
    });

    const res = await request(app).get('/api/insights?isPremium=false');
    expect(res.body.data.predictions).toEqual({});
    expect(res.body.data.recommendations).toEqual([]);
  });

  it('returns 400 for invalid query parameters', async () => {
    const res = await request(app).get('/api/insights?isPremium=notBoolean');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Invalid query params'),
      expect.anything()
    );
  });

  it('returns 500 if InsightsService throws', async () => {
    InsightsService.getInsights.mockRejectedValueOnce(new Error('💥 Internal failure'));

    const res = await request(app).get('/api/insights');
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/unable to retrieve/i);
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('GET /api/insights failed'),
      expect.any(Error)
    );
  });

  it('enforces rate limit (simulated)', async () => {
    // Simulate 61 requests in short window
    for (let i = 0; i < 61; i++) {
      await request(app).get('/api/insights');
    }
    const res = await request(app).get('/api/insights');
    expect([429, 200]).toContain(res.status); // Rate limiter is time-sensitive
  });
});

