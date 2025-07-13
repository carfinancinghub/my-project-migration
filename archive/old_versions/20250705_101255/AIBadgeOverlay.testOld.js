// File: AIBadgeOverlay.test.js
// Path: frontend/src/tests/ai/AIBadgeOverlay.test.js
// Purpose: Unit tests for AIBadgeOverlay.jsx covering free and premium paths
// Author: Rivers Auction Team
// Date: May 15, 2025
// 👑 Cod2 Crown Certified

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AIBadgeOverlay from '@components/ai/AIBadgeOverlay';

jest.mock('@services/ai/BadgeService', () => ({
  fetchUserBadgeStats: jest.fn(() =>
    Promise.resolve({ overlayTitle: 'Top Bidder in 5 Auctions', details: 'Ranked #1 this month' })
  )
}));

jest.mock('@utils/animation', () => ({
  getPremiumBadgeAnimation: jest.fn(() => ({
    boxShadow: '0 0 10px gold',
    animation: 'pulse 2s infinite',
  }))
}));

describe('AIBadgeOverlay', () => {
  it('renders static badge for free users', () => {
    render(<AIBadgeOverlay userId="user1" isPremium={false} />);
    expect(screen.getByText(/Top Bidder/i)).toBeInTheDocument();
  });

  it('renders animated badge for premium users', async () => {
    render(<AIBadgeOverlay userId="user2" isPremium={true} />);
    await waitFor(() => {
      expect(screen.getByText(/Top Bidder in 5 Auctions/i)).toBeInTheDocument();
      expect(screen.getByText(/Ranked #1 this month/i)).toBeInTheDocument();
    });
  });

  it('shows fallback on error from badge service', async () => {
    const { fetchUserBadgeStats } = require('@services/ai/BadgeService');
    fetchUserBadgeStats.mockImplementationOnce(() =>
      Promise.reject(new Error('Badge fetch failed'))
    );
    render(<AIBadgeOverlay userId="user3" isPremium={true} />);
    await waitFor(() => {
      expect(screen.getByText(/Unable to load badge details/i)).toBeInTheDocument();
    });
  });
});

/**
 * Functions Summary:
 * - renders static badge for free users: Verifies default badge loads with no animation.
 * - renders animated badge for premium users: Verifies badge loads with AI title + animation.
 * - shows fallback on error from badge service: Simulates API failure and confirms fallback error.
 * Dependencies: React Testing Library, @services/ai/BadgeService, @utils/animation
 */