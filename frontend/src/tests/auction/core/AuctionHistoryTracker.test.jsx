// File: AuctionHistoryTracker.test.jsx
// Path: frontend/src/tests/auction/core/AuctionHistoryTracker.test.jsx
// Purpose: Tests AuctionHistoryTracker with premium and basic scenarios
// Author: Rivers Auction Team
// Date: May 14, 2025
// 👑 Cod2 Crown Certified

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuctionHistoryTracker from '@/components/auction/core/AuctionHistoryTracker';

jest.mock('@/components/common/HeatmapChart', () => () => <div data-testid="heatmap-chart">HeatmapChart</div>);
jest.mock('@/components/common/BlockchainSnapshotViewer', () => () => <div data-testid="blockchain-viewer">BlockchainSnapshotViewer</div>);
jest.mock('@/components/auction/SellerBadgePanel', () => () => <div data-testid="badge-panel">SellerBadgePanel</div>);

describe('AuctionHistoryTracker', () => {
  const mockHistory = [
    { auctionId: 'A101', status: 'closed', finalPrice: 12000 },
    { auctionId: 'A102', status: 'closed', finalPrice: 9500 },
  ];

  it('renders locked messages for basic users', () => {
    render(<AuctionHistoryTracker isPremium={false} auctionHistory={mockHistory} />);
    expect(screen.getByText(/Heatmap is a premium feature/)).toBeInTheDocument();
    expect(screen.getByText(/Blockchain snapshot is a premium feature/)).toBeInTheDocument();
    expect(screen.getByText(/Seller badges are a premium feature/)).toBeInTheDocument();
  });

  it('renders all premium components for premium users', () => {
    render(<AuctionHistoryTracker isPremium={true} auctionHistory={mockHistory} />);
    expect(screen.getByTestId('heatmap-chart')).toBeInTheDocument();
    expect(screen.getByTestId('blockchain-viewer')).toBeInTheDocument();
    expect(screen.getByTestId('badge-panel')).toBeInTheDocument();
  });

  it('renders auction history list', () => {
    render(<AuctionHistoryTracker isPremium={false} auctionHistory={mockHistory} />);
    expect(screen.getByText(/Auction ID: A101/)).toBeInTheDocument();
    expect(screen.getByText(/Final Price: 12000/)).toBeInTheDocument();
    expect(screen.getByText(/Auction ID: A102/)).toBeInTheDocument();
  });
});

/*
Functions Summary:
- Tests premium and non-premium rendering of auction insights (heatmap, blockchain, badges)
- Verifies bid history visibility and formatting
- Mocks all subcomponents for independent validation
- Dependencies: React, jest, @testing-library/react, premium UI mocks
*/
