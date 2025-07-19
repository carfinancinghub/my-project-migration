/**
 * © 2025 CFH, All Rights Reserved
 * File: UserNotifications.test.ts
 * Path: backend/tests/user/UserNotifications.test.ts
 * Purpose: Unit tests for UserNotifications service
 * Author: Cod1 Team
 * Date: 2025-07-19 [0015]
 * Version: 1.0.1
 * Version ID: p0o9i8u7y6t5r4e3w2q1a2s3d4f5g6h7
 * Crown Certified: Yes
 * Batch ID: Compliance-071925
 * Artifact ID: p0o9i8u7y6t5r4e3w2q1a2s3d4f5g6h7
 * Save Location: backend/tests/user/UserNotifications.test.ts
 */
/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Converted to TypeScript with typed mocks and user
 * - Added tests for update with invalid fields and multiple preferences
 * - Suggest extracting mock user to test utils
 * - Suggest integration tests with real notification service
 * - Improved: Typed updateNotificationPreferences and sendUserNotification returns
 * - Free: Basic update/send tests
 * - Premium: Multi-channel notifications
 * - Wow++: Personalized notification templates tests
 * - Suggestions: SMS/in-app, consent/revocation, escalation fallback, rate limiting
 */

import UserNotifications from '@services/user/UserNotifications';
import * as db from '@services/db';
import * as notifications from '@services/notifications';
import * as logger from '@utils/logger';

jest.mock('@services/db');
jest.mock('@services/notifications');
jest.mock('@utils/logger');

describe('UserNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateNotificationPreferences', () => {
    it('updates notification preferences successfully', async () => {
      const mockUser = {
        id: '123',
        settings: { notifications: { email: true, push: false }, theme: 'light' }
      };
      (db.getUser as jest.Mock).mockResolvedValueOnce(mockUser);
      (db.updateUser as jest.Mock).mockResolvedValueOnce({});

      const preferences = { email: false, push: true };
      const result = await UserNotifications.updateNotificationPreferences('123', preferences);
      expect(result.status).toBe('updated');
      expect(result.preferences).toEqual({ email: false, push: true });
      expect(db.updateUser).toHaveBeenCalledWith(
        '123',
        expect.objectContaining({
          settings: expect.objectContaining({ notifications: { email: false, push: true } })
        })
      );
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Updated notification preferences'));
    });

    it('throws error for invalid preferences', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: '123' });
      await expect(
        UserNotifications.updateNotificationPreferences('123', { invalid: true })
      ).rejects.toThrow('Invalid notification preferences');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid notification preferences'));
    });

    it('throws error when user is not found', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce(null);
      await expect(
        UserNotifications.updateNotificationPreferences('123', { email: false })
      ).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });

  describe('sendUserNotification', () => {
    it('sends notification successfully with email preference', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        settings: { notifications: { email: true, push: false, sms: false } }
      };
      (db.getUser as jest.Mock).mockResolvedValueOnce(mockUser);
      (notifications.sendEmail as jest.Mock).mockResolvedValueOnce({});

      const result = await UserNotifications.sendUserNotification('123', 'Test message', 'Test');
      expect(result.status).toBe('sent');
      expect(notifications.sendEmail).toHaveBeenCalledWith('test@example.com', 'Test message');
      expect(notifications.sendPush).not.toHaveBeenCalled();
      expect(notifications.sendSMS).not.toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Sent notification'));
    });

    it('sends notification with multiple preferences', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        phone: '1234567890',
        settings: { notifications: { email: true, push: true, sms: true } }
      };
      (db.getUser as jest.Mock).mockResolvedValueOnce(mockUser);
      (notifications.sendEmail as jest.Mock).mockResolvedValueOnce({});
      (notifications.sendPush as jest.Mock).mockResolvedValueOnce({});
      (notifications.sendSMS as jest.Mock).mockResolvedValueOnce({});

      const result = await UserNotifications.sendUserNotification('123', 'Test message', 'Test');
      expect(result.status).toBe('sent');
      expect(notifications.sendEmail).toHaveBeenCalled();
      expect(notifications.sendPush).toHaveBeenCalled();
      expect(notifications.sendSMS).toHaveBeenCalled();
    });

    it('throws error when user is not found', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce(null);
      await expect(
        UserNotifications.sendUserNotification('123', 'Test message', 'Test')
      ).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });
});

// === Wow++ Suggestions (for future extension) ===
// - Test fallback escalation: if email fails, auto-escalate to SMS or push.
// - Add GDPR/CCPA consent & notification revocation tests.
// - Test notification throttling/rate limiting per user.
// - Mock and assert audit logging for all preference and send actions.
// - Parameterize tests for all notification channel combinations.
// - Simulate DB/network failures and test retry/backoff logic.
