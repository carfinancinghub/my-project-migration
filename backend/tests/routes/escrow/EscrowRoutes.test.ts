import request from 'supertest';
import app from '@root/app';
import { EscrowService } from '@services/escrow/EscrowService';
import { expect } from '@jest/globals';

jest.mock('@services/escrow/EscrowService');

describe('Escrow Routes', () => {
  it('should create escrow', async () => {
    const mockEscrow = { _id: '1', user: 'user1', status: 'PENDING' };
    (EscrowService.createEscrow as jest.Mock).mockResolvedValue(mockEscrow);
    const response = await request(app).post('/api/escrow/create').send({ user: 'user1', vehicle: { vin: '123', price: 1000 } });
    expect(response.status).toEqual(201);
    expect(response.body).toEqual(mockEscrow);
  });

  it('should handle create escrow failure', async () => {
    (EscrowService.createEscrow as jest.Mock).mockRejectedValue(new Error('Bad request'));
    const response = await request(app).post('/api/escrow/create').send({ user: '', vehicle: { vin: '', price: 0 } });
    expect(response.status).toEqual(400);
  });

  it('should propose condition', async () => {
    const mockEscrow = { _id: '1', condition: 'test' };
    (EscrowService.proposeCondition as jest.Mock).mockResolvedValue(mockEscrow);
    const response = await request(app).post('/api/escrow/propose-condition/1').send({ condition: 'test' });
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(mockEscrow);
  });
});
