/**
 * © 2025 CFH, All Rights Reserved
 * File: notification.validation.ts
 * Path: C:\CFH\backend\validation\notification.validation.ts
 * Purpose: Defines Joi validation schemas for the NotificationController.
 * Author: Mini Team, Cod1, Grok
 * Date: 2025-07-07 [1838]
 * Version: 1.0.1
 * Version ID: a3b2c1d0-e9f8-g7h6-i5j4-k3l2m1n0o9p8
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: a3b2c1d0-e9f8-g7h6-i5j4-k3l2m1n0o9p8
 * Save Location: C:\CFH\backend\validation\notification.validation.ts
 */

import Joi from 'joi';

const objectIdSchema = Joi.string().hex().length(24).required();

export const getMyNotificationsValidation = {
  params: Joi.object({}),
};

export const sendNotificationValidation = {
  body: Joi.object({
    userId: objectIdSchema,
    type: Joi.string().required(),
    message: Joi.string().min(5).max(500).required(),
    relatedId: objectIdSchema.optional(),
  }),
};

export const markAsReadValidation = {
  params: Joi.object({
    notificationId: objectIdSchema,
  }),
};