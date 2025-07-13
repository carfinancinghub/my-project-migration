// File: AIDisputePredictor.test.js
// Path: backend/tests/AIDisputePredictor.test.js
// Purpose: Test suite for dispute prediction logic including tone, success scoring, escalation
// Author: Cod2
// Date: 2025-05-01
// 👑 Cod2 Crown Certified

const predictor = require('@utils/AIDisputePredictor');
const mockDispute = { _id: 'abc123', description: 'You lied. I will sue you.', status: 'open' };

jest.mock('@models/dispute/Dispute.js', () => ({
  findById: jest.fn(() => Promise.resolve(mockDispute))
}));

jest.mock('@utils/scoreUtils.js', () => ({
  simulateOutcome: jest.fn(() => ({ result: 'Needs Review', confidence: 0.72 })),
  scoreBias: jest.fn(() => 0.44),
  normalizeRisk: jest.fn(() => 0.68)
}));

describe('AIDisputePredictor Premium Logic Tests', () => {
  it('predicts dispute outcome correctly', async () => {
    const result = await predictor.predictOutcome('abc123');
    expect(result.result).toBe('Needs Review');
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('calculates tone and bias index', async () => {
    const result = await predictor.predictOutcome('abc123');
    expect(result.biasIndex).toBeGreaterThanOrEqual(0);
    expect(result.toneAggression).toBeDefined();
  });

  it('suggests AI escalation logic', async () => {
    const decision = await predictor.getEscalationSuggestion(mockDispute);
    expect(['Escalate to Judge', 'Offer Refund', 'Needs Review']).toContain(decision.action);
  });

  it('emits real-time analytics', async () => {
    const emitMock = jest.fn();
    predictor.emitSocketUpdate = emitMock;
    await predictor.pushRealTimeDisputeUpdate(mockDispute._id);
    expect(emitMock).toHaveBeenCalled();
  });

  it('handles errors gracefully', async () => {
    const brokenResult = await predictor.predictOutcome(null);
    expect(brokenResult.error).toBeDefined();
  });
});
