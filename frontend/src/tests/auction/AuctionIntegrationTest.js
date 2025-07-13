/**
 * File: AuctionIntegrationTest.js
 * Path: frontend/src/tests/auction/AuctionIntegrationTest.js
 * Purpose: Jest integration test for auction components and interactions
 * Author: Cod2 (05082257)
 * Date: May 08, 2025
 * Cod2 Crown Certified
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuctionLiveBidTracker from '@components/auction/AuctionLiveBidTracker';
import AuctionPremiumInsightsPanel from '@components/auction/AuctionPremiumInsightsPanel';
import AuctionSEOHead from '@components/auction/AuctionSEOHead';

jest.mock('socket.io-client', () => {
  return () => ({
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn()
  });
});

jest.mock('@utils/logger', () => ({
  error: jest.fn()
}));

jest.mock('@components/common/PremiumFeature', () => ({ children }) => (
  <div data-testid="premium-feature">{children}</div>
));

const mockAuction = {
  id: 'test123',
  vehicle: '2023 Tesla Model Y',
  category: 'Electric SUV'
};

describe('Rivers Auction Integration Tests', () => {
  it('renders AuctionLiveBidTracker without crashing', () => {
    render(<AuctionLiveBidTracker auctionId={mockAuction.id} />);
    expect(screen.getByText(/Live Bids/i)).toBeInTheDocument();
  });

  it('renders AuctionPremiumInsightsPanel for premium user', async () => {
    window.localStorage.setItem(
      `trendData_${mockAuction.id}`,
      JSON.stringify({
        labels: ['10:00', '10:30'],
        scores: [0.7, 0.9]
      })
    );

    render(<AuctionPremiumInsightsPanel auctionId={mockAuction.id} />);

    await waitFor(() => {
      expect(screen.getByRole('region', { name: /AI Prediction Trends/i })).toBeInTheDocument();
    });
    expect(screen.getByText(/Export Trends/i)).toBeInTheDocument();
  });

  it('injects AuctionSEOHead meta tags successfully', async () => {
    render(<AuctionSEOHead auction={mockAuction} />);
    await waitFor(() => {
      expect(document.title).toMatch(/2023 Tesla Model Y Auction/i);
    });

    const metaTags = document.head.querySelectorAll('meta');
    const keywordsTag = [...metaTags].find((tag) => tag.name === 'keywords');
    const ogTitleTag = [...metaTags].find((tag) => tag.getAttribute('property') === 'og:title');

    expect(keywordsTag?.content).toContain('Electric SUV');
    expect(ogTitleTag?.content).toMatch(/2023 Tesla Model Y Equity Auction/i);
  });
});

/**
 * ✅ Functions Summary:
 *
 * - **it('renders AuctionLiveBidTracker without crashing')**
 *   - **Purpose**: Ensure the live bid tracker renders correctly.
 *   - **What It Tests**: Rendering of `AuctionLiveBidTracker` component.
 *   - **Dependencies**: `@components/auction/AuctionLiveBidTracker`, `socket.io-client` (mocked).
 *
 * - **it('renders AuctionPremiumInsightsPanel for premium user')**
 *   - **Purpose**: Verify that AI trends panel loads with mock premium data.
 *   - **What It Tests**: Rendering of `AuctionPremiumInsightsPanel` with premium user context.
 *   - **Dependencies**: `@components/auction/AuctionPremiumInsightsPanel`, `@components/common/PremiumFeature` (mocked), `localStorage`.
 *
 * - **it('injects AuctionSEOHead meta tags successfully')**
 *   - **Purpose**: Assert that dynamic meta tags are injected into the DOM.
 *   - **What It Tests**: Meta tag injection by `AuctionSEOHead` component.
 *   - **Dependencies**: `@components/auction/AuctionSEOHead`.
 */
