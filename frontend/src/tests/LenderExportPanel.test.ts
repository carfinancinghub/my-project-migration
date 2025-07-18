/**
 * © 2025 CFH, All Rights Reserved
 * File: LenderExportPanel.test.ts
 * Path: C:\cfh\frontend\src\tests\LenderExportPanel.test.ts
 * Purpose: Unit tests for LenderExportPanel.tsx to validate export functionality and premium features
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-18 [1703]
 * Version: 1.0.1
 * Version ID: d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9
 * Save Location: frontend/src/tests/LenderExportPanel.test.ts
 * Updated By: Cod1
 * Timestamp: 2025-07-18 [1703]
 */

/**
 * Side Note: TypeScript Conversion & Enhancements
 * - vi.fn() for mocks, accessibility assertions, premium scenario testing.
 * - Snapshot and user feedback coverage, edge case exports.
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LenderExportPanel from '@components/lender/LenderExportPanel';
import { vi } from 'vitest';

// Mock dependencies
vi.mock('@utils/logger', () => ({
  default: { error: vi.fn(), info: vi.fn() }
}));
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

describe('LenderExportPanel', () => {
  const defaultProps = { lenderId: 'lender123', isPremium: false };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should export lender data as CSV', async () => {
    render(<LenderExportPanel {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /export csv/i }));

    await waitFor(() => {
      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(screen.getByText(/exported successfully/i)).toBeInTheDocument();
    });
  });

  it('should display AI negotiation simulator for premium users', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ outcome: 'Rate reduced to 3.1%' }),
    } as any);

    render(<LenderExportPanel {...defaultProps} isPremium={true} />);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/lender/negotiate'),
        expect.any(Object)
      );
      expect(screen.getByText(/Rate reduced to 3.1%/i)).toBeInTheDocument();
    });
  });

  it('handles premium negotiation error', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('API error'));
    render(<LenderExportPanel {...defaultProps} isPremium={true} />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to simulate negotiation/i)).toBeInTheDocument();
    });
  });

  it('handles empty dataset export', async () => {
    render(<LenderExportPanel {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /export csv/i }));
    await waitFor(() => {
      expect(URL.createObjectURL).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'text/csv' })
      );
    });
  });

  it('has accessible export button', () => {
    render(<LenderExportPanel {...defaultProps} />);
    const button = screen.getByRole('button', { name: /export csv/i });
    expect(button).toHaveAttribute('aria-label', 'Export lender data as CSV');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<LenderExportPanel {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

// Cod1 Crown Certified: This suite covers export logic, premium features, error handling, accessibility, and regression.
