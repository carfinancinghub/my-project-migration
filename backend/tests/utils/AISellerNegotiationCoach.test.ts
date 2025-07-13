import { AISellerNegotiationCoach } from '@utils/AISellerNegotiationCoach';
import { Listing } from '@models/seller/Listing';
import mongoose from 'mongoose';
import { expect } from '@jest/globals';

jest.mock('mongoose');

describe('AISellerNegotiationCoach', () => {
  it('should get negotiation tips', async () => {
    (Listing.findById as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue({ id: '1' }) });
    const result = await AISellerNegotiationCoach.getNegotiationTips('1', []);
    expect(result).toEqual('mock tips');
  });
});
