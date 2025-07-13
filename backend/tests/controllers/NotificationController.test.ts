/**
 * © 2025 CFH, All Rights Reserved
 * File: NotificationController.test.ts
 * Path: C:\CFH\backend\tests\controllers\NotificationController.test.ts
 * Purpose: Unit tests for the NotificationController.
 * Author: Mini Team, Cod1, Grok
 * Date: 2025-07-07 [1838]
 * Version: 1.0.0
 * Version ID: f7g6h5i4-j3k2-l1m0-n9o8-p7q6r5s4t3u2
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: f7g6h5i4-j3k2-l1m0-n9o8-p7q6r5s4t3u2
 * Save Location: C:\CFH\backend\tests\controllers\NotificationController.test.ts
 */

import { getMyNotifications, sendNotification, markAsRead } from '@controllers/NotificationController';
import { NotificationService } from '@services/NotificationService';
import { BadRequestError, ForbiddenError, NotFoundError } from '@utils/errors';
import { getMyNotificationsValidation, sendNotificationValidation, markAsReadValidation } from '@validation/notification.validation';

jest.mock('@services/NotificationService');

describe('NotificationController', () => {
  let req: any, res: any, next: any;
  let notificationServiceMock: jest.Mocked<NotificationService>;

  beforeEach(() => {
    req = { user: { id: 'user123', role: 'user' }, params: {}, body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    notificationServiceMock = new NotificationService() as jest.Mocked<NotificationService>;
    (NotificationService as jest.Mock).mockImplementation(() => notificationServiceMock);
  });

  describe('getMyNotifications', () => {
    it('should return notifications for an authenticated user', async () => {
      const notifications = [{ userId: 'user123', type: 'test', message: 'Hello' }];
      notificationServiceMock.getNotificationsForUser.mockResolvedValue(notifications);
      await getMyNotifications(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(notifications);
    });

    it('should call next with BadRequestError if user is not authenticated', async () => {
      req.user = null;
      await getMyNotifications(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    it('should call next with NotFoundError if user does not exist', async () => {
      notificationServiceMock.getNotificationsForUser.mockRejectedValue(new NotFoundError('User not found'));
      await getMyNotifications(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
    });
  });

  describe('sendNotification', () => {
    it('should allow an admin to send a notification', async () => {
      req.user.role = 'admin';
      req.body = { userId: 'user456', type: 'test', message: 'Hello World' };
      const notification = { userId: 'user456', type: 'test', message: 'Hello World' };
      notificationServiceMock.sendNotification.mockResolvedValue(notification);
      await sendNotification(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(notification);
    });

    it('should deny a non-admin from sending a notification', async () => {
      req.user.role = 'user';
      await sendNotification(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    it('should call next with BadRequestError if validation fails', async () => {
      req.user.role = 'admin';
      req.body = { userId: 'user456', type: '' };
      await sendNotification(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read for an authorized user', async () => {
      req.params = { notificationId: 'notif123' };
      const notification = { userId: 'user123', read: true };
      notificationServiceMock.markNotificationAsRead.mockResolvedValue(notification);
      await markAsRead(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(notification);
    });

    it('should call next with ForbiddenError if user is unauthorized', async () => {
      req.params = { notificationId: 'notif123' };
      notificationServiceMock.markNotificationAsRead.mockRejectedValue(new ForbiddenError('User is not authorized'));
      await markAsRead(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    it('should call next with NotFoundError if notification does not exist', async () => {
      req.params = { notificationId: 'notif123' };
      notificationServiceMock.markNotificationAsRead.mockRejectedValue(new NotFoundError('Notification not found'));
      await markAsRead(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
    });
  });
});