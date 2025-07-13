// File: AdminAuctionOverview.test.jsx
// Path: frontend/src/tests/admin/auction/AdminAuctionOverview.test.jsx
// Purpose: Tests for AdminAuctionOverview component verifying auction list, anomalies, and daemon
// Author: Cod1 (05111357 - PDT)
// 👑 Cod2 Crown Certified

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminAuctionOverview from '@components/admin/auction/AdminAuctionOverview';

const mockAuctions = [
  { id: '1', title: 'Auction A', bids: 10 },
  { id: '2', title: 'Auction B', bids: 25 }
];

jest.mock('@services/anomaly/AnomalyEngine', () => ({
  detectAuctionAnomaliesInRealTime: jest.fn(() =>
    Promise.resolve([{ message: 'Suspicious bid pattern detected.' }])
  )
}));

jest.mock('@services/disputes/DisputeDaemon', () => ({
  launchAutoDisputeResolutionDaemon: jest.fn(() =>
    Promise.resolve('Daemon started')
  )
}));

describe('AdminAuctionOverview', () => {
  it('renders auction list correctly', () => {
    render(<AdminAuctionOverview auctions={mockAuctions} />);
    expect(screen.getByText(/Auction A/i)).toBeInTheDocument();
    expect(screen.getByText(/Auction B/i)).toBeInTheDocument();
  });

  it('renders anomalies on successful detection', async () => {
    render(<AdminAuctionOverview auctions={mockAuctions} />);
    const detectBtn = screen.getByText(/Detect Anomalies/i);
    detectBtn.click();
    await waitFor(() => {
      expect(screen.getByText(/Suspicious bid pattern detected/i)).toBeInTheDocument();
    });
  });

  it('handles anomaly detection failure', async () => {
    const { detectAuctionAnomaliesInRealTime } = require('@services/anomaly/AnomalyEngine');
    detectAuctionAnomaliesInRealTime.mockImplementationOnce(() =>
      Promise.reject(new Error('Anomaly Detection Failed'))
    );
    render(<AdminAuctionOverview auctions={mockAuctions} />);
    screen.getByText(/Detect Anomalies/i).click();
    await waitFor(() => {
      expect(screen.getByText(/Failed to detect anomalies/i)).toBeInTheDocument();
    });
  });

  it('handles dispute daemon failure', async () => {
    const { launchAutoDisputeResolutionDaemon } = require('@services/disputes/DisputeDaemon');
    launchAutoDisputeResolutionDaemon.mockImplementationOnce(() =>
      Promise.reject(new Error('Daemon Launch Failed'))
    );
    render(<AdminAuctionOverview auctions={mockAuctions} />);
    screen.getByText(/Launch Dispute Daemon/i).click();
    await waitFor(() => {
      expect(screen.getByText(/Failed to launch dispute daemon/i)).toBeInTheDocument();
    });
  });
});

/**
 * Functions Summary:
 * - renders auction list correctly: Renders auction data via props.
 * - renders anomalies on successful detection: Mocks success of anomaly fetch.
 * - handles anomaly detection failure: Verifies fallback UI on error.
 * - handles dispute daemon failure: Verifies fallback UI on daemon launch failure.
 * Dependencies: React Testing Library, @services/anomaly/AnomalyEngine, @services/disputes/DisputeDaemon
 */