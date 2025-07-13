// File: WelcomeNotification.test.js
// Path: C:\CFH\backend\tests\onboarding\WelcomeNotification.test.js
// Purpose: Unit tests for WelcomeNotification service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const WelcomeNotification = require('@services/onboarding/WelcomeNotification');
const db = require('@services/db');
const notifications = require('@services/notifications');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@services/notifications');
jest.mock('@utils/logger');

describe('WelcomeNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendWelcomeEmail', () => {
    it('sends welcome email successfully', async () => {
      const mockUser = { id: '123', profile: { name: 'John Doe', email: 'john@example.com' } };
      db.getUser.mockResolvedValueOnce(mockUser);
      notifications.sendEmail.mockResolvedValueOnce({});
      db.logNotification.mockResolvedValueOnce({});

      const result = await WelcomeNotification.sendWelcomeEmail('123');
      expect(result).toEqual({ status: 'email_sent' });
      expect(notifications.sendEmail).toHaveBeenCalledWith('john@example.com', expect.stringContaining('Welcome to Rivers Auction'));
      expect(db.logNotification).toHaveBeenCalledWith('123', 'welcome_email', expect.any(Object));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Sent welcome email'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(WelcomeNotification.sendWelcomeEmail('123')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });

  describe('sendWelcomePush', () => {
    it('sends welcome push successfully', async () => {
      const mockUser = { id: '123', settings: { notifications: { push: true } } };
      db.getUser.mockResolvedValueOnce(mockUser);
      notifications.sendPush.mockResolvedValueOnce({});
      db.logNotification.mockResolvedValueOnce({});

      const result = await WelcomeNotification.sendWelcomePush('123');
      expect(result).toEqual({ status: 'push_sent' });
      expect(notifications.sendPush).toHaveBeenCalledWith('123', expect.stringContaining('Welcome to Rivers Auction'), 'welcome');
      expect(db.logNotification).toHaveBeenCalledWith('123', 'welcome_push', expect.any(Object));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Sent welcome push'));
    });

    it('skips sending if push notifications are disabled', async () => {
      const mockUser = { id: '123', settings: { notifications: { push: false } } };
      db.getUser.mockResolvedValueOnce(mockUser);

      const result = await WelcomeNotification.sendWelcomePush('123');
      expect(result).toEqual({ status: 'skipped', reason: 'Push notifications disabled' });
      expect(notifications.sendPush).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Push notifications disabled'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(WelcomeNotification.sendWelcomePush('123')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });
});

