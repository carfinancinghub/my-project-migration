```
// 👑 Crown Certified Test — ValuationAssistant.test.jsx
// Path: frontend/src/tests/ai/ValuationAssistant.test.jsx
// Purpose: Unit tests for ValuationAssistant component, covering rendering, premium gating, API calls, and error states.
// Author: Rivers Auction Team — May 17, 2025

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ValuationAssistant from '@components/ai/ValuationAssistant';
import { api } from '@services/api';
import logger from '@utils/logger';

jest.mock('@services/api');
jest.mock('@utils/logger', () => ({
  error: jest.fn(),
}));

describe('ValuationAssistant', () => {
  const mockProps = {
    auctionId: 'a1',
    bidAmount: 1000,
    isPremium: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders estimated value for non-premium user', async () => {
    api.get.mockResolvedValue({
      data: { data: { prediction: { successProbability: 0.75 } } },
    });

    render(<ValuationAssistant {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Valuation Assistant')).toBeInTheDocument();
      expect(screen.getByText(/Estimated Value/i)).toBeInTheDocument();
      expect(screen.getByText(/0.75/i)).toBeInTheDocument();
      expect(screen.queryByText(/Bidding Advice/i)).not.toBeInTheDocument();
    });
  });

  it('renders trends chart and advice for premium user', async () => {
    api.get.mockResolvedValueOnce({
      data: { data: { prediction: { successProbability: 0.75 } } },
    });
    api.get.mockResolvedValueOnce({
      data: { data: { recommendation: { message: 'Increase bid by 5%' } } },
    });

    render(<ValuationAssistant {...mockProps} isPremium={true} />);

    await waitFor(() => {
      expect(screen.getByText('Valuation Assistant')).toBeInTheDocument();
      expect(screen.getByText(/Estimated Value/i)).toBeInTheDocument();
      expect(screen.getByText(/Trends Chart/i)).toBeInTheDocument();
      expect(screen.getByText(/Increase bid by 5%/i)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    api.get.mockRejectedValue(new Error('Fetch failed'));

    render(<ValuationAssistant {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Unable to load valuation data')).toBeInTheDocument();
      expect(logger.error).toHaveBeenCalledWith('Failed to fetch valuation data', expect.any(Error));
    });
  });

  it('shows premium gate for non-premium recommendation access', async () => {
    api.get.mockResolvedValue({
      data: { data: { prediction: { successProbability: 0.75 } } },
    });

    render(<ValuationAssistant {...mockProps} isPremium={false} />);

    await waitFor(() => {
      expect(screen.getByText('Bidding advice requires premium access')).toBeInTheDocument();
    });
  });
});

/*
Functions Summary:
- describe('ValuationAssistant')
  - Purpose: Test suite for ValuationAssistant component
  - Tests:
    - Renders estimated value for non-premium users
    - Renders trends chart and advice for premium users
    - Handles API errors
    - Shows premium gate for non-premium recommendation access
  - Dependencies: react, @testing-library/react, @components/ai/ValuationAssistant, @services/api, @utils/logger
*/
```