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

  it('should propose condition', async () => {
    const mockEscrow = { _id: '1', user: 'user1', status: 'PENDING', vehicle: { vin: '123', price: 1000 }, condition: 'test', save: jest.fn().mockResolvedValue(true) };
    (Escrow.findById as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue(mockEscrow) });
    const result = await EscrowService.proposeCondition('1', 'test');
    expect(result).toHaveProperty('condition', 'test');
  });

  it('should throw BadRequestError for non-existent escrow', async () => {
    (Escrow.findById as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
    await expect(EscrowService.proposeCondition('1', 'test')).rejects.toThrow(BadRequestError);
  });

  it('should initiate dispute', async () => {
    const mockEscrow = { _id: '1', user: 'user1', status: 'PENDING', vehicle: { vin: '123', price: 1000 }, save: jest.fn().mockResolvedValue(true) };
    (Escrow.findById as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue(mockEscrow) });
    await EscrowService.initiateDispute('1', 'user1');
    expect(mockEscrow.status).toBe('DISPUTED');
  });

  it('should throw AuthorizationError for unauthorized user', async () => {
    const mockEscrow = { _id: '1', user: 'user1', status: 'PENDING', vehicle: { vin: '123', price: 1000 }, save: jest.fn().mockResolvedValue(true) };
    (Escrow.findById as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue(mockEscrow) });
    await expect(EscrowService.initiateDispute('1', 'user2')).rejects.toThrow(AuthorizationError);
  });
});
