// File: UserNotifications.test.js
// Path: C:\CFH\backend\tests\user\UserNotifications.test.js
// Purpose: Unit tests for UserNotifications service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const UserNotifications = require('@services/user/UserNotifications');
const db = require('@services/db');
const notifications = require('@services/notifications');
const logger = require('@utils/logger');

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
      db.getUser.mockResolvedValueOnce(mockUser);
      db.updateUser.mockResolvedValueOnce({});

      const preferences = { email: false, push: true };
      const result = await UserNotifications.updateNotificationPreferences('123', preferences);
      expect(result.status).toBe('updated');
      expect(result.preferences).toEqual({ email: false, push: true });
      expect(db.updateUser).toHaveBeenCalledWith('123', expect.objectContaining({
        settings: expect.objectContaining({ notifications: { email: false, push: true } })
      }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Updated notification preferences'));
    });

    it('throws error for invalid preferences', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123' });
      await expect(UserNotifications.updateNotificationPreferences('123', { invalid: true })).rejects.toThrow('Invalid notification preferences');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid notification preferences'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(UserNotifications.updateNotificationPreferences('123', { email: false })).rejects.toThrow('User not found');
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
      db.getUser.mockResolvedValueOnce(mockUser);
      notifications.sendEmail.mockResolvedValueOnce({});

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
      db.getUser.mockResolvedValueOnce(mockUser);
      notifications.sendEmail.mockResolvedValueOnce({});
      notifications.sendPush.mockResolvedValueOnce({});
      notifications.sendSMS.mockResolvedValueOnce({});

      const result = await UserNotifications.sendUserNotification('123', 'Test message', 'Test');
      expect(result.status).toBe('sent');
      expect(notifications.sendEmail).toHaveBeenCalled();
      expect(notifications.sendPush).toHaveBeenCalled();
      expect(notifications.sendSMS).toHaveBeenCalled();
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(UserNotifications.sendUserNotification('123', 'Test message', 'Test')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });
});

