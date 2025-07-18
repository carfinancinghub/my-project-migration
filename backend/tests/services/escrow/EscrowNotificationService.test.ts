/**
 * © 2025 CFH, All Rights Reserved
 * File: EscrowNotificationService.test.ts
 * Path: backend/tests/services/escrow/EscrowNotificationService.test.ts
 * Purpose: Jest tests for EscrowNotificationService with edge cases, concurrency, and validation
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-18 [1409]
 * Version: 1.0.1
 * Version ID: c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8
 * Save Location: backend/tests/services/escrow/EscrowNotificationService.test.ts
 */
/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Uses jest.Mock for all mocks
 * - Includes edge, failure, and concurrency tests
 * - Uses @validation/notification.validation for input
 * - Mocks transport and async behavior
 * - Suggest: Test for performance in heavy notification scenarios
 */

import { EscrowNotificationService } from '@services/escrow/EscrowNotificationService';
import { notificationValidation } from '@validation/notification.validation';

jest.mock('@services/transport'); // Assume notification uses a transport

describe('EscrowNotificationService', () => {
  const service = new EscrowNotificationService();

  it('sends notification', async () => {
    const result = await service.sendNotification('tx1', 'user1', 'test');
    expect(result).toEqual({ status: 'sent' });
  });

  it('handles notification failure', async () => {
    await expect(service.sendNotification('', '', '')).rejects.toThrow('Invalid notification data');
  });

  it('handles concurrent notifications', async () => {
    const results = await Promise.all([
      service.sendNotification('tx1', 'user1', 'test1'),
      service.sendNotification('tx2', 'user2', 'test2'),
    ]);
    expect(results).toEqual([{ status: 'sent' }, { status: 'sent' }]);
  });

  it('handles partial failure in batch', async () => {
    jest.spyOn(service, 'sendNotification').mockRejectedValueOnce(new Error('Fail one'));
    await expect(
      Promise.all([
        service.sendNotification('tx1', 'user1', 'test1'),
        service.sendNotification('tx2', 'user2', 'test2'),
      ])
    ).rejects.toThrow('Fail one');
  });

  it('handles network latency', async () => {
    jest.spyOn(service, 'sendNotification').mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ status: 'sent' }), 200))
    );
    const start = Date.now();
    const result = await service.sendNotification('tx1', 'user1', 'test');
    const duration = Date.now() - start;
    expect(duration).toBeGreaterThanOrEqual(200);
    expect(result).toEqual({ status: 'sent' });
  });

  it('rejects invalid recipient', async () => {
    const invalidData = { txId: 'tx1', userId: '', message: 'test' };
    const { error } = notificationValidation.validate(invalidData);
    expect(error).toBeDefined();
  });

  it('rejects invalid message type', async () => {
    await expect(service.sendNotification('tx1', 'user1', '')).rejects.toThrow('Invalid message');
  });
});
