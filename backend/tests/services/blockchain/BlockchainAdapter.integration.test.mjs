// File: BlockchainAdapter.integration.test.js
// Path: C:\CFH\backend\tests\services\blockchain\BlockchainAdapter.integration.test.js
// Purpose: Integration tests for BlockchainAdapter.js, simulating blockchain network interactions
// Author: Rivers Auction Dev Team
// Date: 2025-05-27
// Cod2 Crown Certified: Yes
// Save Location: This file should be saved to C:\CFH\backend\tests\services\blockchain\BlockchainAdapter.integration.test.js to provide integration testing for BlockchainAdapter.js.

/*
## Functions Summary

| Test Suite | Purpose | Dependencies |
|------------|---------|--------------|
| BlockchainAdapter Integration | Tests integrated blockchain operations | `web3`, `@utils/logger`, `@services/websocket/WebSocketService` |
*/

import BlockchainAdapter from '@services/blockchain/BlockchainAdapter';
import Web3 from 'web3';
import logger from '@utils/logger';
import WebSocketService from '@services/websocket/WebSocketService';

jest.mock('web3');
jest.mock('@utils/logger');
jest.mock('@services/websocket/WebSocketService');

describe('BlockchainAdapter Integration', () => {
  let adapter;
  const mockConfig = { providerUrl: 'http://test:8545', network: 'polygon', timeout: 1000 };

  beforeEach(() => {
    jest.clearAllMocks();
    Web3.mockImplementation(() => ({
      eth: {
        net: { isListening: jest.fn().mockResolvedValue(true) },
        getGasPrice: jest.fn().mockResolvedValue('20000000000'),
        estimateGas: jest.fn().mockResolvedValue(21000),
        sendTransaction: jest.fn().mockResolvedValue({ transactionHash: '0x456' }),
        getBlockNumber: jest.fn().mockResolvedValue(2000),
        Contract: jest.fn().mockReturnValue({
          events: { AuctionEnded: jest.fn().mockReturnValue({ on: jest.fn() }) },
        }),
        accounts: { recover: jest.fn().mockReturnValue('0xaddress') },
      },
    }));
    WebSocketService.mockImplementation(() => ({ notify: jest.fn() }));
    adapter = new BlockchainAdapter(mockConfig);
  });

  it('integrates connection and transaction sending', async () => {
    await adapter.connect();
    const tx = await adapter.buildTransaction('transfer', { recipient: '0xrecipient', amount: '1000' });
    const receipt = await adapter.sendTransaction(tx);
    expect(receipt.transactionHash).toBe('0x456');
    expect(logger.info).toHaveBeenCalledWith('Connected to polygon blockchain');
    expect(logger.info).toHaveBeenCalledWith('Transaction sent: 0x456');
  });

  it('integrates event listening and transaction queue', async () => {
    await adapter.connect();
    const callback = jest.fn();
    await adapter.listenForEvent('0xcontract', 'AuctionEnded', callback);
    const tx = await adapter.buildTransaction('bid', { contractAddress: '0xcontract', bidData: '0xdata', bidAmount: '1000' });
    const receipt = await adapter.queueTransaction(tx);
    expect(receipt.transactionHash).toBe('0x456');
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Mock event listener set'));
  });

  it('integrates fee estimation and signature validation', async () => {
    await adapter.connect();
    const fee = await adapter.estimateTransactionFee({ to: '0xrecipient', value: '1000' });
    const isValid = await adapter.validateSignature('message', 'signature', '0xaddress');
    expect(fee).toBe(22000000000 * 21000);
    expect(isValid).toBe(true);
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Transaction fee estimated'));
  });
});

BlockchainAdapter.integration.test.propTypes = {};