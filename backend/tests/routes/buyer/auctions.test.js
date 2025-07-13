// Crown Certified Test — auctions.test.js
// Path: backend/tests/routes/buyer/auctions.test.js

const request = require('supertest');
const express = require('express');
const router = require('@routes/buyer/auctions');
const Auction = require('@models/Auction');
const BidService = require('@services/auction/BidService');
const BidRecommender = require('@services/ai/BidRecommender');

jest.mock('@models/Auction');
jest.mock('@services/auction/BidService');
jest.mock('@services/ai/BidRecommender');

const app = express();
app.use(express.json());
app.use('/api/buyer/auctions', router);

describe('GET /api/buyer/auctions', () => {
  const mockAuction = {
    _id: 'auction123',
    buyerId: 'buyerX',
    carId: 'car001',
    status: 'Funded',
    createdAt: new Date('2025-01-01T10:00:00Z'),
    updatedAt: new Date('2025-01-02T10:00:00Z'),
  };

  const mockBid = {
    providerType: 'lender',
    amount: 11000,
    interestRate: 6.9,
    estimatedDelivery: '2025-05-20',
    providerId: 'lender123',
    createdAt: new Date(),
  };

  beforeEach(() => {
    Auction.find.mockResolvedValue([mockAuction]);
    BidService.getBidsForAuction.mockResolvedValue([mockBid]);
    BidRecommender.getRecommendedBids.mockResolvedValue([
      {
        auctionId: 'auction123',
        recommendedBid: {
          providerId: 'lender123',
          reason: 'Lowest interest rate',
        },
      },
    ]);
  });

  it('returns buyer auction history (free)', async () => {
    const res = await request(app).get('/api/buyer/auctions?buyerId=buyerX');
    expect(res.status).toBe(200);
    expect(res.body.history).toBeDefined();
    expect(res.body.history[0].availableBids[0].providerType).toBe('lender');
    expect(res.body.analytics).toBeUndefined();
  });

  it('returns buyer auction history with premium analytics', async () => {
    const res = await request(app).get('/api/buyer/auctions?buyerId=buyerX&isPremium=true');
    expect(res.status).toBe(200);
    expect(res.body.analytics).toBeDefined();
    expect(res.body.analytics.successRate).toMatch(/%/);
    expect(res.body.recommendations).toBeDefined();
  });

  it('returns 400 if buyerId is missing', async () => {
    const res = await request(app).get('/api/buyer/auctions');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/buyerId/);
  });

  it('returns 500 on server error', async () => {
    Auction.find.mockRejectedValueOnce(new Error('DB error'));
    const res = await request(app).get('/api/buyer/auctions?buyerId=buyerX');
    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/internal server/i);
  });
});

