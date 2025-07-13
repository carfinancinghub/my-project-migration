// File: ErrorHandler.test.js
// Path: C:\CFH\backend\tests\operational\ErrorHandler.test.js
// Purpose: Unit tests for ErrorHandler service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const ErrorHandler = require('@services/operational/ErrorHandler');
const db = require('@services/db');
const logger = require('@utils/logger');

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('ErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleError', () => {
    it('handles error successfully', async () => {
      const mockError = new Error('Test error');
      mockError.stack = 'stack trace';
      const context = { userId: '123', action: 'test' };
      db.logError.mockResolvedValueOnce({});

      const result = await ErrorHandler.handleError(mockError, context);
      expect(result).toEqual({ status: 'error', message: 'Test error' });
      expect(db.logError).toHaveBeenCalledWith(expect.objectContaining({ message: 'Test error', context }));
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Handled error'));
    });

    it('handles error logging failure', async () => {
      const mockError = new Error('Test error');
      mockError.stack = 'stack trace';
      const context = { userId: '123', action: 'test' };
      db.logError.mockRejectedValueOnce(new Error('DB error'));

      const result = await ErrorHandler.handleError(mockError, context);
      expect(result).toEqual({ status: 'error', message: 'Failed to handle error' });
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to log error'));
    });
  });

  describe('getErrorLogs', () => {
    it('retrieves error logs successfully', async () => {
      const mockErrors = [
        { message: 'Test error', context: { userId: '123' }, timestamp: '2025-05-24T12:00:00Z' }
      ];
      db.getErrorLogs.mockResolvedValueOnce(mockErrors);

      const result = await ErrorHandler.getErrorLogs('2025-05-24', '2025-05-25');
      expect(result).toEqual([
        { message: 'Test error', context: { userId: '123' }, timestamp: '2025-05-24T12:00:00Z' }
      ]);
      expect(db.getErrorLogs).toHaveBeenCalledWith('2025-05-24', '2025-05-25');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Retrieved error logs'));
    });

    it('throws error when no error logs are found', async () => {
      db.getErrorLogs.mockResolvedValueOnce([]);
      await expect(ErrorHandler.getErrorLogs('2025-05-24', '2025-05-25')).rejects.toThrow('No error logs found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('No error logs found'));
    });

    it('throws error on retrieval failure', async () => {
      db.getErrorLogs.mockRejectedValueOnce(new Error('DB error'));
      await expect(ErrorHandler.getErrorLogs('2025-05-24', '2025-05-25')).rejects.toThrow('DB error');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to retrieve error logs'));
    });
  });
});

