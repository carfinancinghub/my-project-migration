/**
 * © 2025 CFH, All Rights Reserved
 * File: transport.validation.ts
 * Path: C:\CFH\backend\validation\transport.validation.ts
 * Purpose: Defines Joi validation schemas for the transport controller.
 * Author: Mini Team, Cod1, Grok
 * Date: 2025-07-07 [1657]
 * Version: 1.0.0
 * Version ID: s9t8u7v6-w5x4-y3z2-a1b0-c9d8e7f6g5h4
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: s9t8u7v6-w5x4-y3z2-a1b0-c9d8e7f6g5h4
 * Save Location: C:\CFH\backend\validation\transport.validation.ts
 */

import Joi from 'joi';

const objectIdSchema = Joi.string().hex().length(24).required();

export const getMyTransportJobsValidation = {
  params: Joi.object({}),
};

export const createTransportJobValidation = {
  body: Joi.object({
    carId: objectIdSchema,
    haulerId: objectIdSchema,
    pickupLocation: objectIdSchema,
    dropoffLocation: objectIdSchema,
  }),
};

export const updateTransportStatusValidation = {
  params: Joi.object({
    jobId: objectIdSchema,
  }),
  body: Joi.object({
    status: Joi.string().valid('Pending', 'In Transit', 'Delivered', 'Cancelled').required(),
    notes: Joi.string().optional().allow(''),
  }),
};