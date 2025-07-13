// 👑 Crown Certified Test — OfficerDashboard.test.jsx
// Path: frontend/src/tests/OfficerDashboard.test.jsx
// Purpose: Validates OfficerDashboard rendering, premium logic, error handling, and UI feedback.
// Author: Rivers Auction Team — May 16, 2025

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import OfficerDashboard from '@/components/OfficerDashboard';
import OfficerService from '@/services/officer/OfficerService';

jest.mock('@/services/officer/OfficerService');

describe('OfficerDashboard', () => {
  const mockMetrics = {
    activeAuctions: 14,
    openDisputes: 3,
    totalBids: 273,
  };

  const mockAlerts = [
    { id: 'alert001', message: '🚨 Suspicious bid activity on Auction #A91', severity: 'high' },
    { id: 'alert002', message: '⚠️ Multiple failed payment attempts by Buyer #X4', severity: 'medium' },
  ];

  beforeEach(() => {
    OfficerService.getPlatformMetrics.mockResolvedValue({ metrics: mockMetrics });
    OfficerService.getLiveAlerts.mockResolvedValue({ alerts: mockAlerts });
  });

  it('renders metrics on successful fetch (free)', async () => {
    render(<OfficerDashboard officerId="officer123" isPremium={false} />);
    expect(screen.getByText(/Loading metrics/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/active auctions/i)).toBeInTheDocument();
      expect(screen.queryByText(/Suspicious bid/i)).not.toBeInTheDocument();
    });
  });

  it('renders live alerts when isPremium is true', async () => {
    render(<OfficerDashboard officerId="officer123" isPremium={true} />);
    await waitFor(() => {
      expect(screen.getByText(/Suspicious bid activity/i)).toBeInTheDocument();
      expect(screen.getByText(/Multiple failed payment/i)).toBeInTheDocument();
    });
  });

  it('does not render alerts when isPremium is false', async () => {
    render(<OfficerDashboard officerId="officer123" isPremium={false} />);
    await waitFor(() => {
      expect(screen.queryByText(/🚨/)).not.toBeInTheDocument();
    });
  });

  it('handles metric fetch failure gracefully', async () => {
    OfficerService.getPlatformMetrics.mockRejectedValueOnce(new Error('Server error'));
    render(<OfficerDashboard officerId="broken" isPremium={false} />);
    await waitFor(() => {
      expect(screen.getByText(/Unable to load metrics/i)).toBeInTheDocument();
    });
  });

  it('handles alert fetch failure (premium)', async () => {
    OfficerService.getLiveAlerts.mockRejectedValueOnce(new Error('Alerts error'));
    render(<OfficerDashboard officerId="officer999" isPremium={true} />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to retrieve alerts/i)).toBeInTheDocument();
    });
  });

  it('renders loading state immediately', () => {
    render(<OfficerDashboard officerId="officer000" isPremium={true} />);
    expect(screen.getByText(/Loading metrics/i)).toBeInTheDocument();
    expect(screen.getByText(/Fetching live alerts/i)).toBeInTheDocument();
  });
});
