// File: BlockchainAdapter.js
// Path: C:\CFH\backend\services\blockchain\BlockchainAdapter.js
// Purpose: Blockchain interaction utility for connecting, transacting, and event listening with multi-network support and premium features
// Author: Rivers Auction Dev Team
// Date: 2025-05-26
// Cod2 Crown Certified: Yes
// Save Location: This file should be saved to C:\CFH\backend\services\blockchain\BlockchainAdapter.js to provide blockchain services for backend operations.

/*
## Functions Summary

| Function | Purpose | Inputs | Outputs | Dependencies |
|----------|---------|--------|---------|--------------|
| BlockchainAdapter | Initializes adapter with network configuration | `config: Object` | BlockchainAdapter instance | `web3`, `@utils/logger` |
| connect | Connects to blockchain network | None | `Promise<void>` | `web3` |
| sendTransaction | Sends a transaction | `tx: Object` | `Promise<Object>` | `web3`, `@utils/logger` |
| listenForEvent | Listens for smart contract events | `contractAddress: String`, `eventName: String`, `callback: Function` | `Promise<void>` | `web3` |
| estimateGasPrice | Estimates optimal gas price | None | `Promise<Number>` | `web3` |
| validateSignature | Validates transaction signature | `message: String`, `signature: String`, `address: String` | `Promise<Boolean>` | `web3` |
| healthCheck | Checks blockchain node connectivity | None | `Promise<Object>` | `web3` |
| queueTransaction | Queues transaction with retries | `tx: Object`, `retries: Number` | `Promise<Object>` | `@utils/logger` |
*/

import Web3 from 'web3';
import logger from '@utils/logger';

class BlockchainAdapter {
  constructor(config = {}) {
    const {
      providerUrl = process.env.BLOCKCHAIN_PROVIDER || 'http://localhost:8545',
      network = 'ethereum', // Supports 'ethereum', 'polygon'
      timeout = 30000, // Default 30s timeout
      maxRetries = 3,
      backoffDelay = 1000, // 1s initial backoff
    } = config;

    this.network = network;
    this.timeout = timeout;
    this.maxRetries = maxRetries;
    this.backoffDelay = backoffDelay;
    this.web3 = new Web3(providerUrl);
    this.isMock = process.env.NODE_ENV === 'test';
    this.eventListeners = new Map();
  }

  async connect() {
    try {
      if (this.isMock) {
        logger.info(`Mock blockchain connection established for ${this.network}`);
        return;
      }
      const connected = await this.web3.eth.net.isListening({ timeout: this.timeout });
      if (!connected) throw new Error('Failed to connect to blockchain');
      logger.info(`Connected to ${this.network} blockchain`);
    } catch (err) {
      logger.error(`Blockchain connection failed: ${err.message}`);
      throw new Error(`Cannot connect to blockchain: ${err.message}`);
    }
  }

  async sendTransaction(tx) {
    try {
      if (this.isMock) {
        logger.info(`Mock transaction sent: ${JSON.stringify(tx)}`);
        return { transactionHash: 'mock-hash' };
      }

      const gasPrice = await this.estimateGasPrice();
      const txConfig = {
        ...tx,
        gasPrice,
        gas: await this.web3.eth.estimateGas(tx),
      };

      const receipt = await this.web3.eth.sendTransaction(txConfig, { timeout: this.timeout });
      logger.info(`Transaction sent: ${receipt.transactionHash}`);
      return receipt;
    } catch (err) {
      logger.error(`Transaction failed: ${err.message}`);
      throw new Error(`Failed to send transaction: ${err.message}`);
    }
  }

  async listenForEvent(contractAddress, eventName, callback) {
    try {
      if (this.isMock) {
        logger.info(`Mock event listener set for ${eventName} on ${contractAddress}`);
        return;
      }

      const contract = new this.web3.eth.Contract([], contractAddress);
      contract.events[eventName]()
        .on('data', event => {
          logger.info(`Event ${eventName} received: ${JSON.stringify(event)}`);
          callback(event);
        })
        .on('error', err => {
          logger.error(`Event listener error: ${err.message}`);
          callback(null, err);
        });

      this.eventListeners.set(`${contractAddress}:${eventName}`, callback);
    } catch (err) {
      logger.error(`Failed to set event listener: ${err.message}`);
      throw new Error(`Cannot listen for event: ${err.message}`);
    }
  }

  async estimateGasPrice() {
    try {
      if (this.isMock) return 20000000000; // Mock 20 Gwei
      const gasPrice = await this.web3.eth.getGasPrice();
      return Math.floor(Number(gasPrice) * 1.1); // 10% buffer
    } catch (err) {
      logger.error(`Gas price estimation failed: ${err.message}`);
      throw new Error(`Cannot estimate gas price: ${err.message}`);
    }
  }

  async validateSignature(message, signature, address) {
    try {
      const signer = await this.web3.eth.accounts.recover(message, signature);
      const isValid = signer.toLowerCase() === address.toLowerCase();
      logger.info(`Signature validation: ${isValid}`);
      return isValid;
    } catch (err) {
      logger.error(`Signature validation failed: ${err.message}`);
      throw new Error(`Invalid signature: ${err.message}`);
    }
  }

  async healthCheck() {
    try {
      if (this.isMock) return { connected: true, network: this.network };
      const blockNumber = await this.web3.eth.getBlockNumber({ timeout: this.timeout });
      return { connected: true, network: this.network, blockNumber };
    } catch (err) {
      logger.error(`Health check failed: ${err.message}`);
      return { connected: false, error: err.message };
    }
  }

  async queueTransaction(tx, retries = this.maxRetries) {
    let attempt = 0;
    while (attempt <= retries) {
      try {
        const receipt = await this.sendTransaction(tx);
        return receipt;
      } catch (err) {
        attempt++;
        if (attempt > retries) {
          logger.error(`Transaction queue exhausted retries: ${err.message}`);
          throw new Error(`Transaction failed after ${retries} retries: ${err.message}`);
        }
        const delay = this.backoffDelay * Math.pow(2, attempt);
        logger.warn(`Retrying transaction (attempt ${attempt}/${retries}) after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}

export default BlockchainAdapter;