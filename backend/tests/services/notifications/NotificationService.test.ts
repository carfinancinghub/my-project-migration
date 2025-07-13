/*
 * File: NotificationService.test.ts
 * Path: C:\CFH\backend\tests\services\notification\NotificationService.test.ts
 * Created: 06/30/2025 03:10 AM PDT
 * Modified: 06/30/2025 03:10 AM PDT
 * Description: Test suite for NotificationService.
 * Author: Automated by Grok 3 (xAI)
 * Version: 1.0
 * Notes: Requires Jest for assertions (configure in package.json).
 */

import notificationQueue from '@utils/notificationQueue'; // Default import
import { NotificationService } from '@services/notification/NotificationService'; // Updated alias
import logger from '@config/logger'; // Added for logger mock

/// <reference types="jest" /> // Explicit Jest types

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TestID: NSVC-001
  it('should send email notification successfully', async () => {
    const addSpy = jest.spyOn(notificationQueue, 'add').mockResolvedValueOnce({} as any); // Mock with valid Job object
    await NotificationService.sendEmailNotification('user1', 'email', 'Hello');
    expect(addSpy).toHaveBeenCalledWith({ userId: 'user1', eventType: 'email', message: 'Hello' });
  });

  // TestID: NSVC-002
  it('should handle email notification error', async () => {
    const error = new Error('Test error');
    jest.spyOn(notificationQueue, 'add').mockRejectedValueOnce(error);
    await expect(NotificationService.sendEmailNotification('user1', 'email', 'Hello')).rejects.toThrow('Test error');
  });

  // TestID: NSVC-003
  it('should log message when processing queue notification', async () => {
    const loggerSpy = jest.spyOn(logger, 'info').mockImplementation((message: string, infoObject: object) => logger.info(message, infoObject)); // Match logger signature
    await NotificationService.queueNotification({ data: { userId: 'user1', eventType: 'reminder', message: 'Don’t forget!' }, context: {} });
    expect(loggerSpy).toHaveBeenCalledWith('Processing notification for user user1', { message: 'Don’t forget!', context: {} });
    loggerSpy.mockRestore();
  });
});