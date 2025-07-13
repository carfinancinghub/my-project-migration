// File: UserAnalyticsReport.test.js
// Path: C:\CFH\backend\tests\final\UserAnalyticsReport.test.js
// Purpose: Unit tests for UserAnalyticsReport service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const UserAnalyticsReport = require('@services/final/UserAnalyticsReport');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('UserAnalyticsReport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateActivityReport', () => {
    it('generates activity report successfully', async () => {
      const mockActivity = [
        { userId: '123', action: 'place_bid' },
        { userId: '123', action: 'view_auction' },
        { userId: '456', action: 'place_bid' }
      ];
      db.getUserActivity.mockResolvedValueOnce(mockActivity);

      const result = await UserAnalyticsReport.generateActivityReport('2025-05-24', '2025-05-25');
      expect(result).toEqual({
        totalUsers: 2,
        totalActions: 3,
        actionsByType: { place_bid: 2, view_auction: 1 },
        dateRange: { startDate: '2025-05-24', endDate: '2025-05-25' }
      });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Generated activity report'));
    });

    it('throws error when no activity is found', async () => {
      db.getUserActivity.mockResolvedValueOnce([]);
      await expect(UserAnalyticsReport.generateActivityReport('2025-05-24', '2025-05-25')).rejects.toThrow('No user activity found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('No user activity found'));
    });
  });

  describe('generateEngagementReport', () => {
    it('generates engagement report successfully', async () => {
      const mockAuctions = [
        { bids: [{ bidderId: '123' }, { bidderId: '456' }] },
        { bids: [{ bidderId: '123' }] }
      ];
      db.getAuctionsByDate.mockResolvedValueOnce(mockAuctions);

      const result = await UserAnalyticsReport.generateEngagementReport('2025-05-24', '2025-05-25');
      expect(result).toEqual({
        totalAuctions: 2,
        totalBids: 3,
        averageBidsPerAuction: 1.5,
        activeUsers: 2,
        dateRange: { startDate: '2025-05-24', endDate: '2025-05-25' }
      });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Generated engagement report'));
    });

    it('throws error when no auctions are found', async () => {
      db.getAuctionsByDate.mockResolvedValueOnce([]);
      await expect(UserAnalyticsReport.generateEngagementReport('2025-05-24', '2025-05-25')).rejects.toThrow('No auctions found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('No auctions found'));
    });
  });
});

