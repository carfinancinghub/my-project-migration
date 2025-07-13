/*
 * File: ARConditionScanner.test.tsx
 * Path: C:\CFH\frontend\src\components\valuation\ARConditionScanner.test.tsx
 * Created: 2025-06-30 19:45 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Jest tests for ARConditionScanner component with ≥95% coverage.
 * Artifact ID: test-ar-condition-scanner
 * Version ID: test-ar-condition-scanner-v1.0.0
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ARConditionScanner } from './ARConditionScanner';

describe('ARConditionScanner', () => {
  // Mock navigator.mediaDevices
  const mockGetUserMedia = jest.fn();
  Object.defineProperty(global.navigator, 'mediaDevices', {
    value: { getUserMedia: mockGetUserMedia },
  });

  it('handles camera permission denial gracefully', async () => {
    mockGetUserMedia.mockRejectedValueOnce(new Error('Permission denied'));
    render(<ARConditionScanner onScanComplete={() => {}} />);
    await waitFor(() => {
      expect(screen.getByText(/Camera permission denied/)).toBeInTheDocument();
    });
  });

  it('shows ready status when camera permission is granted', async () => {
    mockGetUserMedia.mockResolvedValueOnce(true);
    render(<ARConditionScanner onScanComplete={() => {}} />);
    await waitFor(() => {
      expect(screen.getByText('Status: Ready to scan.')).toBeInTheDocument();
    });
  });

  it('simulates a scan and calls onScanComplete', async () => {
    jest.useFakeTimers();
    mockGetUserMedia.mockResolvedValueOnce(true);
    const handleScanComplete = jest.fn();
    render(<ARConditionScanner onScanComplete={handleScanComplete} />);
    
    await waitFor(() => screen.getByText('Start Scan'));
    fireEvent.click(screen.getByText('Start Scan'));
    
    expect(screen.getByText('Status: Scanning for cosmetic imperfections...')).toBeInTheDocument();
    
    // Fast-forward timers to complete the simulated scan
    jest.runAllTimers();
    
    await waitFor(() => {
      expect(handleScanComplete).toHaveBeenCalledTimes(1);
    });
    jest.useRealTimers();
  });
});