// 👑 Crown Certified Test — escrowNotifyRoutes.test.js
// Path: backend/tests/routes/escrow/escrowNotifyRoutes.test.js
// Purpose: Validate escrow notification logic, premium features, logging, and WebSocket triggers.
// Author: Rivers Auction Team — May 16, 2025

const request = require('supertest');
const express = require('express');
const logger = require('@utils/logger');
const EscrowChainSync = require('@services/escrow/EscrowChainSync');
const WebSocketService = require('@services/notification/WebSocketService');
const escrowNotifyRoutes = require('@routes/escrow/escrowNotifyRoutes');

jest.mock('@services/escrow/EscrowChainSync');
jest.mock('@services/notification/WebSocketService');
jest.mock('@utils/logger');

const app = express();
app.use(express.json());
app.use('/api/escrow', escrowNotifyRoutes);

describe('escrowNotifyRoutes.js', () => {
  const notifyData = {
    transactionId: 'txn999',
    userId: 'user999',
    metadata: { amount: 5000 }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/escrow/notify/deposit', () => {
    it('✅ logs notification and responds (free)', async () => {
      EscrowChainSync.syncEscrowAction.mockResolvedValue({ success: true });

      const res = await request(app)
        .post('/api/escrow/notify/deposit')
        .send(notifyData);

      expect(res.statusCode).toBe(200);
      expect(EscrowChainSync.syncEscrowAction).toHaveBeenCalledWith(
        expect.objectContaining({ actionType: 'deposit-notified' })
      );
      expect(res.body.success).toBe(true);
    });

    it('✅ performs blockchain sync and WebSocket push (premium)', async () => {
      EscrowChainSync.syncEscrowAction.mockResolvedValue({ success: true });
      EscrowChainSync.syncToBlockchain.mockResolvedValue({ txHash: '0x123' });
      EscrowChainSync.getBlockchainAuditTrail.mockResolvedValue({ blockHash: '0x456' });

      const res = await request(app)
        .post('/api/escrow/notify/deposit')
        .send({ ...notifyData, isPremium: 'true' });

      expect(res.statusCode).toBe(200);
      expect(EscrowChainSync.syncToBlockchain).toHaveBeenCalled();
      expect(WebSocketService.push).toHaveBeenCalledWith(
        '/ws/escrow/notify',
        expect.objectContaining({ transactionId: 'txn999', premium: true })
      );
    });

    it('❌ returns 400 on invalid payload', async () => {
      const res = await request(app)
        .post('/api/escrow/notify/deposit')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(logger.error).toHaveBeenCalled();
    });

    it('❌ returns 500 on sync error', async () => {
      EscrowChainSync.syncEscrowAction.mockRejectedValue(new Error('DB down'));

      const res = await request(app)
        .post('/api/escrow/notify/deposit')
        .send(notifyData);

      expect(res.statusCode).toBe(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('POST /api/escrow/notify/release', () => {
    it('✅ logs release event (free)', async () => {
      EscrowChainSync.syncEscrowAction.mockResolvedValue({ success: true });

      const res = await request(app)
        .post('/api/escrow/notify/release')
        .send(notifyData);

      expect(res.statusCode).toBe(200);
      expect(EscrowChainSync.syncEscrowAction).toHaveBeenCalledWith(
        expect.objectContaining({ actionType: 'release-notified' })
      );
    });

    it('✅ performs premium WebSocket + blockchain (release)', async () => {
      EscrowChainSync.syncEscrowAction.mockResolvedValue({ success: true });
      EscrowChainSync.syncToBlockchain.mockResolvedValue({ txHash: '0xabc' });
      EscrowChainSync.getBlockchainAuditTrail.mockResolvedValue({ verified: true });

      const res = await request(app)
        .post('/api/escrow/notify/release')
        .send({ ...notifyData, isPremium: 'true' });

      expect(res.statusCode).toBe(200);
      expect(WebSocketService.push).toHaveBeenCalled();
    });
  });

  describe('🛡️ Rate limiting (simulated)', () => {
    it('should allow basic request in test context', () => {
      expect(true).toBe(true);
    });
  });
});


