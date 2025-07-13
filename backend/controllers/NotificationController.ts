/**
 * © 2025 CFH, All Rights Reserved
 * File: NotificationController.ts
 * Path: C:\CFH\backend\controllers\NotificationController.ts
 * Purpose: Handles creating, retrieving, and managing user notifications.
 * Author: Mini Team, Cod1, Grok
 * Date: 2025-07-07 [1815]
 * Version: 1.0.0
 * Version ID: b4c3d2e1-f0g9-h8i7-j6k5-l4m3n2o1p0q9
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: b4c3d2e1-f0g9-h8i7-j6k5-l4m3n2o1p0q9
 * Save Location: C:\CFH\backend\controllers\NotificationController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted CommonJS `require` to ESM `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created interfaces (`AuthenticatedRequest`, `SendNotificationBody`).
 *
 * 2. Error Handling & Logging [Mini]:
 * - Used `@utils/logger` and `next(error)` with custom error classes.
 *
 * 3. Validation [Grok]:
 * - Created `notification.validation.ts` with schemas for all endpoints.
 * - Incorporated stricter `message` length validation.
 *
 * 4. Authentication & Authorization [Grok]:
 * - Added role-based checks for `sendNotification`.
 *
 * 5. Services (Suggestion) [Mini]:
 * - Move database operations to `NotificationService.ts`.
 *
 * 6. Testing (Suggestion) [Cod1]:
 * - Add unit tests via `NotificationController.test.ts`.
 *
 * 7. Metadata [Grok]:
 * - Updated Author and Timestamp to reflect compliance confirmation.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import Notification, { INotification } from '@models/Notification';
import User from '@models/User';
import Auction from '@models/Auction';
import EscrowContract from '@models/EscrowContract';
import logger from '@utils/logger';
import { BadRequestError, NotFoundError, ForbiddenError, InternalServerError } from '@utils/errors';
import { getMyNotificationsValidation, sendNotificationValidation, markAsReadValidation } from '@validation/notification.validation';

/* --- Interfaces --- */
interface SendNotificationBody {
  userId: string;
  type: string;
  message: string;
  relatedId?: string;
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'user';
  };
}

/* --- Controller Functions --- */

/**
 * @function getMyNotifications
 * @desc Retrieves all notifications for the currently authenticated user.
 */
export const getMyNotifications = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'b4c3d2e1-f0g9-h8i7-j6k5-l4m3n2o1p0q9';
  try {
    const { error } = getMyNotificationsValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch notifications');
    }
    if (user.role !== 'user' && user.role !== 'admin') {
      throw new ForbiddenError('Only users or admins may fetch notifications');
    }

    const userExists = await User.findById(user.id);
    if (!userExists) {
      throw new NotFoundError('User not found');
    }

    const notifications: INotification[] = await Notification.find({ userId: user.id }).sort({ createdAt: -1 }).lean();
    res.status(200).json(notifications);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch notifications';
    logger.error(`b4c3d2e1: Error fetching notifications for user ${req.user?.id}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function sendNotification
 * @desc Creates a new notification for a user (admin only).
 */
export const sendNotification = async (req: AuthenticatedRequest<{}, {}, SendNotificationBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'b4c3d2e1-f0g9-h8i7-j6k5-l4m3n2o1p0q9';
  try {
    const { error } = sendNotificationValidation.body.validate(req.body);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to create notification');
    }
    if (user.role !== 'admin') {
      throw new ForbiddenError('Only admins may send notifications');
    }

    const { userId, type, message, relatedId } = req.body;
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      throw new NotFoundError('Target user not found');
    }

    if (relatedId) {
      let relatedExists = null;
      if (type.includes('Auction')) {
        relatedExists = await Auction.findById(relatedId);
      } else if (type.includes('Contract')) {
        relatedExists = await EscrowContract.findById(relatedId);
      }
      if (!relatedExists) {
        throw new NotFoundError(`Related ${type} not found for relatedId`);
      }
    }

    const notification = new Notification({
      userId,
      type,
      message,
      relatedId,
    });

    const savedNotification = await notification.save();
    res.status(201).json(savedNotification);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create notification';
    logger.error(`b4c3d2e1: Error creating notification for user ${req.body.userId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function markAsRead
 * @desc Marks a specific notification as read.
 */
export const markAsRead = async (req: AuthenticatedRequest<{ notificationId: string }>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'b4c3d2e1-f0g9-h8i7-j6k5-l4m3n2o1p0q9';
  try {
    const { error } = markAsReadValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to mark notification as read');
    }
    if (user.role !== 'user' && user.role !== 'admin') {
      throw new ForbiddenError('Only users or admins may mark notifications as read');
    }

    const { notificationId } = req.params;
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    if (notification.userId.toString() !== user.id) {
      throw new ForbiddenError('User is not authorized to modify this notification');
    }

    notification.read = true;
    const updatedNotification = await notification.save();
    res.status(200).json(updatedNotification);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to mark notification as read';
    logger.error(`b4c3d2e1: Error marking notification ${req.params.notificationId} as read: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};