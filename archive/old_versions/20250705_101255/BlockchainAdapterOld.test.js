// 👑 Crown Certified Test — BlockchainAdapter.test.js
// Path: backend/tests/services/blockchain/BlockchainAdapter.test.js
// Purpose: Unit tests for BlockchainAdapter service (mocked blockchain interaction)
// Author: Rivers Auction Team — May 18, 2025

const BlockchainAdapter = require('@services/blockchain/BlockchainAdapter');
const logger = require('@utils/logger');

jest.mock('@utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
}));

describe('BlockchainAdapter', () => {
  const actionData = {
    transactionId: 'tx-test-001',
    actionType: 'deposit',
    userId: 'user-test',
    metadata: { amount: 1000 },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('recordEscrowAction should write to mock ledger and return blockHash', async () => {
    const result = await BlockchainAdapter.recordEscrowAction(actionData);
    expect(result).toHaveProperty('blockHash');
    expect(result.status).toBe('confirmed');
  });

  test('getTransactionDetails should return written transaction data', async () => {
    const writeResult = await BlockchainAdapter.recordEscrowAction(actionData);
    const readResult = await BlockchainAdapter.getTransactionDetails(actionData.transactionId);
    expect(readResult.blockHash).toBe(writeResult.blockHash);
    expect(readResult.userId).toBe('user-test');
  });

  test('getTransactionDetails should throw error if transaction not found', async () => {
    await expect(BlockchainAdapter.getTransactionDetails('nonexistent-id'))
      .rejects.toThrow('Blockchain read failed');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('BlockchainAdapter.getTransactionDetails failed'), expect.any(Error));
  });

  test('recordEscrowAction should handle write errors', async () => {
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => { throw new Error('Sim fail'); });
    await expect(BlockchainAdapter.recordEscrowAction(actionData))
      .rejects.toThrow('Blockchain write failed');
    spy.mockRestore();
    expect(logger.error).toHaveBeenCalledWith('BlockchainAdapter.recordEscrowAction failed', expect.any(Error));
  });
});
