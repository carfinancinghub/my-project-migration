// File: VoiceBidAssistant.test.js
// Path: C:\CFH\backend\tests\premium\VoiceBidAssistant.test.js
// Purpose: Unit tests for VoiceBidAssistant service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const VoiceBidAssistant = require('@services/premium/VoiceBidAssistant');
const db = require('@services/db');
const voice = require('@services/voice');
const AuctionManager = require('@services/auction/AuctionManager');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@services/voice');
jest.mock('@services/auction/AuctionManager');
jest.mock('@utils/logger');

describe('VoiceBidAssistant', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('startVoiceSession', () => {
    it('starts voice session successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockAuction = { id: '789', status: 'active' };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getAuction.mockResolvedValueOnce(mockAuction);
      voice.startSession.mockResolvedValueOnce({ id: 'voice-session-123' });

      const result = await VoiceBidAssistant.startVoiceSession('123', '789');
      expect(result).toEqual({ sessionId: 'voice-session-123' });
      expect(voice.startSession).toHaveBeenCalledWith('123', '789');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Started voice session'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(VoiceBidAssistant.startVoiceSession('123', '789')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error when auction is not active', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      db.getAuction.mockResolvedValueOnce({ id: '789', status: 'unsold' });
      await expect(VoiceBidAssistant.startVoiceSession('123', '789')).rejects.toThrow('Active auction not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Active auction not found'));
    });
  });

  describe('processVoiceBid', () => {
    it('processes voice bid successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockSession = { userId: '123', auctionId: '789' };
      db.getUser.mockResolvedValueOnce(mockUser);
      voice.getSession.mockResolvedValueOnce(mockSession);
      voice.parseBidAmount.mockResolvedValueOnce(10000);
      AuctionManager.placeBid.mockResolvedValueOnce({ status: 'bid placed' });

      const result = await VoiceBidAssistant.processVoiceBid('123', 'voice-session-123', 'bid 10000');
      expect(result).toEqual({ status: 'bid placed', amount: 10000, auctionId: '789' });
      expect(AuctionManager.placeBid).toHaveBeenCalledWith('789', '123', 10000);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Processed voice bid'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(VoiceBidAssistant.processVoiceBid('123', 'voice-session-123', 'bid 10000')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error for invalid session', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      voice.getSession.mockResolvedValueOnce(null);
      await expect(VoiceBidAssistant.processVoiceBid('123', 'voice-session-123', 'bid 10000')).rejects.toThrow('Invalid session');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid session'));
    });

    it('throws error for invalid bid amount', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      voice.getSession.mockResolvedValueOnce({ userId: '123', auctionId: '789' });
      voice.parseBidAmount.mockResolvedValueOnce(null);
      await expect(VoiceBidAssistant.processVoiceBid('123', 'voice-session-123', 'bid invalid')).rejects.toThrow('Invalid bid amount');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid bid amount'));
    });
  });
});

