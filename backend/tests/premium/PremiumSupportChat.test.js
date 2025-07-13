// File: PremiumSupportChat.test.js
// Path: C:\CFH\backend\tests\premium\PremiumSupportChat.test.js
// Purpose: Unit tests for PremiumSupportChat service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const PremiumSupportChat = require('@services/premium/PremiumSupportChat');
const db = require('@services/db');
const chat = require('@services/chat');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@services/chat');
jest.mock('@utils/logger');

describe('PremiumSupportChat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('startChatSession', () => {
    it('starts chat session successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockOfficer = { id: 'officer1', role: 'officer' };
      const mockSession = { id: 'chat-123' };
      db.getUser.mockResolvedValueOnce(mockUser).mockResolvedValueOnce(mockOfficer);
      chat.startSession.mockResolvedValueOnce(mockSession);

      const result = await PremiumSupportChat.startChatSession('123', 'officer1');
      expect(result).toEqual({ sessionId: 'chat-123', status: 'started' });
      expect(chat.startSession).toHaveBeenCalledWith('123', 'officer1');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Started chat session'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(PremiumSupportChat.startChatSession('123', 'officer1')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error for non-officer user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true }).mockResolvedValueOnce({ id: 'officer1', role: 'buyer' });
      await expect(PremiumSupportChat.startChatSession('123', 'officer1')).rejects.toThrow('Officer access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Officer access required'));
    });
  });

  describe('sendMessage', () => {
    it('sends message successfully for premium user', async () => {
      const mockUser = { id: '123', isPremium: true };
      const mockSession = { id: 'chat-123', userId: '123' };
      db.getUser.mockResolvedValueOnce(mockUser);
      chat.getSession.mockResolvedValueOnce(mockSession);
      chat.sendMessage.mockResolvedValueOnce({});
      db.logChatMessage.mockResolvedValueOnce({});

      const result = await PremiumSupportChat.sendMessage('123', 'chat-123', 'Hello, I need help!');
      expect(result).toEqual({ status: 'message_sent' });
      expect(chat.sendMessage).toHaveBeenCalledWith('chat-123', '123', 'Hello, I need help!');
      expect(db.logChatMessage).toHaveBeenCalledWith('chat-123', '123', 'Hello, I need help!');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Sent message'));
    });

    it('throws error for non-premium user', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: false });
      await expect(PremiumSupportChat.sendMessage('123', 'chat-123', 'Hello')).rejects.toThrow('Premium access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Premium access required'));
    });

    it('throws error for invalid session', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123', isPremium: true });
      chat.getSession.mockResolvedValueOnce(null);
      await expect(PremiumSupportChat.sendMessage('123', 'chat-123', 'Hello')).rejects.toThrow('Invalid session');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid session'));
    });
  });
});

