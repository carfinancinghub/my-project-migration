// File: FinalTesting.test.js
// Path: C:\CFH\backend\tests\final\FinalTesting.test.js
// Purpose: Unit tests for FinalTesting service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const FinalTesting = require('@services/final/FinalTesting');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('FinalTesting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('testDatabaseConnections', () => {
    it('tests database connections successfully', async () => {
      db.getTotalUsers.mockResolvedValueOnce(100);
      db.getActiveAuctionsCount.mockResolvedValueOnce(5);

      const result = await FinalTesting.testDatabaseConnections();
      expect(result).toEqual({ userCount: 100, auctionCount: 5, status: true });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Tested database connections: Success'));
    });

    it('throws error on database failure', async () => {
      db.getTotalUsers.mockRejectedValueOnce(new Error('DB error'));
      await expect(FinalTesting.testDatabaseConnections()).rejects.toThrow('DB error');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to test database connections'));
    });
  });

  describe('testAPIAvailability', () => {
    it('tests API availability successfully', async () => {
      const result = await FinalTesting.testAPIAvailability();
      expect(result.allPassed).toBe(true);
      expect(result.results).toHaveLength(3);
      expect(result.results[0]).toEqual({ endpoint: '/api/users', status: true });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Tested API availability: Success'));
    });

    it('throws error on API test failure', async () => {
      // Simulate failure by overriding the mock
      jest.spyOn(global, 'Promise').mockImplementationOnce(() => {
        throw new Error('API error');
      });
      await expect(FinalTesting.testAPIAvailability()).rejects.toThrow('API error');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to test API availability'));
    });
  });
});

