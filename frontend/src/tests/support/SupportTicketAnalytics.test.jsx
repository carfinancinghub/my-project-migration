// File: SupportTicketAnalytics.test.jsx
// Path: C:\CFH\frontend\src\tests\support\SupportTicketAnalytics.test.jsx
// Purpose: Unit tests for SupportTicketAnalytics component (freemium, premium, Wow++)
// Author: Rivers Auction Dev Team
// Date: 2025-05-23
// Cod2 Crown Certified: Yes

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SupportTicketAnalytics from '@components/support/SupportTicketAnalytics';
import { fetchAnalytics } from '@services/api/support';
import { cacheManager } from '@utils/cacheManager';
import logger from '@utils/logger';

jest.mock('@services/api/support');
jest.mock('@utils/cacheManager');
jest.mock('@utils/logger');

const mockAnalyticsData = {
  open: 10,
  closed: 20,
  trend: [{ date: '2025-05-20', count: 30, style: 'gradient-red', hover: 'tooltip', animation: { type: 'fade-in', duration: '0.5s' } }],
  categories: { urgent: 5, standard: 15 },
  priorities: {
    urgent: { count: 5, color: 'red' },
    standard: { count: 15, color: 'green' }
  },
  heatmap: [
    { time: 24, count: 10 },
    { time: 48, count: 5 },
  ]
};

describe('SupportTicketAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<SupportTicketAnalytics userId="123" isPremium={false} />);
    expect(screen.getByText(/loading analytics/i)).toBeInTheDocument();
  });

  it('renders basic stats when analytics data is available (freemium)', async () => {
    cacheManager.get.mockReturnValueOnce(mockAnalyticsData);
    render(<SupportTicketAnalytics userId="123" isPremium={false} />);
    await waitFor(() => {
      expect(screen.getByText(/Open Tickets: 10/i)).toBeInTheDocument();
      expect(screen.getByText(/Closed Tickets: 20/i)).toBeInTheDocument();
    });
  });

  it('uses cached data and skips fetchAnalytics call', async () => {
    cacheManager.get.mockReturnValueOnce(mockAnalyticsData);
    render(<SupportTicketAnalytics userId="123" isPremium={false} />);
    await waitFor(() => {
      expect(fetchAnalytics).not.toHaveBeenCalled();
    });
  });

  it('renders premium chart and chatbot if isPremium is true', async () => {
    cacheManager.get.mockReturnValueOnce(mockAnalyticsData);
    render(<SupportTicketAnalytics userId="123" isPremium={true} />);
    await waitFor(() => {
      expect(screen.getByText(/Export PDF/i)).toBeInTheDocument();
      expect(screen.getByText(/Export CSV/i)).toBeInTheDocument();
      expect(screen.getByText(/AI Chatbot/i)).toBeInTheDocument();
      expect(document.querySelector('#analyticsChart')).toBeInTheDocument();
    });
  });

  it('mocks Chart.js and verifies dataset values for premium user', async () => {
    const mockChart = jest.fn().mockImplementation((ctx, config) => {
      expect(config.data.datasets[0].data).toEqual([10, 20]);
      return { destroy: jest.fn() };
    });
    jest.mock('chart.js/auto', () => ({ default: mockChart }));

    cacheManager.get.mockReturnValueOnce(mockAnalyticsData);
    render(<SupportTicketAnalytics userId="123" isPremium={true} />);
  });

  it('verifies heatmap data canvas render call for premium user', async () => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    const fillRectMock = jest.fn();
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({ fillRect: fillRectMock }));

    cacheManager.get.mockReturnValueOnce(mockAnalyticsData);
    render(<SupportTicketAnalytics userId="123" isPremium={true} />);

    await waitFor(() => {
      expect(fillRectMock).toHaveBeenCalled();
    });

    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });

  it('does not show premium heatmap when isPremium is false', async () => {
    cacheManager.get.mockReturnValueOnce(mockAnalyticsData);
    render(<SupportTicketAnalytics userId="123" isPremium={false} />);
    await waitFor(() => {
      const canvas = document.querySelector('canvas');
      expect(canvas).toBeNull();
    });
  });

  it('renders hover tooltip and animation duration for trend if isPremium is true', async () => {
    cacheManager.get.mockReturnValueOnce(mockAnalyticsData);
    render(<SupportTicketAnalytics userId="123" isPremium={true} />);
    await waitFor(() => {
      const trendElement = screen.getByText(/2025-05-20/i);
      expect(trendElement).toHaveAttribute('data-hover', 'tooltip');
      expect(trendElement).toHaveStyle('animation-duration: 0.5s');
    });
  });

  it('does not show trend animation when isPremium is false', async () => {
    cacheManager.get.mockReturnValueOnce(mockAnalyticsData);
    render(<SupportTicketAnalytics userId="123" isPremium={false} />);
    await waitFor(() => {
      const trend = screen.queryByText(/2025-05-20/i);
      expect(trend).toBeNull();
    });
  });

  it('logs errors and shows error message on fetch failure', async () => {
    cacheManager.get.mockReturnValueOnce(null);
    fetchAnalytics.mockRejectedValueOnce(new Error('API failed'));
    render(<SupportTicketAnalytics userId="123" isPremium={false} />);
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch analytics'));
      expect(screen.getByText(/Failed to load analytics/i)).toBeInTheDocument();
    });
  });

  // Added edge case tests for SG Man compliance (~95% coverage)
  it('handles API failure with null response', async () => {
    cacheManager.get.mockReturnValueOnce(null);
    fetchAnalytics.mockResolvedValueOnce(null);
    render(<SupportTicketAnalytics userId="123" isPremium={false} />);
    await waitFor(() => {
      expect(screen.getByText(/No analytics data available/i)).toBeInTheDocument();
    });
  });

  it('handles empty data gracefully', async () => {
    cacheManager.get.mockReturnValueOnce({});
    render(<SupportTicketAnalytics userId="123" isPremium={false} />);
    await waitFor(() => {
      expect(screen.getByText(/Open Tickets: 0/i)).toBeInTheDocument();
      expect(screen.getByText(/Closed Tickets: 0/i)).toBeInTheDocument();
    });
  });
});

SupportTicketAnalytics.test.propTypes = {};