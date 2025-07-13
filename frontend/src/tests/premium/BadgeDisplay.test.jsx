// File: BadgeDisplay.test.jsx
// Path: C:\CFH\frontend\src\tests\premium\BadgeDisplay.test.jsx
// Purpose: Unit tests for BadgeDisplay component
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import BadgeDisplay from '@components/premium/BadgeDisplay';
import { getUserBadges } from '@services/api/premium';
import logger from '@utils/logger';

jest.mock('@services/api/premium');
jest.mock('@utils/logger');

describe('BadgeDisplay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<BadgeDisplay userId="123" />);
    expect(screen.getByText(/loading badges/i)).toBeInTheDocument();
  });

  it('renders badges when data is available', async () => {
    const mockBadges = [
      { type: 'Top Bidder', awardedAt: '2025-05-24T12:00:00Z' },
      { type: 'Frequent Winner', awardedAt: '2025-05-24T12:00:00Z' }
    ];
    getUserBadges.mockResolvedValueOnce(mockBadges);

    render(<BadgeDisplay userId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/Your Badges/i)).toBeInTheDocument();
      expect(screen.getByText(/Top Bidder/i)).toBeInTheDocument();
      expect(screen.getByText(/Frequent Winner/i)).toBeInTheDocument();
    });
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Fetched badges'));
  });

  it('renders no badges message when none are available', async () => {
    getUserBadges.mockResolvedValueOnce([]);
    render(<BadgeDisplay userId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/No badges yet/i)).toBeInTheDocument();
    });
  });

  it('renders error message on fetch failure', async () => {
    getUserBadges.mockRejectedValueOnce(new Error('API error'));
    render(<BadgeDisplay userId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to load badges/i)).toBeInTheDocument();
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch badges'));
    });
  });

  it('requires userId prop', () => {
    expect(BadgeDisplay.propTypes.userId).toBe(PropTypes.string.isRequired);
  });
});