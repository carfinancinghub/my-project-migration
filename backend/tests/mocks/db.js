// (c) 2025 CFH, All Rights Reserved
// Purpose: Mock database for testing in the CFH Automotive Ecosystem
// Author: CFH Dev Team
// Date: 2025-06-25T06:30:00.000Z
// Version: 1.0.0
// Crown Certified: Yes
// Batch ID: Mocks-062525
// Save Location: C:\CFH\backend\tests\mocks\db.js
const logger = require('@utils/logger');

/**
 * @typedef {Object} Auction
 * @property {string} id
 * @property {string} title
 * @property {string} status
 */

/**
 * @typedef {Object} Bid
 * @property {string} id
 * @property {string} auctionId
 * @property {string} bidderId
 * @property {number} amount
 */

const db = {
  /**
   * @param {string} auctionId
   * @returns {Promise<Auction>}
   */
  async getAuction(auctionId) {
    logger.info('Mock DB: Fetching auction', { auctionId });
    return { id: auctionId, title: 'Mock Auction', status: 'active' };
  },
  /**
   * @param {string} auctionId
   * @param {string} bidderId
   * @param {number} amount
   * @returns {Promise<Bid>}
   */
  async saveBid(auctionId, bidderId, amount) {
    logger.info('Mock DB: Saving bid', { auctionId, bidderId, amount });
    return { id: 'mock-bid-id', auctionId, bidderId, amount };
  }
};

module.exports = db;


