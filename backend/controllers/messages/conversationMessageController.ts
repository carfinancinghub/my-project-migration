/**
 * © 2025 CFH, All Rights Reserved
 * File: conversationMessageController.ts
 * Path: C:\CFH\backend\controllers\messages\conversationMessageController.ts
 * Purpose: Handles sending and retrieving messages within a conversation.
 * Author: Mini Team
 * Date: 2025-07-06 [1639]
 * Version: 1.0.0
 * Version ID: z1a0b9c8-d7e6-f5g4-h3i2-j1k0l9m8n7o6
 * Crown Certified: Yes
 * Batch ID: Compliance-070625
 * Artifact ID: z1a0b9c8-d7e6-f5g4-h3i2-j1k0l9m8n7o6
 * Save Location: C:\CFH\backend\controllers\messages\conversationMessageController.ts
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
 * 4. Testing (Suggestion) [Grok]:
 * - Add unit tests for `getMessagesByConversation` and `sendMessage`.
 */

/* --- Dependencies --- */
import { Request, Response, NextFunction } from 'express';
import Message, { IMessage } from '@models/Message';
import Conversation from '@models/Conversation';
import User from '@models/User';
import logger from '@utils/logger';
import { BadRequestError, InternalServerError, NotFoundError, ForbiddenError } from '@utils/errors';
import { getMessagesByConversationValidation, sendMessageValidation } from '@validation/message.validation';

/* --- Interfaces --- */
interface SendMessageBody {
  conversationId: string;
  content: string;
}

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

/* --- Controller Functions --- */

/**
 * @function getMessagesByConversation
 * @desc Retrieves all messages for a specific conversation, sorted by creation date.
 */
export const getMessagesByConversation = async (req: AuthenticatedRequest<{ conversationId: string }>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'z1a0b9c8-d7e6-f5g4-h3i2-j1k0l9m8n7o6';
  try {
    const { error } = getMessagesByConversationValidation.params.validate(req.params);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestError('Authentication required to fetch messages');
    }

    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    if (!conversation.participants.includes(userId)) {
      throw new ForbiddenError('User is not a participant in this conversation');
    }

    const messages: IMessage[] = await Message.find({ conversationId }).sort({ createdAt: 1 }).lean();
    res.status(200).json(messages);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch messages';
    logger.error(`z1a0b9c8: Error fetching messages for conversation ${req.params.conversationId}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};

/**
 * @function sendMessage
 * @desc Creates and saves a new message to a conversation.
 */
export const sendMessage = async (req: AuthenticatedRequest<{}, {}, SendMessageBody>, res: Response, next: NextFunction): Promise<void> => {
  const ARTIFACT_ID = 'z1a0b9c8-d7e6-f5g4-h3i2-j1k0l9m8n7o6';
  try {
    const { error } = sendMessageValidation.body.validate(req.body);
    if (error) {
      throw new BadRequestError(`Validation failed: ${error.details[0].message}`);
    }

    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestError('Authentication required to send a message');
    }

    const { conversationId, content } = req.body;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    if (!conversation.participants.includes(userId)) {
      throw new ForbiddenError('User is not a participant in this conversation');
    }

    const sender = await User.findById(userId);
    if (!sender) {
      throw new NotFoundError('Sender not found');
    }

    const message = new Message({
      conversationId,
      senderId: userId,
      content,
    });

    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
    logger.error(`z1a0b9c8: Error sending message in conversation ${req.body.conversationId} by ${req.user?.id}: ${errorMessage}`);
    if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new InternalServerError(errorMessage));
    }
  }
};