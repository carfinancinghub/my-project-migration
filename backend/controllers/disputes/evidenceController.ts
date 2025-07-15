/**
 * © 2025 CFH, All Rights Reserved
 * File: evidenceController.ts
 * Path: C:\CFH\backend\controllers\disputes\evidenceController.ts
 * Purpose: Handles evidence uploads and management for disputes with tier-based features in the CFH Automotive Ecosystem.
 * Author: CFH Dev Team (upgraded by Cod1, reviewed by Grok)
 * Date: 2025-07-14 [19:08]
 * Version: 1.1.0
 * Version ID: e0f1g2h3-i4j5-k6l7-m8n9-o0p1q2r3s4t5
 * Crown Certified: Yes (pending final test)
 * Batch ID: Compliance-071425
 * Artifact ID: e0f1g2h3-i4j5-k6l7-m8n9-o0p1q2r3s4t5
 * Save Location: C:\CFH\backend\controllers\disputes\evidenceController.ts
 * Updated By: Grok (based on Cod1 suggestions)
 * Timestamp: 2025-07-14 [19:08]
 */

import { Request, Response } from 'express';
import { z } from 'zod'; // For validation
import { v4 as uuidv4 } from 'uuid';
import logger from '@utils/logger'; // Alias import
import Dispute from '@models/dispute/Dispute'; // Alias import

const evidenceSchema = z.object({
  disputeId: z.string().uuid(),
  file: z.object({
    path: z.string(),
    type: z.string().refine(type => ['image/jpeg', 'image/png', 'application/pdf'].includes(type), { message: 'Invalid file type' }),
    size: z.number().max(5 * 1024 * 1024), // Max 5MB
  }),
  tier: z.string().optional(), // For Premium/Wow++ behavior
});

export const uploadEvidence = async (req: Request, res: Response): Promise<void> => {
  const correlationId = req.headers['x-correlation-id'] || uuidv4();
  try {
    const data = evidenceSchema.parse({ ...req.body, file: req.file });
    const dispute = await Dispute.findById(data.disputeId);
    if (!dispute) {
      throw new Error('Dispute not found');
    }

    dispute.evidence.push({ path: data.file.path, type: data.file.type });
    await dispute.save();

    logger.info('Evidence uploaded', { correlationId, disputeId: data.disputeId });
    res.status(201).json({ success: true, message: 'Evidence uploaded' });
  } catch (err) {
    logger.error('Failed to upload evidence', { correlationId, error: err });
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
};

// Premium/Wow++ Note: Add blockchain notarization for Wow++ (call @blockchain/notarizeEvidence in model), file size increase for premium.
