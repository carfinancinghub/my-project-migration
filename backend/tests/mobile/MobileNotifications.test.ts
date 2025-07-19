/**
 * © 2025 CFH, All Rights Reserved
 * File: MobileNotifications.test.ts
 * Path: backend/tests/mobile/MobileNotifications.test.ts
 * Purpose: Unit tests for MobileNotifications service
 * Author: Cod1 Team
 * Date: 2025-07-19 [0015]
 * Version: 1.0.1
 * Version ID: z1x2c3v4b5n6m7l8k9j0h1g2f3d4s5a6
 * Crown Certified: Yes
 * Batch ID: Compliance-071925
 * Artifact ID: z1x2c3v4b5n6m7l8k9j0h1g2f3d4s5a6
 * Save Location: backend/tests/mobile/MobileNotifications.test.ts
 */
/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Converted to TypeScript with typed mocks and user
 * - Suggest adding tests for multiple preferences and scheduled failures
 * - Suggest extracting mock user to test utils
 * - Suggest integration tests with real notification service
 * - Improved: Typed sendPushNotification and scheduleNotification returns
 * - Free Feature: Basic push/send tests
 * - Premium Feature: Scheduled notifications, multi-channel
 * - Wow ++ Feature: Voice/SMS integration tests
 * - Suggestions: Test GDPR consent/revocation, rate limiting, delivery status escalation.
 */

import MobileNotifications from '@services/mobile/MobileNotifications';
import * as db from '@services/db';
import * as notifications from '@services/notifications';
import * as logger from '@utils/logger';

jest.mock('@services/db');
jest.mock('@services/notifications');
jest.mock('@utils/logger');

describe('MobileNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendPushNotification', () => {
    it('sends push notification successfully', async () => {
      const mockUser = { id: '123', settings: { notifications: { push: true } } };
      (db.getUser as jest.Mock).mockResolvedValueOnce(mockUser);
      (notifications.sendPush as jest.Mock).mockResolvedValueOnce({});
      (db.logMobileAction as jest.Mock).mockResolvedValueOnce({});

      const result = await MobileNotifications.sendPushNotification('123', 'Auction ending soon!', 'alert');
      expect(result).toEqual({ status: 'sent' });
      expect(notifications.sendPush).toHaveBeenCalledWith('123', 'Auction ending soon!', 'alert');
      expect(db.logMobileAction).toHaveBeenCalledWith('123', 'send_notification', { message: 'Auction ending soon!', type: 'alert' });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Sent push notification'));
    });

    it('skips sending if push notifications are disabled', async () => {
      const mockUser = { id: '123', settings: { notifications: { push: false } } };
      (db.getUser as jest.Mock).mockResolvedValueOnce(mockUser);

      const result = await MobileNotifications.sendPushNotification('123', 'Auction ending soon!', 'alert');
      expect(result).toEqual({ status: 'skipped', reason: 'Push notifications disabled' });
      expect(notifications.sendPush).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Push notifications disabled'));
    });

    it('throws error when user is not found', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce(null);
      await expect(MobileNotifications.sendPushNotification('123', 'Auction ending soon!', 'alert')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });

  describe('scheduleNotification', () => {
    it('schedules push notification successfully', async () => {
      const mockUser = { id: '123', settings: { notifications: { push: true } } };
      (db.getUser as jest.Mock).mockResolvedValueOnce(mockUser);
      (notifications.schedulePush as jest.Mock).mockResolvedValueOnce({});
      (db.logMobileAction as jest.Mock).mockResolvedValueOnce({});

      const scheduleTime = '2025-05-25T12:00:00Z';
      const result = await MobileNotifications.scheduleNotification('123', 'Auction starting soon!', 'reminder', scheduleTime);
      expect(result).toEqual({ status: 'scheduled', scheduleTime });
      expect(notifications.schedulePush).toHaveBeenCalledWith('123', 'Auction starting soon!', 'reminder', scheduleTime);
      expect(db.logMobileAction).toHaveBeenCalledWith('123', 'schedule_notification', { message: 'Auction starting soon!', type: 'reminder', scheduleTime });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Scheduled push notification'));
    });

    it('skips scheduling if push notifications are disabled', async () => {
      const mockUser = { id: '123', settings: { notifications: { push: false } } };
      (db.getUser as jest.Mock).mockResolvedValueOnce(mockUser);

      const scheduleTime = '2025-05-25T12:00:00Z';
      const result = await MobileNotifications.scheduleNotification('123', 'Auction starting soon!', 'reminder', scheduleTime);
      expect(result).toEqual({ status: 'skipped', reason: 'Push notifications disabled' });
      expect(notifications.schedulePush).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Push notifications disabled'));
    });

    it('throws error when user is not found', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce(null);
      const scheduleTime = '2025-05-25T12:00:00Z';
      await expect(MobileNotifications.scheduleNotification('123', 'Auction starting soon!', 'reminder', scheduleTime)).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });
});
