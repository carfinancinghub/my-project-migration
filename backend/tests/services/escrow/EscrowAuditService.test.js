// 👑 Crown Certified Test — EscrowAuditService.test.js
// Path: backend/tests/services/escrow/EscrowAuditService.test.js
// Purpose: Unit tests for EscrowAuditService, covering audit log aggregation and event logging.
// Author: Rivers Auction Team — May 16, 2025

const EscrowAuditService = require('@services/escrow/EscrowAuditService');
const Escrow = require('@models/Escrow');
const BlockchainAdapter = require('@services/blockchain/BlockchainAdapter');
const logger = require('@utils/logger');

jest.mock('@models/Escrow');
jest.mock('@services/blockchain/BlockchainAdapter');
jest.mock('@utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
}));

describe('EscrowAuditService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCombinedAuditLogs', () => {
    it('should aggregate database logs for non-premium user', async () => {
      const mockDbLogs = [{ eventType: 'created', timestamp: '2025-05-16' }];
      Escrow.findOne.mockResolvedValue({ transactionId: 'tx1', auditLogs: mockDbLogs });

      const result = await EscrowAuditService.getCombinedAuditLogs('tx1', false);

      expect(result).toEqual({ data: [{ source: 'database', eventType: 'created', timestamp: '2025-05-16' }] });
      expect(Escrow.findOne).toHaveBeenCalledWith({ transactionId: 'tx1' });
      expect(BlockchainAdapter.getTransactionHistory).not.toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith('Combined audit logs retrieved for tx1');
    });

    it('should aggregate database and blockchain logs for premium user', async () => {
      const mockDbLogs = [{ eventType: 'created', timestamp: '2025-05-16T12:00:00Z' }];
      const mockBlockchainLogs = [{ event: 'updated', timestamp: '2025-05-16T13:00:00Z' }];
      Escrow.findOne.mockResolvedValue({ transactionId: 'tx1', auditLogs: mockDbLogs });
      BlockchainAdapter.getTransactionHistory.mockResolvedValue(mockBlockchainLogs);

      const result = await EscrowAuditService.getCombinedAuditLogs('tx1', true);

      expect(result).toEqual({
        data: [
          { source: 'database', eventType: 'created', timestamp: '2025-05-16T12:00:00Z' },
          { source: 'blockchain', event: 'updated', timestamp: '2025-05-16T13:00:00Z' },
        ],
      });
      expect(Escrow.findOne).toHaveBeenCalledWith({ transactionId: 'tx1' });
      expect(BlockchainAdapter.getTransactionHistory).toHaveBeenCalledWith('tx1');
      expect(logger.info).toHaveBeenCalledWith('Combined audit logs retrieved for tx1');
    });

    it('should handle empty blockchain logs for premium user', async () => {
      Escrow.findOne.mockResolvedValue({ transactionId: 'tx1', auditLogs: [] });
      BlockchainAdapter.getTransactionHistory.mockResolvedValue([]);

      const result = await EscrowAuditService.getCombinedAuditLogs('tx1', true);

      expect(result).toEqual({ data: [] });
      expect(logger.warn).toHaveBeenCalledWith('No blockchain audit trail for tx1');
    });

    it('should throw error for missing transactionId', async () => {
      await expect(EscrowAuditService.getCombinedAuditLogs('')).rejects.toThrow('Transaction ID required');
      expect(logger.error).toHaveBeenCalledWith('Failed to fetch combined audit logs for ', expect.any(Error));
    });

    it('should throw error if record not found', async () => {
      Escrow.findOne.mockResolvedValue(null);

      await expect(EscrowAuditService.getCombinedAuditLogs('tx1', false)).rejects.toThrow('Escrow record not found');
      expect(logger.error).toHaveBeenCalledWith('Failed to fetch combined audit logs for tx1', expect.any(Error));
    });
  });

  describe('logAuditEvent', () => {
    const event = { eventType: 'created', userId: 'u1', details: 'Escrow initiated' };

    it('should log audit event to database', async () => {
      const mockEscrow = {
        transactionId: 'tx1',
        auditLogs: [{ eventType: 'created', userId: 'u1', details: 'Escrow initiated', timestamp: new Date() }],
      };
      Escrow.findOneAndUpdate.mockResolvedValue(mockEscrow);

      const result = await EscrowAuditService.logAuditEvent('tx1', event);

      expect(result).toEqual({ data: mockEscrow.auditLogs[0] });
      expect(Escrow.findOneAndUpdate).toHaveBeenCalledWith(
        { transactionId: 'tx1' },
        expect.any(Object),
        { new: true }
      );
      expect(logger.info).toHaveBeenCalledWith('Audit event logged for tx1: created');
    });

    it('should throw error for missing required fields', async () => {
      await expect(EscrowAuditService.logAuditEvent('tx1', {})).rejects.toThrow('Missing required fields');
      expect(logger.error).toHaveBeenCalledWith('Failed to log audit event for tx1', expect.any(Error));
    });

    it('should throw error if record not found', async () => {
      Escrow.findOneAndUpdate.mockResolvedValue(null);

      await expect(EscrowAuditService.logAuditEvent('tx1', event)).rejects.toThrow('Escrow record not found');
      expect(logger.error).toHaveBeenCalledWith('Failed to log audit event for tx1', expect.any(Error));
    });
  });
});

/*
Functions Summary:
- describe('EscrowAuditService')
  - Purpose: Test suite for EscrowAuditService methods
  - Tests:
    - getCombinedAuditLogs: Database logs, database+blockchain logs, empty blockchain logs, missing transactionId, record not found
    - logAuditEvent: Database logging, missing fields, record not found
  - Dependencies: @models/Escrow, @services/blockchain/BlockchainAdapter, @utils/logger
*/
```






