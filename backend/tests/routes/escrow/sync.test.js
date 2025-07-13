// 👑 Crown Certified Test — sync.test.js
// Path: backend/tests/routes/escrow/sync.test.js
// Purpose: Test escrow route for syncing, status, and blockchain audit.
// Author: Rivers Auction Team — May 16, 2025

const request = require('supertest');
const express = require('express');
const escrowRoute = require('@routes/escrow/sync');
const EscrowChainSync = require('@services/escrow/EscrowChainSync');
const logger = require('@utils/logger');

jest.mock('@services/escrow/EscrowChainSync');
jest.mock('@utils/logger');

const app = express();
app.use(express.json());
app.use('/api/escrow', escrowRoute);

describe('Escrow Route /api/escrow', () => {
  const actionData = {
    transactionId: 'tx123',
    actionType: 'deposit',
    userId: 'user001',
    metadata: { method: 'wire' },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /sync', () => {
    it('syncs to DB only (free tier)', async () => {
      EscrowChainSync.syncEscrowAction.mockResolvedValue({ data: { id: '1' } });

      const res = await request(app)
        .post('/api/escrow/sync')
        .send(actionData);

      expect(res.statusCode).toBe(201);
      expect(EscrowChainSync.syncEscrowAction).toHaveBeenCalledWith(actionData);
      expect(EscrowChainSync.syncToBlockchain).not.toHaveBeenCalled();
    });

    it('syncs to blockchain when isPremium=true', async () => {
      EscrowChainSync.syncEscrowAction.mockResolvedValue({ data: { id: '1' } });
      EscrowChainSync.syncToBlockchain.mockResolvedValue({ txHash: '0xABC' });

      const res = await request(app)
        .post('/api/escrow/sync?isPremium=true')
        .send(actionData);

      expect(res.statusCode).toBe(201);
      expect(res.body.data.blockchain.txHash).toBe('0xABC');
    });

    it('returns 400 on invalid query param', async () => {
      const res = await request(app)
        .post('/api/escrow/sync?isPremium=notaboolean')
        .send(actionData);

      expect(res.statusCode).toBe(400);
      expect(logger.error).toHaveBeenCalled();
    });

    it('returns 500 on sync failure', async () => {
      EscrowChainSync.syncEscrowAction.mockRejectedValue(new Error('DB fail'));

      const res = await request(app)
        .post('/api/escrow/sync')
        .send(actionData);

      expect(res.statusCode).toBe(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('GET /status/:transactionId', () => {
    it('returns escrow status', async () => {
      EscrowChainSync.getEscrowStatus.mockResolvedValue({ data: { status: 'locked' } });

      const res = await request(app).get('/api/escrow/status/tx123');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('locked');
    });

    it('returns 500 on failure', async () => {
      EscrowChainSync.getEscrowStatus.mockRejectedValue(new Error('Not found'));

      const res = await request(app).get('/api/escrow/status/missing');

      expect(res.statusCode).toBe(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('GET /audit/:transactionId', () => {
    it('returns audit trail if isPremium=true', async () => {
      EscrowChainSync.getBlockchainAuditTrail.mockResolvedValue({ data: { verified: true } });

      const res = await request(app).get('/api/escrow/audit/tx123?isPremium=true');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.verified).toBe(true);
    });

    it('blocks non-premium users with 403', async () => {
      const res = await request(app).get('/api/escrow/audit/tx123');

      expect(res.statusCode).toBe(403);
    });

    it('returns 500 on blockchain failure', async () => {
      EscrowChainSync.getBlockchainAuditTrail.mockRejectedValue(new Error('Chain fail'));

      const res = await request(app).get('/api/escrow/audit/tx123?isPremium=true');

      expect(res.statusCode).toBe(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });
});


