import { EscrowService, BadRequestError, AuthorizationError } from '@services/escrow/EscrowService';
import { Escrow } from '@models/Escrow';
import mongoose from 'mongoose';
import { expect } from '@jest/globals';

jest.mock('mongoose');

describe('EscrowService', () => {
  it('should create escrow', async () => {
    const mockEscrow = { _id: '1', user: 'user1', status: 'PENDING', vehicle: { vin: '123', price: 1000 }, save: jest.fn().mockResolvedValue(true) };
    (Escrow as any).mockReturnValue(mockEscrow);
    const result = await EscrowService.createEscrow({ user: 'user1', vehicle: { vin: '123', price: 1000 } });
    expect(result).toHaveProperty('_id');
  });

  it('should throw BadRequestError for missing fields', async () => {
    await expect(EscrowService.createEscrow({ user: '', vehicle: { vin: '', price: 0 } })).rejects.toThrow(BadRequestError);
  });
});
