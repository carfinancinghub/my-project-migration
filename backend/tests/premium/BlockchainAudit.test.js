// File: BlockchainAudit.test.js
// Path: C:\CFH\backend\tests\premium\BlockchainAudit.test.js
// Purpose: Unit tests for BlockchainAudit service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const BlockchainAudit = require('@services/premium/BlockchainAudit');
const db = require('@services/db');
const blockchain = require('@services/blockchain');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@services/blockchain');
jest.mock('@utils/logger');

describe('BlockchainAudit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('logTransaction', () => {
    it('logs transaction successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      db.getUser.mockResolvedValueOnce(mockUser);
      blockchain.recordTransaction.mockResolvedValueOnce('tx-hash-123');
      db.logBlockchainTransaction.mockResolvedValueOnce({});

      const result = await BlockchainAudit.logTransaction('123', '789', 'bid', { amount: 10000 });
      expect(result).toEqual({ status: 'logged', hash: 'tx-hash-123' });
      expect(blockchain.recordTransaction).toHaveBeenCalledWith(expect.objectContaining({ auctionId: '789', transactionType: 'bid' }));
      expect(db.logBlockchainTransaction).toHaveBeenCalledWith(expect.objectContaining({ hash: 'tx-hash-123' }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Logged transaction'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(BlockchainAudit.logTransaction('123', '789', 'bid', { amount: 10000 })).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(BlockchainAudit.logTransaction('123', '789', 'bid', { amount: 10000 })).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });
  });

  describe('getAuditTrail', () => {
    it('retrieves audit trail successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockTransactions = [
        { userId: '123', auctionId: '789', transactionType: 'bid', details: { amount: 10000 }, hash: 'tx-hash-123' }
      ];
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getBlockchainTransactions.mockResolvedValueOnce(mockTransactions);
      blockchain.verifyTransaction.mockResolvedValueOnce(true);

      const result = await BlockchainAudit.getAuditTrail('123', '789');
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(expect.objectContaining({ hash: 'tx-hash-123', isValid: true }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Retrieved audit trail'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(BlockchainAudit.getAuditTrail('123', '789')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error when no audit trail is found', async () => {
      const mockUser = { id: '123', isPremium: true };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getBlockchainTransactions.mockResolvedValueOnce([]);
      await expect(BlockchainAudit.getAuditTrail('123', '789')).rejects.toThrow('No audit trail found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('No audit trail found'));
    });
  });
});

