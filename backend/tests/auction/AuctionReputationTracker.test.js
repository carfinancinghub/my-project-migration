/**
 * File: AuctionReputationTracker.test.js
 * Path: backend/tests/auction/AuctionReputationTracker.test.js
 * Purpose: Jest tests for AuctionReputationTracker controller
 * Author: Cod4 (05082141)
 * Date: May 08, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
const {
  trackWinLossRatio,
  getAuctionSuccessRate,
  computeTrustScore,
  notifyReputationMilestone
} = require('@controllers/auction/AuctionReputationTracker');
const db = require('@mock/db');
const notificationDispatcher = require('@utils/notificationDispatcher');

jest.mock('@utils/notificationDispatcher');

// --- Main Suite ---
describe('AuctionReputationTracker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Win/Loss Tests ---
  it('calculates win/loss ratio accurately', async () => {
    db.getWins.mockReturnValue({ wins: 10, losses: 5 });
    const result = await trackWinLossRatio('seller_001');
    expect(result.ratio).toBeCloseTo(2 / 3);
  });

  it('calculates success rate for a user', async () => {
    db.getAuctions.mockReturnValue({ total: 20, successful: 15 });
    const rate = await getAuctionSuccessRate('user_001');
    expect(rate).toBeCloseTo(0.75);
  });

  it('computes trust score and notifies on milestone', async () => {
    db.getAuctions.mockReturnValue({ total: 20, successful: 16 });
    db.updateTrustScore.mockReturnValue({ userId: 'user_001', score: 80 });
    const score = await computeTrustScore('user_001');
    expect(score).toBe(80);
    expect(notificationDispatcher.send).toHaveBeenCalledWith(
      'user_001',
      'Reputation Milestone: You’ve reached a trust score of 80+!'
    );
  });

  it('handles new sellers with zero trust score', async () => {
    db.getAuctions.mockReturnValue({ total: 0, successful: 0 });
    const score = await computeTrustScore('user_002');
    expect(score).toBe(0);
  });

  it('optimizes database queries for performance', async () => {
    const start = Date.now();
    await trackWinLossRatio('seller_001');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100);
  });
});

/**
 * Functions Summary:
 *
 * it('calculates win/loss ratio accurately')
 * Purpose: Tests the accuracy of the win/loss ratio calculation.
 * What It Tests: trackWinLossRatio function
 * Dependencies: Mock db
 *
 * it('calculates success rate for a user')
 * Purpose: Tests the success rate calculation for a user.
 * What It Tests: getAuctionSuccessRate function
 * Dependencies: Mock db
 *
 * it('computes trust score and notifies on milestone')
 * Purpose: Tests trust score computation and milestone notification.
 * What It Tests: computeTrustScore, notifyReputationMilestone functions
 * Dependencies: Mock db, notificationDispatcher
 *
 * it('handles new sellers with zero trust score')
 * Purpose: Tests trust score for new sellers with no auctions.
 * What It Tests: computeTrustScore function
 * Dependencies: Mock db
 *
 * it('optimizes database queries for performance')
 * Purpose: Tests database query performance.
 * What It Tests: trackWinLossRatio function
 * Dependencies: Mock db
 */


