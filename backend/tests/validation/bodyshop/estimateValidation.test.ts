/*
File: estimateValidation.test.ts
Path: C:\CFH\backend\tests\validation\bodyshop\estimateValidation.test.ts
Created: 2025-07-04 13:30 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Jest test file for estimateValidation.ts with skeleton schema tests.
Artifact ID: x9y0z1a2-b3c4-d5e6-f7g8-h9i0j1k2l3m4
Version ID: y0z1a2b3-c4d5-e6f7-g8h9-i0j1k2l3m4n5
*/

import { describe, it, expect } from '@jest/globals';
import { z } from 'zod';
import {
    insuranceWebhookSchema,
    setExpirySchema,
    pendingRemindersQuerySchema,
    resolveConflictSuggestionsQuerySchema,
    resolveWithAISchema,
    respondEstimateSchema, // This is the body schema for PUT /respond
    estimateIdParamSchema // This is for path params
} from '@/backend/validation/bodyshop/estimateValidation';

// Mock logger if it was used in validation (it's been removed in the latest version)
// jest.mock('@/utils/logger', () => ({
//     info: jest.fn(),
//     warn: jest.fn(),
//     error: jest.fn(),
// }));

describe('estimateValidation Schemas', () => {

    // --- insuranceWebhookSchema Tests ---
    describe('insuranceWebhookSchema', () => {
        const baseValidWebhookPayload = {
            claimId: 'CLAIM-ABC-123',
            insuredVehicle: {
                make: 'Toyota',
                model: 'Camry',
                vin: '1HGCM82633A123456' // Valid VIN
            }
        };

        it('should validate a valid insurance webhook payload', () => {
            const result = insuranceWebhookSchema.safeParse(baseValidWebhookPayload);
            expect(result.success).toBe(true);
            // Cod1+ TODO: Verify transformed VIN
            if (result.success) {
                expect(result.data.insuredVehicle.vin).toBe('1HGCM82633A123456');
            }
        });

        it('should transform VIN to uppercase and trim whitespace', () => {
            const payloadWithUnformattedVin = {
                ...baseValidWebhookPayload,
                insuredVehicle: {
                    ...baseValidWebhookPayload.insuredVehicle,
                    vin: ' 1hgcm82633a123456 '
                }
            };
            const result = insuranceWebhookSchema.safeParse(payloadWithUnformattedVin);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.insuredVehicle.vin).toBe('1HGCM82633A123456');
            }
        });

        it('should invalidate payload with missing claimId', () => {
            const invalidData = { ...baseValidWebhookPayload, claimId: '' };
            const result = insuranceWebhookSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            expect(result.error?.errors[0].message).toBe('Claim ID is required');
        });

        it('should invalidate payload with invalid VIN format', () => {
            const invalidData = { ...baseValidWebhookPayload, insuredVehicle: { ...baseValidWebhookPayload.insuredVehicle, vin: 'too_short' } };
            let result = insuranceWebhookSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            expect(result.error?.errors[0].message).toBe('VIN must be 17 characters');

            invalidData.insuredVehicle.vin = '1234567890ABCDEFG_INVALID'; // Too long
            result = insuranceWebhookSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            expect(result.error?.errors[0].message).toBe('VIN must be 17 characters');

            invalidData.insuredVehicle.vin = '1234567890ABCDEF@'; // Invalid characters
            result = insuranceWebhookSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            expect(result.error?.errors[0].message).toBe('Invalid VIN format');
        });

        it('should invalidate payload with missing insuredVehicle details', () => {
            const invalidData = { ...baseValidWebhookPayload, insuredVehicle: {} };
            const result = insuranceWebhookSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            expect(result.error?.errors[0].message).toBe('Insured vehicle details are required');
        });

        it('should validate optional fields correctly', () => {
            const fullPayload = {
                ...baseValidWebhookPayload,
                userId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
                adjusterName: 'Test Adjuster',
                damageCode: 'D102',
                claimStatus: 'Approved',
                preferredShops: ['s1b2c3d4-e5f6-7890-1234-567890abcdef']
            };
            const result = insuranceWebhookSchema.safeParse(fullPayload);
            expect(result.success).toBe(true);
        });
    });

    // --- setExpirySchema Tests ---
    describe('setExpirySchema', () => {
        it('should validate a valid future expiry date in ISO 8601 format', () => {
            const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(); // 1 day in future
            const result = setExpirySchema.safeParse({ expiresAt: futureDate });
            expect(result.success).toBe(true);
        });

        it('should invalidate a past expiry date', () => {
            const pastDate = new Date(Date.now() - 1000 * 60).toISOString(); // 1 minute in past
            const result = setExpirySchema.safeParse({ expiresAt: pastDate });
            expect(result.success).toBe(false);
            expect(result.error?.errors[0].message).toBe('Expiry date must be in the future.');
        });

        it('should invalidate an invalid date string format', () => {
            const invalidFormat = '2025-07-04 12:00:00'; // Not ISO 8601
            const result = setExpirySchema.safeParse({ expiresAt: invalidFormat });
            expect(result.success).toBe(false);
            expect(result.error?.errors[0].message).toBe('Invalid date format for expiresAt. Must be a valid ISO 8601 string.');
        });

        it('should invalidate a non-date string', () => {
            const nonDateString = 'not-a-date';
            const result = setExpirySchema.safeParse({ expiresAt: nonDateString });
            expect(result.success).toBe(false);
            expect(result.error?.errors[0].message).toBe('Invalid date format for expiresAt. Must be a valid ISO 8601 string.');
        });
    });

    // --- pendingRemindersQuerySchema Tests ---
    describe('pendingRemindersQuerySchema', () => {
        it('should validate an empty query (all optional)', () => {
            const result = pendingRemindersQuerySchema.safeParse({});
            expect(result.success).toBe(true);
        });

        it('should validate a query with valid user/shop ID and status/type filters', () => {
            const validQuery = {
                userId: 'u1a2b3c4-d5e6-7890-1234-567890abcdef',
                shopId: 's1a2b3c4-d5e6-7890-1234-567890abcdef',
                status: 'pending',
                type: 'estimate_expiry_warning',
            };
            const result = pendingRemindersQuerySchema.safeParse(validQuery);
            expect(result.success).toBe(true);
        });

        it('should invalidate a query with invalid UUID format for userId', () => {
            const invalidQuery = { userId: 'invalid-uuid' };
            const result = pendingRemindersQuerySchema.safeParse(invalidQuery);
            expect(result.success).toBe(false);
            expect(result.error?.errors[0].message).toBe('Invalid user ID format');
        });

        it('should invalidate a query with invalid status enum', () => {
            const invalidQuery = { status: 'invalid_status' };
            const result = pendingRemindersQuerySchema.safeParse(invalidQuery);
            expect(result.success).toBe(false);
            expect(result.error?.errors[0].message).toBe("Invalid enum value. Expected 'pending' | 'sent', received 'invalid_status'");
        });
    });

    // --- resolveConflictSuggestionsQuerySchema Tests ---
    describe('resolveConflictSuggestionsQuerySchema', () => {
        it('should validate an empty query', () => {
            const result = resolveConflictSuggestionsQuerySchema.safeParse({});
            expect(result.success).toBe(true);
        });

        it('should validate a query with valid conflictType and severity', () => {
            const validQuery = { conflictType: 'price_discrepancy', severity: 'high' };
            const result = resolveConflictSuggestionsQuerySchema.safeParse(validQuery);
            expect(result.success).toBe(true);
        });

        it('should invalidate a query with invalid severity enum', () => {
            const invalidQuery = { severity: 'critical' };
            const result = resolveConflictSuggestionsQuerySchema.safeParse(invalidQuery);
            expect(result.success).toBe(false);
            expect(result.error?.errors[0].message).toBe("Invalid enum value. Expected 'low' | 'medium' | 'high', received 'critical'");
        });
    });

    // --- resolveWithAISchema Tests ---
    describe('resolveWithAISchema', () => {
        const validPayload = {
            resolutionId: 'r1a2b3c4-d5e6-7890-1234-567890abcdef',
            optionSelected: 'renegotiate_5_percent'
        };

        it('should validate a valid payload', () => {
            const result = resolveWithAISchema.safeParse(validPayload);
            expect(result.success).toBe(true);
        });

        it('should invalidate payload with invalid resolutionId format', () => {
            const invalidPayload = { ...validPayload, resolutionId: 'bad-id' };
            const result = resolveWithAISchema.safeParse(invalidPayload);
            expect(result.success).toBe(false);
            expect(result.error?.errors[0].message).toBe('Invalid resolution ID format');
        });

        it('should invalidate payload with notes exceeding max length', () => {
            const longNotes = 'a'.repeat(501);
            const invalidPayload = { ...validPayload, notes: longNotes };
            const result = resolveWithAISchema.safeParse(invalidPayload);
            expect(result.success).toBe(false);
            expect(result.error?.errors[0].message).toBe('Notes cannot exceed 500 characters');
        });

        it('should invalidate payload with empty optionSelected if present', () => {
            const invalidPayload = { ...validPayload, optionSelected: '' };
            const result = resolveWithAISchema.safeParse(invalidPayload);
            expect(result.success).toBe(false);
            expect(result.error?.errors[0].message).toBe('Selected option is required');
        });
    });

    // --- respondEstimateSchema Tests ---
    describe('respondEstimateSchema', () => {
        const validResponsePayload = {
            quotedCost: 1000,
            timelineDays: 5,
            details: 'Initial assessment completed.'
        };

        it('should validate a valid response payload', () => {
            const result = respondEstimateSchema.safeParse(validResponsePayload);
            expect(result.success).toBe(true);
        });

        it('should invalidate payload with non-positive quotedCost', () => {
            const invalidPayload = { ...validResponsePayload, quotedCost: 0 };
            let result = respondEstimateSchema.safeParse(invalidPayload);
            expect(result.success).toBe(false);
            expect(result.error?.errors[0].message).toBe('Quoted cost must be positive');

            invalidPayload.quotedCost = -100;
            result = respondEstimateSchema.safeParse(invalidPayload);
            expect(result.success).toBe(false);
            expect(result.error?.errors[0].message).toBe('Quoted cost must be positive');
        });

        it('should invalidate payload with non-positive timelineDays', () => {
            const invalidPayload = { ...validResponsePayload, timelineDays: 0 };
            const result = respondEstimateSchema.safeParse(invalidPayload);
            expect(result.success).toBe(false);
            expect(result.error?.errors[0].message).toBe('Timeline must be a positive integer');
        });

        it('should invalidate payload with details exceeding max length', () => {
            const longDetails = 'a'.repeat(1001);
            const invalidPayload = { ...validResponsePayload, details: longDetails };
            const result = respondEstimateSchema.safeParse(invalidPayload);
            expect(result.success).toBe(false);
            expect(result.error?.errors[0].message).toBe('Details cannot exceed 1000 characters');
        });

        it('should validate payload with optional fields omitted', () => {
            const minimalPayload = { quotedCost: 500 };
            const result = respondEstimateSchema.safeParse(minimalPayload);
            expect(result.success).toBe(true);
        });
    });

    // --- estimateIdParamSchema Tests ---
    describe('estimateIdParamSchema', () => {
        const validId = 'd1e2f3g4-h5i6-7890-1234-567890abcdef';

        it('should validate a valid UUID for estimateId', () => {
            const result = estimateIdParamSchema.safeParse({ estimateId: validId });
            expect(result.success).toBe(true);
        });

        it('should invalidate an invalid UUID format', () => {
            const invalidId = 'not-a-uuid';
            const result = estimateIdParamSchema.safeParse({ estimateId: invalidId });
            expect(result.success).toBe(false);
            expect(result.error?.errors[0].message).toBe('Invalid estimate ID format in path parameter.');
        });

        it('should invalidate if estimateId is missing', () => {
            const result = estimateIdParamSchema.safeParse({});
            expect(result.success).toBe(false);
            expect(result.error?.errors[0].message).toBe('Required'); // Zod's default for missing required field
        });
    });
});