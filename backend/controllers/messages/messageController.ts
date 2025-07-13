/**
 * © 2025 CFH, All Rights Reserved
 * File: messageController.ts
 * Path: C:\CFH\backend\controllers\messages\messageController.ts
 * Purpose: Handles sending, retrieving, and managing user messages.
 * Author: Mini Team
 * Date: 2025-07-06 [1234]
 * Version: 1.0.0
 * Version ID: w2x1y0z9-a8b7-c6d5-e4f3-g2h1i0j9k8l7
 * Crown Certified: Yes
 * Batch ID: Compliance-070625
 * Artifact ID: w2x1y0z9-a8b7-c6d5-e4f3-g2h1i0j9k8l7
 * Save Location: C:\CFH\backend\controllers\messages\messageController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted CommonJS `require` to ESM `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created interfaces (`SendMessageBody`, `AuthenticatedRequest`).
 *
 * 2. Error Handling & Logging [Mini]:
 * - Used `@utils/logger` and `next(error)` with custom error classes.
 *
 * 3. Services (Suggestion) [Mini]:
 * - Move message logic to `MessageService.ts`.
 *
 * 4. Notifications (Suggestion) [Mini]:
 * - Abstract Socket.IO and `sendNotification` to `NotificationService.ts`.
 *
 * 5. Testing (Suggestion) [Grok]:
 * - Add unit tests for all endpoints.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import Message, { IMessage } from '@models/message/Message';
import User from '@models/User';
import Dispute from '@models/Dispute';
import logger from '@utils/logger';
import { NotFoundError, InternalServerError, ForbiddenError, BadRequestError } from '@utils/errors';
import { sendMessageValidation, getMessagesBetweenUsersValidation, getMessagesByDisputeIdValidation, markMessageAsReadValidation, deleteMessageForUserValidation } from '@validation/message.validation';
import { sendNotification } from '@services/NotificationService';

/* --- Interfaces --- */
interface SendMessageBody {
  senderId: string;
  recipientId: string;
  content: string;
  disputeId?: string;
  attachments?: string[];
  messageType?: 'text' | 'image' | 'file';
}

interface AuthenticatedRequest extends Request {
  user?: { id: string };
  io?: SocketIOServer;
}

/* --- Controller Functions --- */

/**
 * @function sendMessage
 * @desc Creates a new message and notifies the recipient.
 */
