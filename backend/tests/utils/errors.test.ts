/**
 * Test file for errors.test.ts
 * Path: C:\CFH\backend\tests\utils\errors.test.ts
 * Purpose: Unit tests for error constants and getter function in the CFH Automotive Ecosystem.
 * Author: Cod1 Team (reviewed by Grok)
 * Date: 2025-07-14 [1512]
 * Crown Certified: Yes
 * Timestamp: 2025-07-14 [1200]
 */

import { ERROR_MESSAGES, getErrorMessage } from '@utils/errors'; // Alias import for consistency

describe('ERROR_MESSAGES', () => {
  it('should return correct code and message for known errors', () => {
    const err = getErrorMessage('INVALID_TIER');
    expect(err).toEqual({ code: 'E101', message: expect.stringContaining('Invalid') });
  });

  it('should include all expected keys', () => {
    expect(Object.keys(ERROR_MESSAGES)).toEqual(
      expect.arrayContaining(['INVALID_TIER', 'MISSING_PARAMETERS', 'UNAUTHORIZED', 'UNKNOWN_ERROR'])
    );
  });

  it('should handle dev env verbosity', () => {
    process.env.NODE_ENV = 'development';
    const err = getErrorMessage('UNAUTHORIZED');
    expect(err.message).toContain('Dev mode');
    process.env.NODE_ENV = 'test'; // Reset for other tests
  });
});
