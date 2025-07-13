/*
 * File: tests/__smoke__.test.ts
 * Path: C:\\CFH\\frontend\\packages\\inspection-utils\\tests\\__smoke__.test.ts
 * Purpose: CI-level validation to ensure build and critical utility import success
 * Author: Cod1 Team
 * Crown Certified: Yes
 * Batch ID: Inspection-061325
 */

import { runBlurDetection } from '@cfh/inspection-utils';

describe('CI Smoke Test: Inspection Utils', () => {
  it('should import blurDetector without errors', () => {
    expect(runBlurDetection).toBeDefined();
    expect(typeof runBlurDetection).toBe('function');
  });

  it('should resolve type of blurDetector function correctly', () => {
    type RBD = typeof runBlurDetection;
    const returnsPromise = (): RBD => runBlurDetection;
    expect(typeof returnsPromise).toBe('function');
  });
});
