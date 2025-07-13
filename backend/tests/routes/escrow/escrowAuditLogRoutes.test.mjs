// 👑 Crown Certified Test — escrowAuditLogRoutes.test.js
// Path: backend/tests/routes/escrow/escrowAuditLogRoutes.test.js
// Purpose: Validate /log and /logs endpoints for escrow audit logging
// Author: Rivers Auction Team — May 18, 2025
// Cod2 Crown Certified

import request from 'supertest';
import app from '@/server';
import EscrowChainSync from '@/services/escrow/EscrowChainSync';
import logger from '@/utils/logger';

jest.mock('@/services/escrow/EscrowChainSync');
jest.mock('@/utils/logger');

describe('Escrow Audit Log Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/escrow/audit/log', () => {
    it('should sync to DB for non-premium', async () => {
      EscrowChainSync.syncEscrowAction.mockResolvedValue({ status: 'logged' });
      const response = await request(app)
        .post('/api/escrow/audit/log')
        .send({ actionData: { transactionId: '123' }, isPremium: false });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(EscrowChainSync.syncEscrowAction).toHaveBeenCalled();
    });

    it('should sync to blockchain for premium', async () => {
      EscrowChainSync.syncToBlockchain.mockResolvedValue({ status: 'onChain' });
      const response = await request(app)
        .post('/api/escrow/audit/log')
        .send({ actionData: { transactionId: '123' }, isPremium: true });

      expect(response.status).toBe(200);
      expect(EscrowChainSync.syncToBlockchain).toHaveBeenCalled();
    });

    it('should return 500 on error', async () => {
      EscrowChainSync.syncEscrowAction.mockRejectedValue(new Error('DB fail'));
      const response = await request(app)
        .post('/api/escrow/audit/log')
        .send({ actionData: { transactionId: '123' }, isPremium: false });

      expect(response.status).toBe(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('GET /api/escrow/audit/logs', () => {
    it('should fetch logs from DB', async () => {
      EscrowChainSync.getEscrowStatus.mockResolvedValue([{ actionType: 'deposit' }]);
      const response = await request(app).get('/api/escrow/audit/logs?transactionId=abc');

      expect(response.status).toBe(200);
      expect(response.body.data.logs.length).toBeGreaterThan(0);
    });

    it('should fetch auditTrail for premium', async () => {
      EscrowChainSync.getBlockchainAuditTrail.mockResolvedValue({ hash: '0x123' });
      const response = await request(app).get('/api/escrow/audit/logs?transactionId=abc&isPremium=true');

      expect(response.status).toBe(200);
      expect(response.body.data.auditTrail).toBeDefined();
    });

    it('should handle server errors', async () => {
      EscrowChainSync.getEscrowStatus.mockRejectedValue(new Error('read fail'));
      const response = await request(app).get('/api/escrow/audit/logs?transactionId=bad');

      expect(response.status).toBe(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
