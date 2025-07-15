/**
 * © 2025 CFH, All Rights Reserved
 * File: disputeFlowController.ts
 * Path: C:\CFH\backend\controllers\disputes\disputeFlowController.ts
 * Purpose: Manages the progression and status updates of dispute cases through stages like submitted, under review, resolved, etc. in the CFH Automotive Ecosystem.
 * Author: CFH Dev Team (upgraded by Cod1, reviewed by Grok)
 * Date: 2025-07-14 [14:16]
 * Version: 1.1.0
 * Version ID: a4f2e1c3-d6b7-4e9f-a9c0-f1d2e3b4c5d6
 * Crown Certified: Yes (pending final test)
 * Batch ID: Compliance-071425
 * Artifact ID: a4f2e1c3-d6b7-4e9f-a9c0-f1d2e3b4c5d6
 * Save Location: C:\CFH\backend\controllers\disputes\disputeFlowController.ts
 * Updated By: Grok (based on Cod1 suggestions)
 * Timestamp: 2025-07-14 [14:16]
 */

import { Request, Response } from 'express';
import { z } from 'zod'; // For validation
import logger from '@utils/logger'; // Alias import
import * as disputeFlowService from '@services/disputeFlowService'; // Alias import

const stageSchema = z.object({
  disputeId: z.string().uuid(),
  stage: z.enum(['submitted', 'under_review', 'resolved']),
  tier: z.string().optional(), // For Premium/Wow++ behavior
  escalation: z.boolean().optional(), // Premium: Multi-party escalation
  aiResolution: z.boolean().optional(), // Wow++: AI-driven resolution
});

/**
 * Advances the dispute stage.
 * @param {Request} req - Express request with disputeId, stage in body.
 * @param {Response} res - Express response object.
 */
export const advanceDisputeStage = async (req: Request, res: Response): Promise<void> => {
  const correlationId = req.headers['x-correlation-id'] || 'none';
  try {
    const data = stageSchema.parse(req.body);
    const result = await disputeFlowService.advanceStage(data);

    logger.info('Dispute stage advanced', { disputeId: data.disputeId, stage: data.stage, correlationId });
    res.status(200).json({ success: true, result });
  } catch (err) {
    logger.error('Failed to advance dispute stage', { error: err, correlationId });
    const status = err instanceof z.ZodError ? 400 : 500;
    res.status(status).json({ success: false, message: 'Dispute processing failed' });
  }
};

/**
 * Gets the dispute status.
 * @param {Request} req - Express request with disputeId in params.
 * @param {Response} res - Express response object.
 */
export const getDisputeStatus = async (req: Request, res: Response): Promise<void> => {
  const correlationId = req.headers['x-correlation-id'] || 'none';
  try {
    const { disputeId } = req.params;
    const status = await disputeFlowService.getStatus(disputeId);

    logger.info('Dispute status retrieved', { disputeId, correlationId });
    res.status(200).json({ success: true, status });
  } catch (error) {
    logger.error('Failed to retrieve dispute status', { error, correlationId });
    res.status(500).json({ success: false, message: 'Error retrieving status' });
  }
};

// Premium/Wow++ Note: Add multi-party escalation for premium, AI resolution for Wow++ (call @ai/conflictResolver in service).
