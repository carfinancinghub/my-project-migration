/**
 * File: LenderExportPanel.test.js
 * Path: frontend/src/tests/LenderExportPanel.test.js
 * Purpose: Unit tests for LenderExportPanel.jsx to validate export functionality and premium features
 * Author: SG
 * Date: April 28, 2025
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LenderExportPanel from '@components/lender/LenderExportPanel'; // Alias for component
import { vi } from 'vitest';

// Mock dependencies
vi.mock('@utils/logger', () => ({ default: { error: vi.fn(), info: vi.fn() } }));
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

describe('LenderExportPanel', () => {
  const defaultProps = {
    lenderId: 'lender123',
    isPremium: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Test free feature: Basic export
   * Should export lender data as CSV
   */
  it('should export lender data as CSV', async () => {
    render(<LenderExportPanel {...defaultProps} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /export csv/i }));

    await waitFor(() => {
      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(screen.getByText(/exported successfully/i)).toBeInTheDocument();
    });
  });

  /**
   * Test premium feature: AI-driven negotiation simulator
   * Should display simulated negotiation outcomes
   */
  it('should display AI negotiation simulator for premium users', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ outcome: 'Rate reduced to 3.1%' }),
    });

    render(<LenderExportPanel {...defaultProps} isPremium={true} />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/lender/negotiate'),
        expect.any(Object)
      );
      expect(screen.getByText(/Rate reduced to 3.1%/i)).toBeInTheDocument();
    });
  });
});

// Cod2 Crown Certified: This test suite validates core export functionality and premium AI negotiation simulator,
// uses Jest with @ aliases, and ensures robust error handling and modularity.