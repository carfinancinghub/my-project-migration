// File: SessionValidator.test.js
// Path: C:\CFH\backend\tests\security\SessionValidator.test.js
// Purpose: Unit tests for SessionValidator service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const SessionValidator = require('@services/security/SessionValidator');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('SessionValidator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateSession', () => {
    it('validates session successfully', async () => {
      const mockUser = { id: '123' };
      const mockSession = { expiresAt: '2025-05-25T12:00:00Z' };
      db.getUser.mockResolvedValueOnce(mockUser);
      db.getSession.mockResolvedValueOnce(mockSession);

      const result = await SessionValidator.validateSession('123', 'token123');
      expect(result).toEqual({ valid: true, expiresAt: '2025-05-25T12:00:00Z' });
      expect(db.getSession).toHaveBeenCalledWith('123', 'token123');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Validated session'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(SessionValidator.validateSession('123', 'token123')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });

    it('throws error when session is invalid', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123' });
      db.getSession.mockResolvedValueOnce(null);
      await expect(SessionValidator.validateSession('123', 'token123')).rejects.toThrow('Invalid session');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid session'));
    });

    it('throws error when session is expired', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123' });
      db.getSession.mockResolvedValueOnce({ expiresAt: '2025-05-23T12:00:00Z' });
      await expect(SessionValidator.validateSession('123', 'token123')).rejects.toThrow('Session expired');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Session expired'));
    });
  });

  describe('invalidateSession', () => {
    it('invalidates session successfully', async () => {
      db.getUser.mockResolvedValueOnce({ id: '123' });
      db.invalidateSession.mockResolvedValueOnce({});

      const result = await SessionValidator.invalidateSession('123', 'token123');
      expect(result).toEqual({ status: 'invalidated' });
      expect(db.invalidateSession).toHaveBeenCalledWith('123', 'token123');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Invalidated session'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce(null);
      await expect(SessionValidator.invalidateSession('123', 'token123')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });
});

