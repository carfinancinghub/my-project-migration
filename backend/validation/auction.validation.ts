/**
 * © 2025 CFH, All Rights Reserved
 * File: auction.validation.ts
 * Path: C:\CFH\backend\validation\auction.validation.ts
 * Purpose: Defines Joi validation schemas for the auction controller.
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-07 [2021]
 * Version: 1.0.0
 * Version ID: a1b0c9d8-e7f6-g5h4-i3j2-k1l0m9n8o7p6
 * Crown Certified: Yes
 * Batch ID: Compliance-070725
 * Artifact ID: a1b0c9d8-e7f6-g5h4-i3j2-k1l0m9n8o7p6
 * Save Location: C:\CFH\backend\validation\auction.validation.ts
 */

import Joi from 'joi';

const objectIdSchema = Joi.string().hex().length(24).required();

export const getAuctionValidation = {
  params: Joi.object({
    auctionId: objectIdSchema,
  }),
};

export const placeBidValidation = {
  params: Joi.object({
    auctionId: objectIdSchema,
  }),
  body: Joi.object({
    amount: Joi.number().positive().required(),
  }),
};