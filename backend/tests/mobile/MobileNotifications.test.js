// File: MobileNotifications.test.js
// Path: C:\CFH\backend\tests\mobile\MobileNotifications.test.js
// Purpose: Unit tests for MobileNotifications service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const MobileNotifications = require('@services/mobile/MobileNotifications');
const db = require('@services/db');
const notifications = require('@services/notifications');
const logger = require('@utils/logger');

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
      db.getUser.mockResolvedValueOnce(mockUser);
      notifications.sendPush.mockResolvedValueOnce({});
      db.logMobileAction.mockResolvedValueOnce({});

      const result = await MobileNotifications.sendPushNotification('123', 'Auction ending soon!', 'alert');
      expect(result).toEqual({ status: 'sent' });
      expect(notifications.sendPush).toHaveBeenCalledWith('123', 'Auction ending soon!', 'alert');
      expect(db.logMobileAction).toHaveBeenCalledWith('123', 'send_notification', { message: 'Auction ending soon!', type: 'alert' });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Sent push notification'));
    });

    it('skips sending if push notifications are disabled', async () => {
      const mockUser = { id: '123', settings: { notifications: { push: false } } };
      db.getUser.mockResolvedValueOnce(mockUser);

      const result = await MobileNotifications.sendPushNotification('123', 'Auction ending soon!', 'alert');
      expect(result).toEqual({ status: 'skipped', reason: 'Push notifications disabled' });
      expect(notifications.sendPush).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Push notifications disabled'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(MobileNotifications.sendPushNotification('123', 'Auction ending soon!', 'alert')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });

  describe('scheduleNotification', () => {
    it('schedules push notification successfully', async () => {
      const mockUser = { id: '123', settings: { notifications: { push: true } } };
      db.getUser.mockResolvedValueOnce(mockUser);
      notifications.schedulePush.mockResolvedValueOnce({});
      db.logMobileAction.mockResolvedValueOnce({});

      const scheduleTime = '2025-05-25T12:00:00Z';
      const result = await MobileNotifications.scheduleNotification('123', 'Auction starting soon!', 'reminder', scheduleTime);
      expect(result).toEqual({ status: 'scheduled', scheduleTime });
      expect(notifications.schedulePush).toHaveBeenCalledWith('123', 'Auction starting soon!', 'reminder', scheduleTime);
      expect(db.logMobileAction).toHaveBeenCalledWith('123', 'schedule_notification', { message: 'Auction starting soon!', type: 'reminder', scheduleTime });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Scheduled push notification'));
    });

    it('skips scheduling if push notifications are disabled', async () => {
      const mockUser = { id: '123', settings: { notifications: { push: false } } };
      db.getUser.mockResolvedValueOnce(mockUser);

      const scheduleTime = '2025-05-25T12:00:00Z';
      const result = await MobileNotifications.scheduleNotification('123', 'Auction starting soon!', 'reminder', scheduleTime);
      expect(result).toEqual({ status: 'skipped', reason: 'Push notifications disabled' });
      expect(notifications.schedulePush).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Push notifications disabled'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      const scheduleTime = '2025-05-25T12:00:00Z';
      await expect(MobileNotifications.scheduleNotification('123', 'Auction starting soon!', 'reminder', scheduleTime)).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });
});

