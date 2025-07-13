/**
 * © 2025 CFH, All Rights Reserved
 * File: MessageController.ts
 * Path: C:\CFH\backend\controllers\MessageController.ts
 * Purpose: Handles retrieving and sending messages in the CFH Automotive Ecosystem.
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-08 [0738]
 * Version: 1.0.1
 * Version ID: u1v0w9x8-y7z6-a5b4-c3d2-e1f0g9h8i7j6
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: u1v0w9x8-y7z6-a5b4-c3d2-e1f0g9h8i7j6
 * Save Location: C:\CFH\backend\controllers\MessageController.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Grok]:
 * - Converted CommonJS to TypeScript with ESM imports.
 * - Added Express `Request`, `Response`, and `NextFunction` types.
 * - Created interfaces (`SendMessageBody`, `AuthenticatedRequest`).
 *
 * 2. Error Handling & Logging [Grok]:
 * - Used `@utils/logger` with `Artifact ID` prefix and `next(error)`.
 *
 * 3. Validation [Grok]:
 * - Added Joi validation via `@validation/message.validation.ts`.
 *
 * 4. Authentication & Authorization [Grok]:
 * - Added `req.user` checks and role-based authorization.
 *
 * 5. Services (Suggestion) [Grok]:
 * - Move database operations to `MessageService.ts`.
 *
 * 6. Testing (Suggestion) [Grok]:
 * - Add unit tests for all endpoints.
 *
 * 7. Metadata [Grok]:
 * - Updated Author and Timestamp to distinguish from Mini’s version.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import Message, { IMessage } from '@models/Message';
import Conversation from '@models/Conversation';
import User from '@models/User';
import logger from '@utils/logger';
import { BadRequestError, NotFoundError, ForbiddenError, InternalServerError } from '@utils/errors';
import { getMessagesByConversationValidation, sendMessageValidation } from '@validation/message.validation';

/* --- Interfaces --- */
interface SendMessageBody {
  conversationId: string;
  content: string;
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'seller' | 'buyer';
  };
}

/* --- Controller Functions --- */

/**
 * @function getMessagesByConversation
 * @desc Retrieves all messages for a specific conversation.
 */
export const getMessagesByConversation = async (req: AuthenticatedRequest<{ conversationId: string }>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'u1v0w9x8-y7z6-a5b4-c3d2-e1f0g9h8i7j6';
  try {
    const { error } = getMessagesByConversationValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to fetch messages');
    }
    if (user.role !== 'admin' && user.role !== 'seller' && user.role !== 'buyer') {
      throw new ForbiddenError('Only admins, sellers, or buyers may fetch messages');
    }

    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    if (!conversation.participants.includes(user.id) && user.role !== 'admin') {
      throw new ForbiddenError('User is not a participant in this conversation');
    }

    const messages: IMessage[] = await Message.find({ conversationId })
      .populate('senderId', 'name')
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json(messages);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch messages';
    logger.error(`u1v0w9x8: Error fetching messages for conversation ${req.params.conversationId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function sendMessage
 * @desc Sends a new message in a conversation.
 */
export const sendMessage = async (req: AuthenticatedRequest<{}, {}, SendMessageBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'u1v0w9x8-y7z6-a5b4-c3d2-e1f0g9h8i7j6';
  try {
    const { error } = sendMessageValidation.body.validate(req.body);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const user = req.user;
    if (!user) {
      throw new BadRequestError('Authentication required to send message');
    }
    if (user.role !== 'admin' && user.role !== 'seller' && user.role !== 'buyer') {
      throw new ForbiddenError('Only admins, sellers, or buyers may send messages');
    }

    const { conversationId, content } = req.body;
    const [conversation, sender] = await Promise.all([
      Conversation.findById(conversationId),
      User.findById(user.id),
    ]);

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }
    if (!sender) {
      throw new NotFoundError('Sender not found');
    }
    if (!conversation.participants.includes(user.id) && user.role !== 'admin') {
      throw new ForbiddenError('User is not a participant in this conversation');
    }

    const message = new Message({
      conversationId,
      senderId: user.id,
      content,
    });

    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
    logger.error(`u1v0w9x8: Error sending message in conversation ${req.body.conversationId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};