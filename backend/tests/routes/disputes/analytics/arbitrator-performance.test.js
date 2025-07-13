// Crown Certified Test — arbitrator-performance.test.js
// Path: backend/tests/routes/disputes/analytics/arbitrator-performance.test.js

const request = require('supertest');
const express = require('express');
const router = require('@routes/disputes/analytics/arbitrator-performance');
const Dispute = require('@models/Dispute');
const AuctionGamificationEngine = require('@services/auction/AuctionGamificationEngine');

jest.mock('@models/Dispute');
jest.mock('@services/auction/AuctionGamificationEngine');

const app = express();
app.use(express.json());
app.use('/api/disputes/analytics', router);

describe('GET /api/disputes/analytics/arbitrator/:arbitratorId', () => {
  const baseDispute = {
    _id: 'd001',
    createdAt: new Date(Date.now() - 4 * 3600000),
    resolvedAt: new Date(Date.now() - 1 * 3600000),
    votes: [
      { arbitratorId: 'arb001', vote: 'Yes', createdAt: new Date(Date.now() - 3 * 3600000) },
      { arbitratorId: 'arb002', vote: 'Yes' },
      { arbitratorId: 'arb003', vote: 'No' }
    ],
    status: 'Resolved'
  };

  beforeEach(() => {
    Dispute.find.mockResolvedValue([baseDispute]);
    AuctionGamificationEngine.getBadgeSummary.mockResolvedValue({
      badges: ['⚡ Streak: 5 Resolutions', '🏅 Speedster Badge']
    });
  });

  it('returns basic analytics for free user', async () => {
    const res = await request(app).get('/api/disputes/analytics/arbitrator/arb001');
    expect(res.status).toBe(200);
    expect(res.body.totalDisputes).toBe(1);
    expect(res.body.resolvedCases).toBe(1);
    expect(res.body.agreementRate).toBeDefined();
    expect(res.body.firstVoteLatency).toBeUndefined();
  });

  it('returns extended analytics for premium users', async () => {
    const res = await request(app).get('/api/disputes/analytics/arbitrator/arb001?isPremium=true');
    expect(res.status).toBe(200);
    expect(res.body.firstVoteLatency).toBeDefined();
    expect(res.body.disagreementRate).toBeDefined();
    expect(res.body.badges).toContain('⚡ Streak: 5 Resolutions');
  });

  it('handles empty results gracefully', async () => {
    Dispute.find.mockResolvedValue([]);
    const res = await request(app).get('/api/disputes/analytics/arbitrator/arb001?isPremium=true');
    expect(res.status).toBe(200);
    expect(res.body.totalDisputes).toBe(0);
    expect(res.body.badges).toEqual([]);
  });

  it('returns 500 on internal error', async () => {
    Dispute.find.mockRejectedValueOnce(new Error('DB failure'));
    const res = await request(app).get('/api/disputes/analytics/arbitrator/arb001');
    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/internal server/i);
  });
});

