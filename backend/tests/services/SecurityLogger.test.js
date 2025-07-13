// File: SecurityLogger.test.js
// Path: C:\CFH\backend\tests\security\SecurityLogger.test.js
// Purpose: Unit tests for SecurityLogger service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const SecurityLogger = require('@services/security/SecurityLogger');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('SecurityLogger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('logSecurityEvent', () => {
    it('logs security event successfully', async () => {
      db.logSecurityEvent.mockResolvedValueOnce({});

      const result = await SecurityLogger.logSecurityEvent('failed_login', { userId: '123', ip: '192.168.1.1' });
      expect(result).toEqual({ status: 'logged', eventType: 'failed_login' });
      expect(db.logSecurityEvent).toHaveBeenCalledWith(expect.objectContaining({ eventType: 'failed_login' }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Logged security event'));
    });

    it('throws error on logging failure', async () => {
      db.logSecurityEvent.mockRejectedValueOnce(new Error('DB error'));
      await expect(SecurityLogger.logSecurityEvent('failed_login', { userId: '123' })).rejects.toThrow('DB error');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to log security event'));
    });
  });

  describe('getSecurityLogs', () => {
    it('retrieves security logs successfully', async () => {
      const mockLogs = [
        { eventType: 'failed_login', details: { userId: '123' }, timestamp: '2025-05-24T12:00:00Z' }
      ];
      db.getSecurityLogs.mockResolvedValueOnce(mockLogs);

      const result = await SecurityLogger.getSecurityLogs('2025-05-24', '2025-05-25');
      expect(result).toEqual([
        { eventType: 'failed_login', details: { userId: '123' }, timestamp: '2025-05-24T12:00:00Z' }
      ]);
      expect(db.getSecurityLogs).toHaveBeenCalledWith('2025-05-24', '2025-05-25');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Retrieved security logs'));
    });

    it('throws error when no logs are found', async () => {
      db.getSecurityLogs.mockResolvedValueOnce([]);
      await expect(SecurityLogger.getSecurityLogs('2025-05-24', '2025-05-25')).rejects.toThrow('No security logs found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('No security logs found'));
    });

    it('throws error on retrieval failure', async () => {
      db.getSecurityLogs.mockRejectedValueOnce(new Error('DB error'));
      await expect(SecurityLogger.getSecurityLogs('2025-05-24', '2025-05-25')).rejects.toThrow('DB error');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to retrieve security logs'));
    });
  });
});

