/**
 * © 2025 CFH, All Rights Reserved
 * File: payment.validation.ts
 * Path: C:\CFH\backend\validation\payment.validation.ts
 * Purpose: Defines Joi validation schemas for the PaymentController.
 * Author: Mini Team, Cod1, Grok
 * Date: 2025-07-07 [1800]
 * Version: 1.0.1
 * Version ID: w4x3y2z1-a0b9-c8d7-e6f5-g4h3i2j1k0l9
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: w4x3y2z1-a0b9-c8d7-e6f5-g4h3i2j1k0l9
 * Save Location: C:\CFH\backend\validation\payment.validation.ts
 */

import Joi from 'joi';

const objectIdSchema = Joi.string().hex().length(24).required();

export const getMyPaymentsValidation = {
  params: Joi.object({}),
};

export const getAllPaymentsValidation = {
  params: Joi.object({}),
};

export const createPaymentValidation = {
  body: Joi.object({
    amount: Joi.number().positive().required(),
    currency: Joi.string().length(3).uppercase().required(),
    source: Joi.string().required(),
    relatedId: objectIdSchema,
    relatedModel: Joi.string().required(),
  }),
};

export const updatePaymentStatusValidation = {
  params: Joi.object({
    paymentId: objectIdSchema,
  }),
  body: Joi.object({
    status: Joi.string().valid('Pending', 'Completed', 'Failed', 'Refunded').required(),
  }),
};