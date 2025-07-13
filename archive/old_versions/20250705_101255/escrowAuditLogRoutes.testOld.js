// 👑 Crown Certified Test — escrowAuditLogRoutes.test.js
// Path: backend/tests/routes/escrow/escrowAuditLogRoutes.test.js
// Purpose: Validate escrow audit logging routes and blockchain sync integration.
// Author: Rivers Auction Team — May 16, 2025

const request = require('supertest');
const express = require('express');
const auditRouter = require('@routes/escrow/escrowAuditLogRoutes');
const EscrowChainSync = require('@services/escrow/EscrowChainSync');
const logger = require('@utils/logger');

jest.mock('@services/escrow/EscrowChainSync');
jest.mock('@utils/logger');

const app = express();
app.use(express.json());
app.use('/api/escrow', auditRouter);

describe('escrowAuditLogRoutes.js', () => {
  const validActionData = {
    transactionId: 'txn999',
    actionType: 'deposit',
    userId: 'user777',
    metadata: { amount: 10000 }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/escrow/audit/log', () => {
    it('logs escrow action to database (free)', async () => {
      EscrowChainSync.syncEscrowAction.mockResolvedValue({ success: true });

      const res = await request(app).post('/api/escrow/audit/log').send(validActionData);

      expect(res.statusCode).toBe(201);
      expect(EscrowChainSync.syncEscrowAction).toHaveBeenCalled();
      expect(res.body.data.dbLog).toBeDefined();
    });

    it('logs to blockchain when isPremium=true', async () => {
      EscrowChainSync.syncEscrowAction.mockResolvedValue({ success: true });
      EscrowChainSync.syncToBlockchain.mockResolvedValue({ txHash: '0xabc' });

      const res = await request(app)
        .post('/api/escrow/audit/log?isPremium=true')
        .send(validActionData);

      expect(res.statusCode).toBe(201);
      expect(EscrowChainSync.syncToBlockchain).toHaveBeenCalled();
      expect(res.body.data.blockchain).toBeDefined();
    });

    it('returns 400 on invalid data', async () => {
      const res = await request(app).post('/api/escrow/audit/log').send({});
      expect(res.statusCode).toBe(400);
      expect(logger.error).toHaveBeenCalled();
    });

    it('returns 500 on internal error', async () => {
      EscrowChainSync.syncEscrowAction.mockRejectedValue(new Error('DB error'));
      const res = await request(app).post('/api/escrow/audit/log').send(validActionData);
      expect(res.statusCode).toBe(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('GET /api/escrow/audit/logs', () => {
    it('returns logs from DB (free)', async () => {
      EscrowChainSync.getEscrowStatus.mockResolvedValue([{ id: 'log001' }]);
      const res = await request(app).get('/api/escrow/audit/logs?transactionId=txn999');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.logs).toBeDefined();
    });

    it('returns blockchain trail when isPremium=true', async () => {
      EscrowChainSync.getEscrowStatus.mockResolvedValue([{ id: 'log001' }]);
      EscrowChainSync.getBlockchainAuditTrail.mockResolvedValue({ auditTrail: '0x456' });

      const res = await request(app)
        .get('/api/escrow/audit/logs?transactionId=txn999&isPremium=true');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.auditTrail).toBeDefined();
    });

    it('returns 500 on fetch failure', async () => {
      EscrowChainSync.getEscrowStatus.mockRejectedValue(new Error('DB issue'));
      const res = await request(app).get('/api/escrow/audit/logs?transactionId=txn999');
      expect(res.statusCode).toBe(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('Rate limiting simulation', () => {
    it('should allow requests without real rate-limit enforcement in test', () => {
      expect(true).toBe(true); // placeholder
    });
  });
});


