/**
 * @file escrow.validation.ts
 * @path C:\CFH\backend\validation\escrow.validation.ts
 * @author Mini Team
 * @created 2025-06-10 [0823]
 * @purpose Defines Joi validation schemas for all incoming escrow API requests.
 * @user_impact Protects the system from invalid data and ensures data integrity.
 * @version 1.0.0
 */
import Joi from 'joi';
import { Tier } from '../utils/constants';
export const createTransactionSchema = Joi.object({
    parties: Joi.array().items(Joi.object({
        userId: Joi.string().required(),
        role: Joi.string().valid('buyer', 'seller').required()
    })).min(2).required(),
    tier: Joi.string().valid(...Object.values(Tier)).required(),
    amount: Joi.number().positive().required().when('tier', {
        switch: [
            { is: Tier.FREE, then: Joi.number().max(1000000) },
            { is: Joi.valid(Tier.STANDARD, Tier.PREMIUM), then: Joi.number().max(5000000) },
            { is: Tier.WOW_PLUS_PLUS, then: Joi.number().max(10000000) }
        ],
        otherwise: Joi.number().max(1000000)
    }).messages({
        'number.max': 'Amount exceeds the maximum limit for the selected subscription tier.'
    }),
});
export const proposeConditionSchema = Joi.object({
    description: Joi.string().min(50).max(500).required()
});
