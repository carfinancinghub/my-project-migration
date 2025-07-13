import { AIDisputePredictor } from '@utils/AIDisputePredictor';
import { Dispute } from '@models/dispute/Dispute';
import mongoose from 'mongoose';
import { expect } from '@jest/globals';

jest.mock('mongoose');

describe('AIDisputePredictor', () => {
  it('should predict dispute outcome', async () => {
    const mockDispute = { id: '1', probability: 0.75, factors: ['factor1'], outcome: 'mock outcome' };
    (Dispute.findById as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue(mockDispute) });
    const result = await AIDisputePredictor.predictDisputeOutcome('1');
    expect(result).toEqual('mock outcome');
  });

  it('should handle missing dispute', async () => {
    (Dispute.findById as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
    await expect(AIDisputePredictor.predictDisputeOutcome('1')).rejects.toThrow('Dispute not found');
  });
});
