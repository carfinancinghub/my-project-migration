/**
 * @file escrow.service.test.ts
 * @path C:\CFH\backend\tests\escrow\escrow.service.test.ts
 * @author Mini Team
 * @created 2025-06-10 [0823]
 * @purpose Tests the EscrowService for reliable transaction handling.
 * @user_impact Ensures robust and secure transaction processing for end-users.
 * @version 1.0.0
 * @last_updated: 2025-06-11 [1200]
 */
import { EscrowService } from '../../services/escrow/escrow.service';
import { EscrowRepository } from '../../repositories/escrow.repository';
import { InternalServerError } from '../../utils/errors';
jest.mock('../../repositories/escrow.repository');
jest.mock('../../config/logger');
describe('EscrowService', () => {
    let service;
    let repositoryMock;
    beforeEach(() => {
        service = new EscrowService();
        repositoryMock = EscrowRepository.mock.instances[0];
        jest.clearAllMocks();
    });
    it('should throw InternalServerError if the repository fails unexpectedly', async () => {
        const dbError = new Error('DB connection lost');
        repositoryMock.create.mockRejectedValue(dbError);
        const transactionData = { amount: 100, tier: 'free', parties: [] };
        await expect(service.createTransaction(transactionData)).rejects.toThrow(InternalServerError);
    });
    it('should create a transaction within 500ms', async () => {
        const transactionData = {
            amount: 100,
            tier: 'free',
            parties: [{ userId: 'user1', role: 'buyer' }, { userId: 'user2', role: 'seller' }],
        };
        const mockTransaction = { _id: 'txn_123', ...transactionData, auditLog: [] };
        repositoryMock.create.mockResolvedValue(mockTransaction);
        repositoryMock.update.mockResolvedValue(mockTransaction);
        const start = performance.now();
        await service.createTransaction(transactionData);
        const duration = performance.now() - start;
        expect(duration).toBeLessThan(500);
        expect(repositoryMock.create).toHaveBeenCalledWith(transactionData);
        expect(repositoryMock.update).toHaveBeenCalledWith(mockTransaction._id, {
            $push: { auditLog: expect.any(String) },
        });
    });
    it('should create a transaction with valid tier', async () => {
        const transactionData = {
            amount: 100,
            tier: 'premium',
            parties: [{ userId: 'user1', role: 'buyer' }, { userId: 'user2', role: 'seller' }],
        };
        const mockTransaction = { _id: 'txn_456', ...transactionData, auditLog: [] };
        repositoryMock.create.mockResolvedValue(mockTransaction);
        repositoryMock.update.mockResolvedValue(mockTransaction);
        const transaction = await service.createTransaction(transactionData);
        expect(transaction.tier).toBe('premium');
        expect(repositoryMock.create).toHaveBeenCalledWith(transactionData);
    });
});


