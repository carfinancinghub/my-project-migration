// 👑 Crown Certified Test — escrowPaymentRoutes.test.js
// Path: backend/tests/routes/escrow/escrowPaymentRoutes.test.js
// Purpose: Validate payment initiation and status endpoints with premium blockchain/WebSocket integration.
// Author: Rivers Auction Team — May 16, 2025

const request = require('supertest');
const express = require('express');
const logger = require('@utils/logger');
const EscrowChainSync = require('@services/escrow/EscrowChainSync');
const WebSocketService = require('@services/notification/WebSocketService');
const paymentRoutes = require('@routes/escrow/escrowPaymentRoutes');

jest.mock('@services/escrow/EscrowChainSync');
jest.mock('@services/notification/WebSocketService');
jest.mock('@utils/logger');

const app = express();
app.use(express.json());
app.use('/api/escrow', paymentRoutes);

describe('escrowPaymentRoutes.js', () => {
  const transactionId = 'txn789';
  const paymentId = 'payABC123';
  const userId = 'userX';
  const amount = 15000;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/escrow/pay/initiate', () => {
    it('✅ initiates payment (free)', async () => {
      EscrowChainSync.syncEscrowAction.mockResolvedValue({});

      const res = await request(app)
        .post('/api/escrow/pay/initiate')
        .send({ transactionId, userId, amount });

      expect(res.statusCode).toBe(201);
      expect(EscrowChainSync.syncEscrowAction).toHaveBeenCalled();
      expect(res.body.success).toBe(true);
    });

    it('✅ initiates payment (premium)', async () => {
      EscrowChainSync.syncEscrowAction.mockResolvedValue({});
      EscrowChainSync.getBlockchainAuditTrail.mockResolvedValue({ blockHash: '0xblock' });
      WebSocketService.push.mockResolvedValue(true);

      const res = await request(app)
        .post('/api/escrow/pay/initiate')
        .send({ transactionId, userId, amount, isPremium: true });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.blockchain.blockHash).toBe('0xblock');
      expect(WebSocketService.push).toHaveBeenCalled();
    });

    it('❌ returns 400 if missing data', async () => {
      const res = await request(app)
        .post('/api/escrow/pay/initiate')
        .send({ amount });

      expect(res.statusCode).toBe(400);
      expect(logger.error).toHaveBeenCalled();
    });

    it('❌ returns 500 if blockchain fails', async () => {
      EscrowChainSync.syncEscrowAction.mockResolvedValue({});
      EscrowChainSync.getBlockchainAuditTrail.mockRejectedValue(new Error('Blockchain fail'));

      const res = await request(app)
        .post('/api/escrow/pay/initiate')
        .send({ transactionId, userId, amount, isPremium: true });

      expect(res.statusCode).toBe(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('GET /api/escrow/pay/status/:paymentId', () => {
    it('✅ retrieves payment status (free)', async () => {
      EscrowChainSync.getEscrowStatus.mockResolvedValue({ status: 'confirmed' });

      const res = await request(app)
        .get(`/api/escrow/pay/status/${paymentId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('confirmed');
    });

    it('✅ retrieves blockchain status (premium)', async () => {
      EscrowChainSync.getEscrowStatus.mockResolvedValue({ status: 'confirmed' });
      EscrowChainSync.getBlockchainAuditTrail.mockResolvedValue({ verified: true });

      const res = await request(app)
        .get(`/api/escrow/pay/status/${paymentId}?isPremium=true`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.blockchain.verified).toBe(true);
    });

    it('❌ returns 404 if status not found', async () => {
      EscrowChainSync.getEscrowStatus.mockResolvedValue(null);

      const res = await request(app)
        .get(`/api/escrow/pay/status/invalid`);

      expect(res.statusCode).toBe(404);
      expect(logger.error).toHaveBeenCalled();
    });

    it('❌ returns 500 on blockchain error', async () => {
      EscrowChainSync.getEscrowStatus.mockResolvedValue({ status: 'pending' });
      EscrowChainSync.getBlockchainAuditTrail.mockRejectedValue(new Error('fail'));

      const res = await request(app)
        .get(`/api/escrow/pay/status/${paymentId}?isPremium=true`);

      expect(res.statusCode).toBe(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });
});


