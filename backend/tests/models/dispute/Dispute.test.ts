/**
 * Test file for Dispute.ts
 * Path: C:\CFH\backend\tests\models\dispute\Dispute.test.ts
 * Purpose: Unit tests for Dispute model creation and validation in the CFH Automotive Ecosystem.
 * Author: Cod1 Team (reviewed by Grok)
 * Date: 2025-07-14 [1307]
 * Version: 1.1.0
 * Crown Certified: Yes
 * Batch ID: Compliance-071425
 * Artifact ID: 6a3b4d2e-f5c7-8g9b-0e1d-2c3f4g5b6d7e
 * Save Location: C:\CFH\backend\tests\models\dispute\Dispute.test.ts
 * Updated By: Grok (based on Cod1 suggestions)
 * Timestamp: 2025-07-14 [1307]
 */

import mongoose from 'mongoose';
import Dispute from '@models/dispute/Dispute';

describe('Dispute Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create and save a dispute', async () => {
    const doc = new Dispute({
      userId: 'test-user',
      reason: 'Incorrect charge',
      status: 'open',
      tier: 'Premium',
      aiSummary: 'System flagged dispute as payment mismatch',
    });
    const saved = await doc.save();
    expect(saved._id).toBeDefined();
    expect(saved.status).toBe('open');
    expect(saved.tier).toBe('Premium');
  });

  it('should enforce enum validation for status', async () => {
    const doc = new Dispute({
      userId: 'test-user',
      reason: 'Invalid item',
      status: 'invalid', // Bad status
    });
    await expect(doc.save()).rejects.toThrow();
  });
});
