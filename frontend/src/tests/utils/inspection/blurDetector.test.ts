/*
 * File: blurDetector.test.ts
 * Path: C:\\CFH\\frontend\\src\\tests\\utils\\inspection\\blurDetector.test.ts
 * Purpose: Unit tests for blur detection utility
 * Author: Cod1 Team
 * Crown Certified: Yes
 * Batch ID: Inspection-061325
 */

import { runBlurDetection } from '@/utils/inspection/blurDetector';

jest.mock('@tensorflow-models/blazeface', () => ({
  load: async () => ({
    estimateFaces: async () => [{ topLeft: [0, 0], bottomRight: [1, 1] }],
  }),
}));

Object.defineProperty(global.Image.prototype, 'src', {
  set() {
    setTimeout(() => this.onload && this.onload(new Event('load')));
  },
});

describe('runBlurDetection', () => {
  it('should resolve true when face is detected', async () => {
    const mockFile = new File([''], 'face.jpg', { type: 'image/jpeg' });
    const result = await runBlurDetection(mockFile);
    expect(result).toBe(true);
  });

  it('should resolve false when image fails to load', async () => {
    Object.defineProperty(global.Image.prototype, 'src', {
      set() {
        setTimeout(() => this.onerror && this.onerror(new Event('error')));
      },
    });

    const badFile = new File([''], 'broken.jpg', { type: 'image/jpeg' });
    const result = await runBlurDetection(badFile);
    expect(result).toBe(false);
  });

  it('should fallback to true on TensorFlow error', async () => {
    jest.resetModules();
    jest.doMock('@tensorflow-models/blazeface', () => ({
      load: async () => { throw new Error('model load fail'); },
    }));

    const fallbackFile = new File([''], 'error.jpg', { type: 'image/jpeg' });
    const { runBlurDetection: fallbackRun } = await import('@/utils/inspection/blurDetector');
    const result = await fallbackRun(fallbackFile);
    expect(result).toBe(true);
  });
});
