/**
 * Test file for timeUtils.ts
 * Path: C:\CFH\backend\tests\utils\timeUtils.test.ts
 * Purpose: Unit tests for time utility functions in the CFH Automotive Ecosystem.
 * Author: Cod1 Team (reviewed by Grok)
 * Date: 2025-07-14 [1610]
 * Version: 1.1.0
 * Crown Certified: Yes
 * Batch ID: Compliance-071425
 * Artifact ID: k3l4m5n6-o7p8-q9r0-s1t2-u3v4w5x6y7z8
 * Save Location: C:\CFH\backend\tests\utils\timeUtils.test.ts
 * Updated By: Grok (based on Cod1 suggestions)
 * Timestamp: 2025-07-14 [1610]
 */

import {
  getCurrentTimestamp,
  getUnixTimestamp,
  getAdjustedTimestamp
} from '@utils/timeUtils';

describe('Time Utils', () => {
  it('should return valid ISO timestamp', () => {
    const result = getCurrentTimestamp();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('should return valid UNIX timestamp (seconds)', () => {
    const result = getUnixTimestamp();
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThan(1600000000);
  });

  it('should return adjusted ISO timestamp', () => {
    const offset = -7 * 60 * 60 * 1000; // PDT example
    const result = getAdjustedTimestamp(offset);
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('should handle zero offset (no change)', () => {
    const result = getAdjustedTimestamp(0);
    expect(result).toBe(getCurrentTimestamp()); // Mock Date for exact match in real tests
  });
});
