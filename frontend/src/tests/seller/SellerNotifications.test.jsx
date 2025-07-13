// File: SellerNotifications.test.jsx
// Path: C:\CFH\frontend\src\tests\seller\SellerNotifications.test.jsx
// Purpose: Unit tests for SellerNotifications component
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SellerNotifications from '@components/seller/SellerNotifications';
import { getNotifications } from '@services/api/notifications';
import logger from '@utils/logger';

jest.mock('@services/api/notifications');
jest.mock('@utils/logger');

const mockNotifications = [
  { id: '1', message: 'New bid on your auction!', date: '2025-05-24 09:00', type: 'Bid' },
  { id: '2', message: 'Auction ended', date: '2025-05-24 10:00', type: 'Auction' }
];

describe('SellerNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<SellerNotifications sellerId="123" />);
    expect(screen.getByText(/loading notifications/i)).toBeInTheDocument();
  });

  it('renders notifications when data is available', async () => {
    getNotifications.mockResolvedValueOnce(mockNotifications);
    render(<SellerNotifications sellerId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/New bid on your auction!/i)).toBeInTheDocument();
      expect(screen.getByText(/Auction ended/i)).toBeInTheDocument();
      expect(screen.getByText(/Type: Bid/i)).toBeInTheDocument();
    });
  });

  it('renders no notifications message when data is empty', async () => {
    getNotifications.mockResolvedValueOnce([]);
    render(<SellerNotifications sellerId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/No notifications available/i)).toBeInTheDocument();
    });
  });

  it('logs errors and shows error message on fetch failure', async () => {
    getNotifications.mockRejectedValueOnce(new Error('API failed'));
    render(<SellerNotifications sellerId="123" />);
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch notifications'));
      expect(screen.getByText(/Failed to load notifications/i)).toBeInTheDocument();
    });
  });

  it('handles null response gracefully', async () => {
    getNotifications.mockResolvedValueOnce(null);
    render(<SellerNotifications sellerId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/No notifications available/i)).toBeInTheDocument();
    });
  });
});

SellerNotifications.test.propTypes = {};