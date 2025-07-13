// File: PaymentProcessor.test.js
// Path: C:\CFH\backend\tests\operational\PaymentProcessor.test.js
// Purpose: Unit tests for PaymentProcessor service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const PaymentProcessor = require('@services/operational/PaymentProcessor');
const db = require('@services/db');
const payment = require('@services/payment');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@services/payment');
jest.mock('@utils/logger');

describe('PaymentProcessor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('processPayment', () => {
    it('processes payment successfully', async () => {
      const mockUser = { id: '123' };
      const mockAuction = { id: '789' };
      const mockTransaction = { id: 'tx-123' };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getAuction.mockResolvedValueOnce(mockAuction);
      payment.process.mockResolvedValueOnce(mockTransaction);
      db.logTransaction.mockResolvedValueOnce({});

      const result = await PaymentProcessor.processPayment('123', '789', 10000);
      expect(result).toEqual({ transactionId: 'tx-123', status: 'completed' });
      expect(payment.process).toHaveBeenCalledWith('123', 10000, 'Auction payment');
      expect(db.logTransaction).toHaveBeenCalledWith(expect.objectContaining({ transactionId: 'tx-123', status: 'completed' }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Processed payment'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(PaymentProcessor.processPayment('123', '789', 10000)).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });

    it('throws error when auction is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123' });
      db.getAuction.mockResolvedValueOnce(null);
      await expect(PaymentProcessor.processPayment('123', '789', 10000)).rejects.toThrow('Auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Auction not found'));
    });
  });

  describe('processRefund', () => {
    it('processes refund successfully', async () => {
      const mockUser = { id: '123' };
      const mockTransaction = { id: 'tx-123', amount: 10000 };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getTransaction.mockResolvedValueOnce(mockTransaction);
      payment.refund.mockResolvedValueOnce({});
      db.updateTransaction.mockResolvedValueOnce({});

      const result = await PaymentProcessor.processRefund('123', 'tx-123');
      expect(result).toEqual({ transactionId: 'tx-123', status: 'refunded' });
      expect(payment.refund).toHaveBeenCalledWith('tx-123', 10000);
      expect(db.updateTransaction).toHaveBeenCalledWith('tx-123', expect.objectContaining({ status: 'refunded' }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Processed refund'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(PaymentProcessor.processRefund('123', 'tx-123')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });

    it('throws error when transaction is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123' });
      db.getTransaction.mockResolvedValueOnce(null);
      await expect(PaymentProcessor.processRefund('123', 'tx-123')).rejects.toThrow('Transaction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Transaction not found'));
    });
  });
});

