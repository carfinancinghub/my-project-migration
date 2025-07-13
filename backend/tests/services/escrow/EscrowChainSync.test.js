// 👑 Crown Certified Test — EscrowChainSync.test.js
// Path: backend/tests/services/escrow/EscrowChainSync.test.js
// Purpose: Test escrow syncing, blockchain integration, and premium audit trail logic.
// Author: Rivers Auction Team — May 16, 2025

const EscrowChainSync = require('@services/escrow/EscrowChainSync');
const Escrow = require('@models/Escrow');
const BlockchainAdapter = require('@services/blockchain/BlockchainAdapter');

jest.mock('@models/Escrow');
jest.mock('@services/blockchain/BlockchainAdapter');

describe('EscrowChainSync.js', () => {
  const validAction = {
    transactionId: 'tx12345',
    actionType: 'deposit',
    userId: 'user456',
    metadata: { method: 'wire' }
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('syncEscrowAction()', () => {
    it('logs a valid escrow action to internal DB', async () => {
      Escrow.create.mockResolvedValue({ ...validAction, syncedToBlockchain: false });
      const result = await EscrowChainSync.syncEscrowAction(validAction);
      expect(result.success).toBe(true);
      expect(Escrow.create).toHaveBeenCalledWith(expect.objectContaining({ transactionId: 'tx12345' }));
    });

    it('throws error on invalid input', async () => {
      await expect(EscrowChainSync.syncEscrowAction({})).rejects.toThrow(/Invalid escrow action input/);
    });

    it('throws error on DB failure', async () => {
      Escrow.create.mockRejectedValue(new Error('DB error'));
      await expect(EscrowChainSync.syncEscrowAction(validAction)).rejects.toThrow(/Failed to log escrow action/);
    });
  });

  describe('getEscrowStatus()', () => {
    it('returns status for a valid transaction ID', async () => {
      Escrow.findOne.mockResolvedValue({ transactionId: 'tx12345', status: 'locked' });
      const result = await EscrowChainSync.getEscrowStatus('tx12345');
      expect(result.success).toBe(true);
      expect(result.data.status).toBe('locked');
    });

    it('throws error for missing transaction', async () => {
      Escrow.findOne.mockResolvedValue(null);
      await expect(EscrowChainSync.getEscrowStatus('not-found')).rejects.toThrow(/not found/i);
    });
  });

  describe('syncToBlockchain()', () => {
    it('syncs to blockchain and updates DB with txHash', async () => {
      BlockchainAdapter.recordEscrowAction.mockResolvedValue({ txHash: '0xABC123' });
      Escrow.updateOne.mockResolvedValue({});

      const result = await EscrowChainSync.syncToBlockchain(validAction);
      expect(result.success).toBe(true);
      expect(result.txHash).toBe('0xABC123');
    });

    it('throws error on blockchain sync failure', async () => {
      BlockchainAdapter.recordEscrowAction.mockRejectedValue(new Error('Chain failure'));
      await expect(EscrowChainSync.syncToBlockchain(validAction)).rejects.toThrow(/Blockchain sync failed/);
    });
  });

  describe('getBlockchainAuditTrail()', () => {
    it('returns audit data for valid blockchain hash', async () => {
      Escrow.findOne.mockResolvedValue({ blockchainHash: '0xDEF999' });
      BlockchainAdapter.getTransactionDetails.mockResolvedValue({ status: 'confirmed' });

      const result = await EscrowChainSync.getBlockchainAuditTrail('tx12345');
      expect(result.success).toBe(true);
      expect(result.data.status).toBe('confirmed');
    });

    it('throws if no blockchain hash is found', async () => {
      Escrow.findOne.mockResolvedValue({ blockchainHash: null });
      await expect(EscrowChainSync.getBlockchainAuditTrail('tx404')).rejects.toThrow(/No blockchain record found/);
    });
  });
});

