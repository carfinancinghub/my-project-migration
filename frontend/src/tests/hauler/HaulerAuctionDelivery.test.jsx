// File: HaulerAuctionDelivery.test.jsx
// Path: frontend/src/tests/hauler/HaulerAuctionDelivery.test.jsx
// Purpose: Unit tests for HaulerAuctionDelivery component
// Author: Cod1 (05111358 - PDT)
// 👑 Cod2 Crown Certified

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HaulerAuctionDelivery from '@components/hauler/HaulerAuctionDelivery';

jest.mock('@services/route/RouteOptimizer', () => ({
  optimizeRoute: jest.fn(() => Promise.resolve('Route A > B > C'))
}));

jest.mock('@services/blockchain/BlockchainVerifier', () => ({
  verifyProofOfDelivery: jest.fn(() => Promise.resolve(true))
}));

describe('HaulerAuctionDelivery', () => {
  const deliveries = [
    { id: 'd1', item: 'Car 1', pickup: 'LA', dropoff: 'SF', date: '2025-05-12' }
  ];

  it('renders delivery list', () => {
    render(<HaulerAuctionDelivery deliveries={deliveries} />);
    expect(screen.getByText(/Car 1/)).toBeInTheDocument();
  });

  it('submits POD and updates status', () => {
    render(<HaulerAuctionDelivery deliveries={deliveries} />);
    fireEvent.click(screen.getByText(/Submit POD/i));
    expect(screen.getByText(/Status: POD Submitted/i)).toBeInTheDocument();
  });

  it('displays optimized route on success', async () => {
    render(<HaulerAuctionDelivery deliveries={deliveries} />);
    fireEvent.click(screen.getByText(/Optimize Route/i));
    await waitFor(() => {
      expect(screen.getByText(/Optimized Route/i)).toBeInTheDocument();
    });
  });

  it('verifies POD on blockchain', async () => {
    render(<HaulerAuctionDelivery deliveries={deliveries} />);
    fireEvent.click(screen.getByText(/Verify on Blockchain/i));
    await waitFor(() => {
      expect(screen.getByText(/Status: Verified/i)).toBeInTheDocument();
    });
  });

  it('handles route optimization failure', async () => {
    const { optimizeRoute } = require('@services/route/RouteOptimizer');
    optimizeRoute.mockImplementationOnce(() => Promise.reject(new Error('Route Fail')));
    render(<HaulerAuctionDelivery deliveries={deliveries} />);
    fireEvent.click(screen.getByText(/Optimize Route/i));
    await waitFor(() => {
      expect(screen.getByText(/Failed to optimize route/i)).toBeInTheDocument();
    });
  });

  it('handles blockchain verification failure', async () => {
    const { verifyProofOfDelivery } = require('@services/blockchain/BlockchainVerifier');
    verifyProofOfDelivery.mockImplementationOnce(() => Promise.reject(new Error('POD Fail')));
    render(<HaulerAuctionDelivery deliveries={deliveries} />);
    fireEvent.click(screen.getByText(/Verify on Blockchain/i));
    await waitFor(() => {
      expect(screen.getByText(/Blockchain verification failed/i)).toBeInTheDocument();
    });
  });
});

/**
 * Functions Summary:
 * - renders delivery list: Validates delivery items render.
 * - submits POD and updates status: Tests free POD update.
 * - displays optimized route on success: Tests route optimization (paid).
 * - verifies POD on blockchain: Tests blockchain verification (paid).
 * - handles route optimization failure: Tests error fallback route.
 * - handles blockchain verification failure: Tests error fallback blockchain.
 * Dependencies: RouteOptimizer, BlockchainVerifier, React Testing Library
 */