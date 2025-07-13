// File: SecurityAudit.test.js
// Path: C:\CFH\backend\tests\final\SecurityAudit.test.js
// Purpose: Unit tests for SecurityAudit service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const SecurityAudit = require('@services/final/SecurityAudit');
const db = require('@services/db');
const security = require('@services/security');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@services/security');
jest.mock('@utils/logger');

describe('SecurityAudit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('auditRateLimits', () => {
    it('audits rate limits successfully with passing status', async () => {
      const mockLogs = [
        { ipAddress: '192.168.1.1' },
        { ipAddress: '192.168.1.2' }
      ];
      db.getRateLimitLogs.mockResolvedValueOnce(mockLogs);
      security.getBlockedIPsCount.mockResolvedValueOnce(1);

      const result = await SecurityAudit.auditRateLimits();
      expect(result).toEqual({
        totalViolations: 2,
        uniqueIPs: 2,
        blockedIPs: 1,
        status: true
      });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Audited rate limits: Passed'));
    });

    it('audits rate limits with failing status', async () => {
      const mockLogs = Array(150).fill({ ipAddress: '192.168.1.1' });
      db.getRateLimitLogs.mockResolvedValueOnce(mockLogs);
      security.getBlockedIPsCount.mockResolvedValueOnce(10);

      const result = await SecurityAudit.auditRateLimits();
      expect(result).toEqual({
        totalViolations: 150,
        uniqueIPs: 1,
        blockedIPs: 10,
        status: false
      });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Audited rate limits: Failed'));
    });
  });

  describe('auditSecurityLogs', () => {
    it('audits security logs successfully with passing status', async () => {
      const mockLogs = [
        { eventType: 'failed_login', details: {} },
        { eventType: 'successful_login', details: {} }
      ];
      db.getSecurityLogs.mockResolvedValueOnce(mockLogs);

      const result = await SecurityAudit.auditSecurityLogs('2025-05-24', '2025-05-25');
      expect(result).toEqual({
        totalEvents: 2,
        eventsByType: { failed_login: 1, successful_login: 1 },
        criticalEvents: 1,
        status: true
      });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Audited security logs: Passed'));
    });

    it('audits security logs with failing status', async () => {
      const mockLogs = Array(60).fill({ eventType: 'failed_login', details: {} });
      db.getSecurityLogs.mockResolvedValueOnce(mockLogs);

      const result = await SecurityAudit.auditSecurityLogs('2025-05-24', '2025-05-25');
      expect(result).toEqual({
        totalEvents: 60,
        eventsByType: { failed_login: 60 },
        criticalEvents: 60,
        status: false
      });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Audited security logs: Failed'));
    });

    it('throws error when no logs are found', async () => {
      db.getSecurityLogs.mockResolvedValueOnce([]);
      await expect(SecurityAudit.auditSecurityLogs('2025-05-24', '2025-05-25')).rejects.toThrow('No security logs found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('No security logs found'));
    });
  });
});

