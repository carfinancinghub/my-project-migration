// File: BadgeStorefront.test.jsx
// Path: C:\CFH\frontend\src\tests\gamification\BadgeStorefront.test.jsx
// Purpose: Test rendering, purchasing, and error handling in BadgeStorefront
// Author: Rivers Auction Dev Team
// Date: 2025-05-20
// 👑 Cod2 Crown Certified: Yes

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import logger from '@utils/logger';
import BadgeStorefront from '@components/gamification/BadgeStorefront';

jest.mock('axios');

const mockBadges = [
  { id: 'b1', name: 'Speedster', price: 50, imageUrl: '/badges/speedster.png', owned: false },
  { id: 'b2', name: 'Strategist', price: 75, imageUrl: '/badges/strategist.png', owned: true }
];

describe('BadgeStorefront Component', () => {
  it('renders badge grid with mock data', async () => {
    axios.get.mockResolvedValueOnce({ data: mockBadges });
    render(<BadgeStorefront userId="user123" isPremium />);
    await waitFor(() => {
      expect(screen.getByText('Speedster')).toBeInTheDocument();
      expect(screen.getByText('Strategist')).toBeInTheDocument();
    });
  });

  it('simulates successful badge purchase and updates UI', async () => {
    axios.get.mockResolvedValueOnce({ data: mockBadges });
    axios.post.mockResolvedValueOnce({ data: { success: true } });
    render(<BadgeStorefront userId="user123" isPremium />);
    await waitFor(() => screen.getByText('Speedster'));

    fireEvent.click(screen.getByText(/Buy/i));

    await waitFor(() => {
      expect(screen.getByText(/Owned/i)).toBeInTheDocument();
    });
  });

  it('handles API failure with error message', async () => {
    axios.get.mockResolvedValueOnce({ data: mockBadges });
    axios.post.mockRejectedValueOnce(new Error('Purchase failed'));
    render(<BadgeStorefront userId="user123" isPremium />);
    await waitFor(() => screen.getByText('Speedster'));

    fireEvent.click(screen.getByText(/Buy/i));

    await waitFor(() => {
      expect(screen.getByText(/Purchase failed/i)).toBeInTheDocument();
    });

    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Badge purchase failed'));
  });

  it('shows loading state during badge fetch', async () => {
    axios.get.mockImplementation(() => new Promise(() => {}));
    render(<BadgeStorefront userId="user123" isPremium />);
    expect(screen.getByText(/Loading badges/i)).toBeInTheDocument();
  });
});

BadgeStorefront.propTypes = {}; // No props directly passed to BadgeStorefront in this context

/*
Functions Summary:

- Renders badge storefront UI with badges fetched from API
- Handles badge purchase via POST request
- Displays "Owned" state on success
- Displays error message on failure
- Shows loading indicator while fetching badges
*/

// Suggestion Bracket (for CFH Ecosystem Enhancements):
// - Add AI-driven badge testing via PredictionEngine.js for dynamic scenarios
// - Include WCAG 2.1 accessibility testing (ARIA roles for badges)
// - Add blockchain badge verification test using BlockchainAdapter.js
// - Use cacheManager.js to reduce fetch load during test cycles
// - Extend AuctionGamificationEngine.js to track badge purchase conversions
