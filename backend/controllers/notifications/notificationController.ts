/**
 * © 2025 CFH, All Rights Reserved
 * File: notificationController.ts
 * Path: C:\CFH\backend\controllers\notifications\notificationController.ts
 * Purpose: Handles fetching, counting, and managing user notifications.
 * Author: Mini Team
 * Date: 2025-07-06 [1300]
 * Version: 1.0.0
 * Version ID: x4y3z2a1-b0c9-d8e7-f6g5-h4i3j2k1l0m9
 * Crown Certified: Yes
 * Batch ID: Compliance-070625
 * Artifact ID: x4y3z2a1-b0c9-d8e7-f6g5-h4i3j2k1l0m9
 * Save Location: C:\CFH\backend\controllers\notifications\notificationController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted CommonJS `require` to ESM `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created `AuthenticatedRequest` interface.
 *
 * 2. Error Handling & Logging [Mini]:
 * - Used `@utils/logger` and `next(error)` with custom error classes.
 *
 * 3. Services (Suggestion) [Mini]:
 * - Move database operations to `NotificationService.ts`.
 *
 * 4. Testing (Suggestion) [Grok]:
 * - Add unit tests for all endpoints.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import Notification, { INotification } from '@models/notification/Notification';
import { enhanceNotification } from '@utils/notificationEnhancer';
import logger from '@utils/logger';
import { NotFoundError, InternalServerError, BadRequestError, ForbiddenError } from '@utils/errors';
import { notificationIdValidation } from '@validation/notification.validation';

/* --- Interfaces --- */
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

/* --- Controller Functions --- */

/**
 * @function getAllNotifications
 * @desc Fetches all notifications for the authenticated user.
 */
export const getAllNotifications = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'x4y3z2a1-b0c9-d8e7-f6g5-h4i3j2k1l0m9';
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestError('Authentication required to fetch notifications');
    }

    const notifications: INotification[] = await Notification.find({ userId }).sort({ createdAt: -1 }).lean();
    res.status(200).json(notifications.map(enhanceNotification));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch notifications';
    logger.error(`x4y3z2a1: Error fetching notifications for user ${req.user?.id}: ${errorMessage}`);
    if (error instanceof BadRequestError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function getUnreadCount
 * @desc Gets the count of unread notifications for the authenticated user.
 */
export const getUnreadCount = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'x4y3z2a1-b0c9-d8e7-f6g5-h4i3j2k1l0m9';
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestError('Authentication required to fetch unread count');
    }

    const count = await Notification.countDocuments({
      userId,
      read: false,
    });

    res.status(200).json({ unreadCount: count });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch unread count';
    logger.error(`x4y3z2a1: Error fetching unread count for user ${req.user?.id}: ${errorMessage}`);
    if (error instanceof BadRequestError) {
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
export const markAsRead = async (req: AuthenticatedRequest<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'x4y3z2a1-b0c9-d8e7-f6g5-h4i3j2k1l0m9';
  try {
    const { error } = notificationIdValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestError('Authentication required to mark notification as read');
    }

    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    if (notification.userId.toString() !== userId) {
      throw new ForbiddenError('User is not authorized to mark this notification as read');
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to mark notification as read';
    logger.error(`x4y3z2a1: Error marking notification ${req.params.id} as read for user ${req.user?.id}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function deleteNotification
 * @desc Deletes a specific notification.
 */
export const deleteNotification = async (req: AuthenticatedRequest<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'x4y3z2a1-b0c9-d8e7-f6g5-h4i3j2k1l0m9';
  try {
    const { error } = notificationIdValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestError('Authentication required to delete notification');
    }

    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    if (notification.userId.toString() !== userId) {
      throw new ForbiddenError('User is not authorized to delete this notification');
    }

    await Notification.findByIdAndDelete(id);
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete notification';
    logger.error(`x4y3z2a1: Error deleting notification ${req.params.id} for user ${req.user?.id}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};