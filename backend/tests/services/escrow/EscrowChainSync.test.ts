/**
 * © 2025 CFH, All Rights Reserved
 * File: EscrowChainSync.test.ts
 * Path: backend/tests/services/escrow/EscrowChainSync.test.ts
 * Purpose: Jest tests for escrow syncing, blockchain integration, and premium audit trail logic.
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-18 [1416]
 * Version: 1.0.1
 * Version ID: e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0
 * Save Location: backend/tests/services/escrow/EscrowChainSync.test.ts
 */
/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Used jest.Mock for all mocks, premium audit and concurrency cases
 * - Added edge case, error, race condition, and network simulation tests
 * - Suggest: Extract test data to utils for maintainability
 */

import EscrowChainSync from '@services/escrow/EscrowChainSync';
import * as Escrow from '@models/Escrow';
import * as BlockchainAdapter from '@services/blockchain/BlockchainAdapter';

jest.mock('@models/Escrow');
jest.mock('@services/blockchain/BlockchainAdapter');

describe('EscrowChainSync.ts', () => {
  const validAction = {
    transactionId: 'tx12345',
    actionType: 'deposit',
    userId: 'user456',
    metadata: { method: 'wire' },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('syncEscrowAction()', () => {
    it('logs a valid escrow action to internal DB', async () => {
      (Escrow.create as jest.Mock).mockResolvedValue({ ...validAction, syncedToBlockchain: false });
      const result = await EscrowChainSync.syncEscrowAction(validAction);
      expect(result.success).toBe(true);
      expect(Escrow.create).toHaveBeenCalledWith(expect.objectContaining({ transactionId: 'tx12345' }));
    });

    it('throws error on invalid input', async () => {
      await expect(EscrowChainSync.syncEscrowAction({})).rejects.toThrow(/Invalid escrow action input/);
    });

    it('throws error on DB failure', async () => {
      (Escrow.create as jest.Mock).mockRejectedValue(new Error('DB error'));
      await expect(EscrowChainSync.syncEscrowAction(validAction)).rejects.toThrow(/Failed to log escrow action/);
    });
  });

  describe('getEscrowStatus()', () => {
    it('returns status for a valid transaction ID', async () => {
      (Escrow.findOne as jest.Mock).mockResolvedValue({ transactionId: 'tx12345', status: 'locked' });
      const result = await EscrowChainSync.getEscrowStatus('tx12345');
      expect(result.success).toBe(true);
      expect(result.data.status).toBe('locked');
    });

    it('throws error for missing transaction', async () => {
      (Escrow.findOne as jest.Mock).mockResolvedValue(null);
      await expect(EscrowChainSync.getEscrowStatus('not-found')).rejects.toThrow(/not found/i);
    });
  });

  describe('syncToBlockchain()', () => {
    it('syncs to blockchain and updates DB with txHash', async () => {
      (BlockchainAdapter.recordEscrowAction as jest.Mock).mockResolvedValue({ txHash: '0xABC123' });
      (Escrow.updateOne as jest.Mock).mockResolvedValue({});
      const result = await EscrowChainSync.syncToBlockchain(validAction);
      expect(result.success).toBe(true);
      expect(result.txHash).toBe('0xABC123');
    });

    it('throws error on blockchain sync failure', async () => {
      (BlockchainAdapter.recordEscrowAction as jest.Mock).mockRejectedValue(new Error('Chain failure'));
      await expect(EscrowChainSync.syncToBlockchain(validAction)).rejects.toThrow(/Blockchain sync failed/);
    });
  });

  describe('getBlockchainAuditTrail()', () => {
    it('returns audit data for valid blockchain hash', async () => {
      (Escrow.findOne as jest.Mock).mockResolvedValue({ blockchainHash: '0xDEF999' });
      (BlockchainAdapter.getTransactionDetails as jest.Mock).mockResolvedValue({ status: 'confirmed' });
      const result = await EscrowChainSync.getBlockchainAuditTrail('tx12345');
      expect(result.success).toBe(true);
      expect(result.data.status).toBe('confirmed');
    });

    it('throws if no blockchain hash is found', async () => {
      (Escrow.findOne as jest.Mock).mockResolvedValue({ blockchainHash: null });
      await expect(EscrowChainSync.getBlockchainAuditTrail('tx404')).rejects.toThrow(/No blockchain record found/);
    });

    it('handles premium audit with extra details', async () => {
      (Escrow.findOne as jest.Mock).mockResolvedValue({ blockchainHash: '0xPREM123', premium: true });
      (BlockchainAdapter.getTransactionDetails as jest.Mock).mockResolvedValue({ status: 'confirmed', extra: 'premium data' });
      const result = await EscrowChainSync.getBlockchainAuditTrail('txプレミアム');
      expect(result.data.extra).toBe('premium data');
    });
  });

  it('handles race condition in syncEscrowAction', async () => {
    (Escrow.create as jest.Mock).mockResolvedValueOnce({ ...validAction, syncedToBlockchain: false });
    await Promise.all([
      EscrowChainSync.syncEscrowAction(validAction),
      EscrowChainSync.syncEscrowAction(validAction),
    ]);
    expect(Escrow.create).toHaveBeenCalledTimes(2);
  });

  it('handles network error in syncToBlockchain', async () => {
    (BlockchainAdapter.recordEscrowAction as jest.Mock).mockRejectedValue(new Error('Network error'));
    await expect(EscrowChainSync.syncToBlockchain(validAction)).rejects.toThrow(/Blockchain sync failed/);
  });
});
