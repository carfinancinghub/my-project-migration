import request from 'supertest';
import app from '../../app';
import { EscrowService } from '@services/escrow/EscrowService';
import { expect } from '@jest/globals';

jest.mock('@services/escrow/EscrowService');

describe('Escrow Integration', () => {
  it('should handle escrow flow', async () => {
    const mockEscrow = { _id: '1', user: 'user1', status: 'PENDING' };
    (EscrowService.createEscrow as jest.Mock).mockResolvedValue(mockEscrow);
    const response = await request(app).post('/api/escrow/create').send({ user: 'user1', vehicle: { vin: '123', price: 1000 } });
    expect(response.status).toBe(201);
  });
});
