/**
 * © 2025 CFH, All Rights Reserved
 * File: analytics.routes.test.ts
 * Path: backend/routes/analytics/__tests__/analytics.routes.test.ts
 * Purpose: Jest/Supertest integration tests for analytics.routes.ts (custom report, export, and notify endpoints).
 * Author: CFH Dev Team, Cod1
 * Date: 2025-07-17 [1127]
 * Version: 1.0.0
 * Crown Certified: Yes (pending)
 * Related To: backend/routes/analytics/analytics.routes.ts
 */

import request from 'supertest';
import express from 'express';
import analyticsRouter from '../analytics.routes';
import { AnalyticsService } from '@services/analytics/analytics.service';
import { NotificationService } from '@services/notification/NotificationService';

// Mock dependencies
jest.mock('@services/analytics/analytics.service');
jest.mock('@services/notification/NotificationService');
jest.mock('@services/auditLog', () => ({
  logAuditEncrypted: jest.fn(),
}));

// Setup test app
const app = express();
app.use(express.json());
app.use('/analytics', analyticsRouter);

const validToken = 'Bearer test.jwt.token';
const mockUserId = 'user123';
process.env.JWT_SECRET = 'secret';

(AnalyticsService as any).mockImplementation(() => ({
  generateCustomReport: jest.fn().mockResolvedValue({ id: 'report1', foo: 'bar' }),
  exportReport: jest.fn().mockResolvedValue({ export: 'data' }),
}));
(NotificationService as any).queueNotification = jest.fn().mockResolvedValue(true);

describe('analytics.routes.ts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /analytics/reports/custom', () => {
    it('returns 201 and custom report for valid auth and tier', async () => {
      // mock JWT verification
      jest.spyOn(require('jsonwebtoken'), 'verify').mockReturnValueOnce({ userId: mockUserId });
      const res = await request(app)
        .post('/analytics/reports/custom')
        .set('Authorization', validToken)
        .send({ tier: 'Premium', foo: 'bar' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('totalTimeMs');
    });

    it('returns 403 for missing or invalid token', async () => {
      const res = await request(app)
        .post('/analytics/reports/custom')
        .send({ tier: 'Premium', foo: 'bar' });
      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('message', 'Unauthorized');
    });

    it('returns 400 for invalid tier', async () => {
      jest.spyOn(require('jsonwebtoken'), 'verify').mockReturnValueOnce({ userId: mockUserId });
      const res = await request(app)
        .post('/analytics/reports/custom')
        .set('Authorization', validToken)
        .send({ tier: 'NotATier', foo: 'bar' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', expect.any(String));
    });
  });

  describe('GET /analytics/reports/:reportId/export', () => {
    it('returns 200 and export data for valid format', async () => {
      jest.spyOn(require('jsonwebtoken'), 'verify').mockReturnValueOnce({ userId: mockUserId });
      const res = await request(app)
        .get('/analytics/reports/report1/export')
        .set('Authorization', validToken)
        .query({ tier: 'Wow++', format: 'tableau' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('export');
      expect(res.body).toHaveProperty('totalTimeMs');
    });

    it('returns 400 for invalid format', async () => {
      jest.spyOn(require('jsonwebtoken'), 'verify').mockReturnValueOnce({ userId: mockUserId });
      const res = await request(app)
        .get('/analytics/reports/report1/export')
        .set('Authorization', validToken)
        .query({ tier: 'Wow++', format: 'excel' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Unsupported export format');
    });
  });

  describe('POST /analytics/notify', () => {
    it('queues notification and returns 200', async () => {
      const res = await request(app)
        .post('/analytics/notify')
        .send({ userId: 'foo', message: 'bar', requestId: 'baz' });
      expect(res.status).toBe(200);
      expect(NotificationService.queueNotification).toHaveBeenCalled();
    });

    it('handles notification errors', async () => {
      (NotificationService.queueNotification as jest.Mock).mockRejectedValueOnce(new Error('Notify fail'));
      const res = await request(app)
        .post('/analytics/notify')
        .send({ userId: 'foo', message: 'bar' });
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('message', 'Notification failed');
    });
  });
});
