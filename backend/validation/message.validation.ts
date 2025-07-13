/**
 * © 2025 CFH, All Rights Reserved
 * File: message.validation.ts
 * Path: C:\CFH\backend\validation\message.validation.ts
 * Purpose: Defines Joi validation schemas for the message controller.
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-08 [0738]
 * Version: 1.0.1
 * Version ID: u1v0w9x8-y7z6-a5b4-c3d2-e1f0g9h8i7j6
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: u1v0w9x8-y7z6-a5b4-c3d2-e1f0g9h8i7j6
 * Save Location: C:\CFH\backend\validation\message.validation.ts
 */

import Joi from 'joi';

const objectIdSchema = Joi.string().hex().length(24).required();

export const getMessagesByConversationValidation = {
  params: Joi.object({
    conversationId: objectIdSchema,
  }),
};

export const sendMessageValidation = {
  body: Joi.object({
    conversationId: objectIdSchema,
    content: Joi.string().min(1).max(2000).required(),
  }),
};