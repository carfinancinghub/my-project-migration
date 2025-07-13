// File: BlockchainAdapter.test.js
// Path: C:\CFH\backend\tests\services\blockchain\BlockchainAdapter.test.js
// Purpose: Unit tests for BlockchainAdapter.js, covering blockchain interactions, event listening, and premium features
// Author: Rivers Auction Dev Team
// Date: 2025-05-27
// Cod2 Crown Certified: Yes
// Save Location: This file should be saved to C:\CFH\backend\tests\services\blockchain\BlockchainAdapter.test.js to test the BlockchainAdapter.js utility.

import BlockchainAdapter from '@services/blockchain/BlockchainAdapter';
import Web3 from 'web3';
import logger from '@utils/logger';
import WebSocketService from '@services/websocket/WebSocketService';

jest.mock('web3');
jest.mock('@utils/logger');
jest.mock('@services/websocket/WebSocketService');

describe('BlockchainAdapter', () => {
  let adapter;
  const mockConfig = { providerUrl: 'http://test:8545', network: 'ethereum', timeout: 1000 };

  beforeEach(() => {
    jest.clearAllMocks();
    Web3.mockImplementation(() => ({
      eth: {
        net: { isListening: jest.fn().mockResolvedValue(true) },
        getGasPrice: jest.fn().mockResolvedValue('20000000000'),
        estimateGas: jest.fn().mockResolvedValue(21000),
        sendTransaction: jest.fn().mockResolvedValue({ transactionHash: '0x123' }),
        getBlockNumber: jest.fn().mockResolvedValue(1000),
        Contract: jest.fn().mockReturnValue({
          events: { BidPlaced: jest.fn().mockReturnValue({ on: jest.fn() }) },
        }),
        accounts: { recover: jest.fn().mockReturnValue('0xaddress') },
      },
    }));
    WebSocketService.mockImplementation(() => ({ notify: jest.fn() }));
    adapter = new BlockchainAdapter(mockConfig);
  });

  it('connects to blockchain network', async () => {
    await adapter.connect();
    expect(logger.info).toHaveBeenCalledWith('Connected to ethereum blockchain');
  });

  it('builds bid transaction', () => {
    const tx = adapter.buildTransaction('bid', { contractAddress: '0xcontract', bidData: '0xdata', bidAmount: '1000' });
    expect(tx).toEqual({ to: '0xcontract', data: '0xdata', value: '1000' });
  });

  it('sends transaction with WebSocket notification', async () => {
    const tx = { to: '0xrecipient', value: '1000' };
    const receipt = await adapter.sendTransaction(tx);
    expect(receipt.transactionHash).toBe('0x123');
    expect(logger.info).toHaveBeenCalledWith('Transaction sent: 0x123');
    expect(adapter.websocket.notify).toHaveBeenCalledWith('transaction', expect.any(Object));
  });

  it('listens for smart contract events', async () => {
    const callback = jest.fn();
    await adapter.listenForEvent('0xcontract', 'BidPlaced', callback);
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Mock event listener set'));
  });

  it('estimates gas price with buffer', async () => {
    const gasPrice = await adapter.estimateGasPrice();
    expect(gasPrice).toBe(22000000000);
  });

  it('validates transaction signature', async () => {
    const isValid = await adapter.validateSignature('message', 'signature', '0xaddress');
    expect(isValid).toBe(true);
    expect(logger.info).toHaveBeenCalledWith('Signature validation: true');
  });

  it('estimates transaction fee', async () => {
    const fee = await adapter.estimateTransactionFee({ to: '0xrecipient', value: '1000' });
    expect(fee).toBe(22000000000 * 21000);
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Transaction fee estimated'));
  });

  it('performs health check', async () => {
    const status = await adapter.healthCheck();
    expect(status).toEqual({ connected: true, network: 'ethereum', blockNumber: 1000 });
  });

  it('queues transaction with retries', async () => {
    const tx = { to: '0xrecipient', value: '1000' };
    const receipt = await adapter.queueTransaction(tx);
    expect(receipt.transactionHash).toBe('0x123');
  });

  it('handles connection failure', async () => {
    Web3.mockImplementationOnce(() => ({
      eth: { net: { isListening: jest.fn().mockRejectedValue(new Error('Connection failed')) } },
    }));
    adapter = new BlockchainAdapter(mockConfig);
    await expect(adapter.connect()).rejects.toThrow('Cannot connect to blockchain');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Blockchain connection failed'));
  });
});

BlockchainAdapter.test.propTypes = {};