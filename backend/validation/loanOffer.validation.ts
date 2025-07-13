/**
 * © 2025 CFH, All Rights Reserved
 * File: loanOffer.validation.ts
 * Path: C:\CFH\backend\validation\loanOffer.validation.ts
 * Purpose: Defines Joi validation schemas for the loan offer controller.
 * Author: Mini Team
 * Date: 2025-07-06 [2115]
 * Version: 1.0.0
 * Version ID: d4e3f2g1-h0i9-j8k7-l6m5-n4o3p2q1r0s9
 * Crown Certified: Yes
 * Batch ID: Compliance-070625
 * Artifact ID: d4e3f2g1-h0i9-j8k7-l6m5-n4o3p2q1r0s9
 * Save Location: C:\CFH\backend\validation\loanOffer.validation.ts
 */

import Joi from 'joi';

const objectIdSchema = Joi.string().hex().length(24).required();

export const getOffersByAuctionValidation = {
    params: Joi.object({
        auctionId: objectIdSchema,
    }),
};

export const createLoanOfferValidation = {
    body: Joi.object({
        auctionId: objectIdSchema,
        interestRate: Joi.number().min(0).max(100).required(),
        downPaymentRequired: Joi.boolean().required(),
        incomeVerificationRequired: Joi.boolean().required(),
    }),
};

export const updateLoanOfferValidation = {
    params: Joi.object({
        offerId: objectIdSchema,
    }),
    body: Joi.object({
        interestRate: Joi.number().min(0).max(100),
        downPaymentRequired: Joi.boolean(),
        incomeVerificationRequired: Joi.boolean(),
        status: Joi.string().valid('pending', 'accepted', 'rejected'),
    }).min(1), // Require at least one field to update
};
