/**
 * © 2025 CFH, All Rights Reserved
 * File: NotificationService.ts
 * Path: C:\CFH\backend\services\NotificationService.ts
 * Purpose: Handles the business logic for creating, retrieving, and managing user notifications.
 * Author: Mini Team, Cod1, Grok
 * Date: 2025-07-07 [1838]
 * Version: 1.0.0
 * Version ID: c5d4e3f2-g1h0-i9j8-k7l6-m5n4o3p2q1r0
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: c5d4e3f2-g1h0-i9j8-k7l6-m5n4o3p2q1r0
 * Save Location: C:\CFH\backend\services\NotificationService.ts
 */

/*
 * --- Side Note: Implementation Details ---
 *
 * 1. Separation of Concerns [Mini]:
 * - Abstracts all database interactions for notifications.
 *
 * 2. Existence Checks [Mini]:
 * - Performs existence checks on `userId` and `relatedId`.
 *
 * 3. Authorization [Mini]:
 * - Includes ownership check for `markNotificationAsRead`.
 */

import Notification, { INotification } from '@models/Notification';
import User from '@models/User';
import Auction from '@models/Auction';
import EscrowContract from '@models/EscrowContract';
import { NotFoundError, ForbiddenError } from '@utils/errors';

export class NotificationService {
  public async getNotificationsForUser(userId: string): Promise<INotification[]> {
    const userExists = await User.findById(userId);
    if (!userExists) throw new NotFoundError('User not found');

    return Notification.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  public async sendNotification(data: { userId: string; type: string; message: string; relatedId?: string }): Promise<INotification> {
    const { userId, type, message, relatedId } = data;

    const targetUser = await User.findById(userId);
    if (!targetUser) throw new NotFoundError('Target user not found');

    if (relatedId) {
      let relatedExists = null;
      if (type.includes('Auction')) relatedExists = await Auction.findById(relatedId);
      else if (type.includes('Contract')) relatedExists = await EscrowContract.findById(relatedId);
      if (!relatedExists) throw new NotFoundError(`Related ${type} not found for relatedId`);
    }

    const notification = new Notification({ userId, type, message, relatedId });
    return notification.save();
  }

  public async markNotificationAsRead(notificationId: string, userId: string): Promise<INotification> {
    const notification = await Notification.findById(notificationId);
    if (!notification) throw new NotFoundError('Notification not found');

    if (notification.userId.toString() !== userId) {
      throw new ForbiddenError('User is not authorized to modify this notification');
    }

    notification.read = true;
    return notification.save();
  }
}