// File: FeedbackSystem.test.js
// Path: C:\CFH\backend\tests\operational\FeedbackSystem.test.js
// Purpose: Unit tests for FeedbackSystem service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const FeedbackSystem = require('@services/operational/FeedbackSystem');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('FeedbackSystem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('submitFeedback', () => {
    it('submits feedback successfully', async () => {
      const mockUser = { id: '123' };
      const mockAuction = { id: '789' };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getAuction.mockResolvedValueOnce(mockAuction);
      db.saveFeedback.mockResolvedValueOnce('feedback1');

      const result = await FeedbackSystem.submitFeedback('123', '789', 4, 'Great experience');
      expect(result).toEqual({ feedbackId: 'feedback1', status: 'submitted' });
      expect(db.saveFeedback).toHaveBeenCalledWith(expect.objectContaining({ userId: '123', rating: 4, comments: 'Great experience' }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Submitted feedback'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(FeedbackSystem.submitFeedback('123', '789', 4, 'Great experience')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });

    it('throws error when auction is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123' });
      db.getAuction.mockResolvedValueOnce(null);
      await expect(FeedbackSystem.submitFeedback('123', '789', 4, 'Great experience')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });

    it('throws error for invalid rating', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123' });
      db.getAuction.mockResolvedValueOnce({ id: '789' });
      await expect(FeedbackSystem.submitFeedback('123', '789', 6, 'Great experience')).rejects.toThrow('Rating must be between 1 and 5');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid rating'));
    });
  });

  describe('getFeedbackForAuction', () => {
    it('retrieves feedback successfully', async () => {
      const mockAuction = { id: '789' };
      const mockFeedback = [
        { userId: '123', rating: 4, comments: 'Great experience', submittedAt: '2025-05-24T12:00:00Z' }
      ];
      db.getAuction.mockResolvedValueOnce(mockAuction);
      db.getFeedbackByAuction.mockResolvedValueOnce(mockFeedback);

      const result = await FeedbackSystem.getFeedbackForAuction('789');
      expect(result).toEqual([
        { userId: '123', rating: 4, comments: 'Great experience', submittedAt: '2025-05-24T12:00:00Z' }
      ]);
      expect(db.getFeedbackByAuction).toHaveBeenCalledWith('789');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Retrieved feedback'));
    });

    it('throws error when auction is not found', async () => {
      db.getAuction.mockResolvedValueOnce(null);
      await expect(FeedbackSystem.getFeedbackForAuction('789')).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });

    it('throws error when no feedback is found', async () => {
      db.getAuction.mockResolvedValueOnce({ id: '789' });
      db.getFeedbackByAuction.mockResolvedValueOnce([]);
      await expect(FeedbackSystem.getFeedbackForAuction('789')).rejects.toThrow('No feedback found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('No feedback found'));
    });
  });
});

