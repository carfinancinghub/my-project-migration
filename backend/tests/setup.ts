// Date: 062625 [1000], © 2025 CFH
import { jest } from '@jest/globals';

/**
 * Mock database service
 */
const dbMock = {
  getUser: jest.fn(),
  getUserByEmail: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  getAuction: jest.fn(),
  updateAuction: jest.fn(),
  addBid: jest.fn(),
  getPendingAuctions: jest.fn(),
  getActiveAuctions: jest.fn(),
  getSellerAuctions: jest.fn(),
  getBidsByUser: jest.fn(),
  getAuctionData: jest.fn(),
  getHistoricalAuctionData: jest.fn(),
  getActivitiesByUser: jest.fn(),
  logActivity: jest.fn(),
  getSecurityLogs: jest.fn(),
  logSecurityEvent: jest.fn(),
  getSession: jest.fn(),
  invalidateSession: jest.fn(),
  logError: jest.fn(),
  getErrorLogs: jest.fn(),
  getVehicle: jest.fn(),
  flagVehicle: jest.fn(),
  getAuditLogs: jest.fn(),
  getFlaggedUsers: jest.fn(),
  getTotalUsers: jest.fn(),
  getActiveAuctionsCount: jest.fn(),
  getRecentActivity: jest.fn(),
  flagUser: jest.fn(),
  getDispute: jest.fn(),
  createDispute: jest.fn(),
  updateDispute: jest.fn(),
  saveFeedback: jest.fn(),
  getFeedbackByAuction: jest.fn(),
  logReward: jest.fn(),
  awardBadge: jest.fn(),
  logRewardRedemption: jest.fn(),
  getLeaderboard: jest.fn(),
  logMobileAction: jest.fn(),
  logChecklistResult: jest.fn(),
  getAllBids: jest.fn(),
  getAuctionHeatmapData: jest.fn(),
};

jest.mock('@services/db', () => dbMock);

jest.mock('@utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

jest.mock('node-cron', () => ({
  schedule: jest.fn(),
}));
