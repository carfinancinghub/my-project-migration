// File: PricingInsights.test.jsx
// Path: C:\CFH\frontend\src\tests\premium\PricingInsights.test.jsx
// Purpose: Unit tests for PricingInsights component
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PricingInsights from '@components/premium/PricingInsights';
import { getDynamicPrice } from '@services/api/premium';
import logger from '@utils/logger';

jest.mock('@services/api/premium');
jest.mock('@utils/logger');

describe('PricingInsights', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<PricingInsights userId="123" auctionId="789" />);
    expect(screen.getByText(/loading pricing insights/i)).toBeInTheDocument();
  });

  it('renders pricing insights when data is available', async () => {
    const mockInsights = { suggestedBid: 11000, confidence: 0.85, trend: 'increasing' };
    getDynamicPrice.mockResolvedValueOnce(mockInsights);

    render(<PricingInsights userId="123" auctionId="789" />);
    await waitFor(() => {
      expect(screen.getByText(/Dynamic Pricing Insights/i)).toBeInTheDocument();
      expect(screen.getByText(/Suggested Bid: \$11000/i)).toBeInTheDocument();
      expect(screen.getByText(/Confidence: 85.0%/i)).toBeInTheDocument();
      expect(screen.getByText(/Market Trend: increasing/i)).toBeInTheDocument();
    });
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Fetched pricing insights'));
  });

  it('renders no insights message when data is unavailable', async () => {
    getDynamicPrice.mockResolvedValueOnce(null);
    render(<PricingInsights userId="123" auctionId="789" />);
    await waitFor(() => {
      expect(screen.getByText(/No pricing insights available/i)).toBeInTheDocument();
    });
  });

  it('renders error message on fetch failure', async () => {
    getDynamicPrice.mockRejectedValueOnce(new Error('API error'));
    render(<PricingInsights userId="123" auctionId="789" />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to load pricing insights/i)).toBeInTheDocument();
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch pricing insights'));
    });
  });

  it('requires userId and auctionId props', () => {
    expect(PricingInsights.propTypes.userId).toBe(PropTypes.string.isRequired);
    expect(PricingInsights.propTypes.auctionId).toBe(PropTypes.string.isRequired);
  });
});