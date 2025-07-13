```
// 👑 Crown Certified Test — TrustScoreViewer.test.jsx
// Path: frontend/src/tests/ai/TrustScoreViewer.test.jsx
// Purpose: Unit tests for TrustScoreViewer component, covering rendering, premium gating, API calls, and error states.
// Author: Rivers Auction Team — May 17, 2025

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TrustScoreViewer from '@components/ai/TrustScoreViewer';
import { api } from '@services/api';
import logger from '@utils/logger';

jest.mock('@services/api');
jest.mock('@utils/logger', () => ({
  error: jest.fn(),
}));

describe('TrustScoreViewer', () => {
  const mockProps = {
    userId: 'u1',
    isPremium: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders trust score for non-premium user', async () => {
    api.get.mockResolvedValue({
      data: { data: { score: 85, breakdown: null } },
    });

    render(<TrustScoreViewer {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Trust Score')).toBeInTheDocument();
      expect(screen.getByText('Trust Score: 85/100')).toBeInTheDocument();
      expect(screen.queryByText('Escrow Compliance')).not.toBeInTheDocument();
    });
  });

  it('renders breakdown and trend for premium user', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        data: {
          score: 85,
          breakdown: {
            escrowCompliance: '90%',
            bidConsistency: '80%',
            auctionActivity: '5 auctions',
            trustTrend: 'Positive',
          },
        },
      },
    });
    api.get.mockResolvedValueOnce({
      data: { data: { trend: 'Improving', confidence: 0.9 } },
    });

    render(<TrustScoreViewer {...mockProps} isPremium={true} />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('Load Trust Trend'));
    });

    await waitFor(() => {
      expect(screen.getByText('Trust Score')).toBeInTheDocument();
      expect(screen.getByText('Trust Score: 85/100')).toBeInTheDocument();
      expect(screen.getByText('Escrow Compliance: 90%')).toBeInTheDocument();
      expect(screen.getByText('Trend: Improving (Confidence: 90.0%)')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    api.get.mockRejectedValue(new Error('Fetch failed'));

    render(<TrustScoreViewer {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Unable to load trust score')).toBeInTheDocument();
      expect(logger.error).toHaveBeenCalledWith('Failed to fetch trust score for user u1', expect.any(Error));
    });
  });

  it('shows premium gate for non-premium breakdown access', async () => {
    api.get.mockResolvedValue({
      data: { data: { score: 85, breakdown: null } },
    });

    render(<TrustScoreViewer {...mockProps} isPremium={false} />);

    await waitFor(() => {
      expect(screen.getByText('Detailed trust breakdown requires premium access')).toBeInTheDocument();
    });
  });
});

/*
Functions Summary:
- describe('TrustScoreViewer')
  - Purpose: Test suite for TrustScoreViewer component
  - Tests:
    - Renders trust score for non-premium users
    - Renders breakdown and trend for premium users
    - Handles API errors
    - Shows premium gate for non-premium breakdown access
  - Dependencies: react, @testing-library/react, @components/ai/TrustScoreViewer, @services/api, @utils/logger
*/
```