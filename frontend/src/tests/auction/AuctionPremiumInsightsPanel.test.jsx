/**
 * File: AuctionPremiumInsightsPanel.test.jsx
 * Path: frontend/src/tests/auction/AuctionPremiumInsightsPanel.test.jsx
 * Purpose: Unit test suite for the AuctionPremiumInsightsPanel component
 * Author: Cod2 (05082309)
 * Date: May 08, 2025
 * Cod2 Crown Certified
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuctionPremiumInsightsPanel from '@components/auction/AuctionPremiumInsightsPanel';

// --- Mocks ---
jest.mock('@components/common/PremiumFeature', () => ({ children }) => (
  <div data-testid="premium-wrapper">{children}</div>
));

jest.mock('axios', () => ({
  get: jest.fn((url) => {
    if (url.includes('/bid-timing')) {
      return Promise.resolve({ data: { timing: 'Optimal: Final 5 seconds' } });
    }
    if (url.includes('/trends')) {
      return Promise.resolve({
        data: {
          labels: ['Start', 'Mid', 'End'],
          scores: [0.3, 0.7, 0.95]
        }
      });
    }
    if (url.includes('/premium-status')) {
      return Promise.resolve({ data: { isPremium: true } });
    }
  })
}));

// --- Tests ---
describe('AuctionPremiumInsightsPanel Component', () => {
  const auctionId = 'abc123';

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders chart and timing suggestions for premium user', async () => {
    render(<AuctionPremiumInsightsPanel auctionId={auctionId} />);

    await waitFor(() =>
      expect(screen.getByRole('region', { name: /AI Prediction Trends/i })).toBeInTheDocument()
    );

    expect(screen.getByText(/Optimal: Final 5 seconds/i)).toBeInTheDocument();
    expect(screen.getByText(/Export Trends/i)).toBeInTheDocument();
  });

  it('caches trends in localStorage', async () => {
    render(<AuctionPremiumInsightsPanel auctionId={auctionId} />);

    await waitFor(() =>
      expect(localStorage.getItem(`trendData_${auctionId}`)).toBeTruthy()
    );
  });

  it('triggers PNG export when export button is clicked', async () => {
    render(<AuctionPremiumInsightsPanel auctionId={auctionId} />);
    await waitFor(() => screen.getByText(/Export Trends/i));

    const mockClick = jest.fn();
    const createElementSpy = jest.spyOn(document, 'createElement');
    createElementSpy.mockImplementation((tagName) => {
      const element = document.createElementNS('http://www.w3.org/1999/xhtml', tagName);
      if (tagName === 'a') element.click = mockClick;
      return element;
    });

    fireEvent.click(screen.getByText(/Export Trends/i));
    expect(mockClick).toHaveBeenCalled();

    createElementSpy.mockRestore();
  });
});

/**
 * ✅ Functions Summary:
 *
 * - **it('renders chart and timing suggestions for premium user')**
 *   - **Purpose**: Verify rendering of AI confidence chart and timing hint.
 *   - **What It Tests**: Component behavior when premium user loads.
 *   - **Dependencies**: @components/auction/AuctionPremiumInsightsPanel, axios (mocked), PremiumFeature (mocked).
 *
 * - **it('caches trends in localStorage')**
 *   - **Purpose**: Ensure trend data is cached in localStorage for performance.
 *   - **What It Tests**: Storage call to localStorage.
 *   - **Dependencies**: localStorage, axios (mocked).
 *
 * - **it('triggers PNG export when export button is clicked')**
 *   - **Purpose**: Simulates download trigger on export.
 *   - **What It Tests**: Canvas-to-PNG logic and download.
 *   - **Dependencies**: DOM `document.createElement`, mocked anchor tag.
 */