export const sendMessage = async (req: AuthenticatedRequest<{}, {}, SendMessageBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'w2x1y0z9-a8b7-c6d5-e4f3-g2h1i0j9k8l7';
  try {
    const { error } = sendMessageValidation.body.validate(req.body);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to send message');
    }

    const { senderId, recipientId, content, disputeId, attachments, messageType } = req.body;

    if (senderId !== user.id) {
      throw new ForbiddenError('User can only send messages as themselves');
    }

    const [recipient, dispute] = await Promise.all([
      User.findById(recipientId),
      disputeId ? Dispute.findById(disputeId) : Promise.resolve(null),
    ]);

    if (!recipient) {
      throw new NotFoundError('Recipient not found');
    }
    if (disputeId && !dispute) {
      throw new NotFoundError('Dispute not found');
    }

    const newMessage = new Message({
      senderId,
      recipientId,
      content,
      disputeId,
      attachments: attachments || [],
      messageType: messageType || 'text',
    });

    const savedMessage = await newMessage.save();

    await sendNotification({
      userId: recipientId,
      type: 'message',
      message: '📨 You received a new message',
      link: `/messages/${senderId}`,
    });

    if (req.io) {
      req.io.to(recipientId.toString()).emit('message:new', savedMessage);
    }

    res.status(201).json(savedMessage);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
    logger.error(`w2x1y0z9: Error sending message from ${req.body.senderId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function getMessagesBetweenUsers
 * @desc Retrieves the message history between two users.
 */
export const getMessagesBetweenUsers = async (req: AuthenticatedRequest<{ userA: string; userB: string }>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'w2x1y0z9-a8b7-c6d5-e4f3-g2h1i0j9k8l7';
  try {
    const { error } = getMessagesBetweenUsersValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch messages');
    }

    const { userA, userB } = req.params;
    if (userA !== user.id && userB !== user.id) {
      throw new ForbiddenError('User can only fetch their own messages');
    }

    const [userAExists, userBExists] = await Promise.all([
      User.findById(userA),
      User.findById(userB),
    ]);

    if (!userAExists || !userBExists) {
      throw new NotFoundError('One or both users not found');
    }

    const messages: IMessage[] = await Message.find({
      $or: [
        { senderId: userA, recipientId: userB, deletedBySender: false },
        { senderId: userB, recipientId: userA, deletedByRecipient: false },
      ],
    }).sort({ createdAt: 1 }).lean();

    res.status(200).json(messages);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch messages';
    logger.error(`w2x1y0z9: Error fetching messages between ${req.params.userA} and ${req.params.userB}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function getMessagesByDisputeId
 * @desc Retrieves all messages associated with a specific dispute.
 */
export const getMessagesByDisputeId = async (req: AuthenticatedRequest<{ disputeId: string }>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'w2x1y0z9-a8b7-c6d5-e4f3-g2h1i0j9k8l7';
  try {
    const { error } = getMessagesByDisputeIdValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch dispute messages');
    }

    const { disputeId } = req.params;
    const dispute = await Dispute.findById(disputeId);
    if (!dispute) {
      throw new NotFoundError('Dispute not found');
    }

    const messages: IMessage[] = await Message.find({ disputeId }).sort({ createdAt: 1 }).lean();
    res.status(200).json(messages);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dispute messages';
    logger.error(`w2x1y0z9: Error fetching messages for dispute ${req.params.disputeId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function markMessageAsRead
 * @desc Marks a specific message as read.
 */
export const markMessageAsRead = async (req: AuthenticatedRequest<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'w2x1y0z9-a8b7-c6d5-e4f3-g2h1i0j9k8l7';
  try {
    const { error } = markMessageAsReadValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to mark message as read');
    }

    const { id } = req.params;
    const message = await Message.findById(id);
    if (!message) {
      throw new NotFoundError('Message not found');
    }

    if (message.recipientId.toString() !== user.id) {
      throw new ForbiddenError('User is not authorized to mark this message as read');
    }

    message.read = true;
    await message.save();

    res.status(200).json({ message: 'Message marked as read' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to mark message as read';
    logger.error(`w2x1y0z9: Error marking message ${req.params.id} as read: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function deleteMessageForUser
 * @desc Soft-deletes a message for one of the participants.
 */
export const deleteMessageForUser = async (req: AuthenticatedRequest<{ id: string }, {}, {}, { user: string }>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'w2x1y0z9-a8b7-c6d5-e4f3-g2h1i0j9k8l7';
  try {
    const { error } = deleteMessageForUserValidation.query.validate(req.query);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }
    const paramsError = deleteMessageForUserValidation.params.validate(req.params);
    if (paramsError.error) {
      throw new BadRequestError(`Validation failed: ${paramsError.error.details[0].message}`);
    }

    const authUser = req.user;
    if (!authUser) {
      throw new BadRequestError('Authentication required to delete message');
    }

    const { id } = req.params;
    const { user } = req.query;

    if (authUser.id !== user) {
      throw new ForbiddenError('User can only delete their own messages');
    }

    const message = await Message.findById(id);
    if (!message) {
      throw new NotFoundError('Message not found');
    }

    if (message.senderId.toString() === user) {
      message.deletedBySender = true;
    } else if (message.recipientId.toString() === user) {
      message.deletedByRecipient = true;
    } else {
      throw new ForbiddenError('User is not authorized to delete this message');
    }

    await message.save();
    res.status(200).json({ message: 'Message deleted for user' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete message';
    logger.error(`w2x1y0z9: Error deleting message ${req.params.id} for user ${req.query.user}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};