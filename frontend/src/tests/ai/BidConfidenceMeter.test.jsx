```
// 👑 Crown Certified Test — BidConfidenceMeter.test.jsx
// Path: frontend/src/tests/ai/BidConfidenceMeter.test.jsx
// Purpose: Unit tests for BidConfidenceMeter component, covering rendering, premium gating, API calls, and error states.
// Author: Rivers Auction Team — May 17, 2025

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BidConfidenceMeter from '@components/ai/BidConfidenceMeter';
import { api } from '@services/api';
import logger from '@utils/logger';

jest.mock('@services/api');
jest.mock('@utils/logger', () => ({
  error: jest.fn(),
}));

describe('BidConfidenceMeter', () => {
  const mockProps = {
    auctionId: 'a1',
    bidAmount: 1000,
    isPremium: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders confidence score for non-premium user', async () => {
    api.get.mockResolvedValue({
      data: { data: { prediction: { successProbability: 0.75 } } },
    });

    render(<BidConfidenceMeter {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Bid Confidence Meter')).toBeInTheDocument();
      expect(screen.getByText(/Confidence Score: 75.0%/i)).toBeInTheDocument();
      expect(screen.queryByText(/Advice:/i)).not.toBeInTheDocument();
    });
  });

  it('renders bidding advice for premium user', async () => {
    api.get.mockResolvedValueOnce({
      data: { data: { prediction: { successProbability: 0.75 } } },
    });
    api.get.mockResolvedValueOnce({
      data: { data: { recommendation: { message: 'Increase bid by 5%' } } },
    });

    render(<BidConfidenceMeter {...mockProps} isPremium={true} />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('Load Bidding Advice'));
    });

    await waitFor(() => {
      expect(screen.getByText('Bid Confidence Meter')).toBeInTheDocument();
      expect(screen.getByText(/Confidence Score: 75.0%/i)).toBeInTheDocument();
      expect(screen.getByText(/Increase bid by 5%/i)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    api.get.mockRejectedValue(new Error('Fetch failed'));

    render(<BidConfidenceMeter {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Unable to load confidence data')).toBeInTheDocument();
      expect(logger.error).toHaveBeenCalledWith('Failed to fetch confidence for auction a1', expect.any(Error));
    });
  });

  it('shows premium gate for non-premium advice access', async () => {
    api.get.mockResolvedValue({
      data: { data: { prediction: { successProbability: 0.75 } } },
    });

    render(<BidConfidenceMeter {...mockProps} isPremium={false} />);

    await waitFor(() => {
      expect(screen.getByText('Bidding advice requires premium access')).toBeInTheDocument();
    });
  });
});

/*
Functions Summary:
- describe('BidConfidenceMeter')
  - Purpose: Test suite for BidConfidenceMeter component
  - Tests:
    - Renders confidence score for non-premium users
    - Renders bidding advice for premium users
    - Handles API errors
    - Shows premium gate for non-premium advice access
  - Dependencies: react, @testing-library/react, @components/ai/BidConfidenceMeter, @services/api, @utils/logger
*/
```