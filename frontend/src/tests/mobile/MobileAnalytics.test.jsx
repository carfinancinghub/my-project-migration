// File: MobileAnalytics.test.jsx
// Path: C:\CFH\frontend\src\tests\mobile\MobileAnalytics.test.jsx
// Purpose: Unit tests for MobileAnalytics component
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MobileAnalytics from '@components/mobile/MobileAnalytics';
import { getUserInsights } from '@services/api/analytics';
import logger from '@utils/logger';

jest.mock('@services/api/analytics');
jest.mock('@utils/logger');

describe('MobileAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<MobileAnalytics userId="123" />);
    expect(screen.getByText(/loading analytics/i)).toBeInTheDocument();
  });

  it('renders insights when data is available', async () => {
    getUserInsights.mockResolvedValueOnce({ insights: ['Increase bidding frequency.'] });
    render(<MobileAnalytics userId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/Your Analytics/i)).toBeInTheDocument();
      expect(screen.getByText(/Increase bidding frequency/i)).toBeInTheDocument();
    });
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Fetched analytics'));
  });

  it('renders error message on fetch failure', async () => {
    getUserInsights.mockRejectedValueOnce(new Error('API error'));
    render(<MobileAnalytics userId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to load analytics/i)).toBeInTheDocument();
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch analytics'));
    });
  });

  it('renders no insights message when data is unavailable', async () => {
    getUserInsights.mockResolvedValueOnce({ insights: [] });
    render(<MobileAnalytics userId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/No analytics insights available/i)).toBeInTheDocument();
    });
  });

  it('requires userId prop', () => {
    expect(MobileAnalytics.propTypes.userId).toBe(PropTypes.string.isRequired);
  });
});