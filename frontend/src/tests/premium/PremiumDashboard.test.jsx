// File: PremiumDashboard.test.jsx
// Path: C:\CFH\frontend\src\tests\premium\PremiumDashboard.test.jsx
// Purpose: Unit tests for PremiumDashboard component
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PremiumDashboard from '@components/premium/PremiumDashboard';
import { getPremiumFeatures } from '@services/api/premium';
import logger from '@utils/logger';

jest.mock('@services/api/premium');
jest.mock('@utils/logger');

describe('PremiumDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<PremiumDashboard userId="123" />);
    expect(screen.getByText(/loading premium dashboard/i)).toBeInTheDocument();
  });

  it('renders premium features when data is available', async () => {
    const mockFeatures = [
      { name: 'AR Vehicle View', description: 'View vehicles in AR', link: '/ar-view' },
      { name: 'AI Auction Simulator', description: 'Simulate auction outcomes', link: '/ai-simulator' }
    ];
    getPremiumFeatures.mockResolvedValueOnce(mockFeatures);

    render(<PremiumDashboard userId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/Your Premium Dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/AR Vehicle View/i)).toBeInTheDocument();
      expect(screen.getByText(/AI Auction Simulator/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Access Now/i)).toHaveLength(2);
    });
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Fetched premium features'));
  });

  it('renders no features message when none are available', async () => {
    getPremiumFeatures.mockResolvedValueOnce([]);
    render(<PremiumDashboard userId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/No premium features available/i)).toBeInTheDocument();
    });
  });

  it('renders error message on fetch failure', async () => {
    getPremiumFeatures.mockRejectedValueOnce(new Error('API error'));
    render(<PremiumDashboard userId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to load premium features/i)).toBeInTheDocument();
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch premium features'));
    });
  });

  it('requires userId prop', () => {
    expect(PremiumDashboard.propTypes.userId).toBe(PropTypes.string.isRequired);
  });
});