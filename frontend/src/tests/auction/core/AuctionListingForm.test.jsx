// File: AuctionListingForm.test.jsx
// Path: frontend/src/tests/auction/core/AuctionListingForm.test.jsx
// Purpose: Test suite for AuctionListingForm premium features (AI, template, scheduling)
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuctionListingForm from '@/components/auction/core/AuctionListingForm';

jest.mock('@services/auction/AIBidStarter', () => ({
  suggestStartingBid: jest.fn(() => 5500),
}));

jest.mock('@services/auction/AuctionTemplateEngine', () => ({
  saveTemplate: jest.fn(() => 'template-xyz'),
  getTemplate: jest.fn(() => ({ description: 'Mock', tags: [], images: [] })),
}));

describe('AuctionListingForm - Premium Feature Tests', () => {
  const mockVehicle = {
    make: 'Tesla',
    model: 'Model 3',
    year: 2022,
    mileage: 10000,
  };

  it('renders AI suggestion for premium users', async () => {
    render(<AuctionListingForm vehicle={mockVehicle} isPremium={true} />);
    expect(await screen.findByDisplayValue('5500')).toBeInTheDocument();
  });

  it('shows locked message for AI suggestion for non-premium users', () => {
    render(<AuctionListingForm vehicle={mockVehicle} isPremium={false} />);
    expect(screen.getByText(/upgrade to unlock AI suggestions/i)).toBeInTheDocument();
  });

  it('enables template save for premium users', () => {
    render(<AuctionListingForm vehicle={mockVehicle} isPremium={true} />);
    const btn = screen.getByText('Save as Template');
    expect(btn).not.toBeDisabled();
  });

  it('disables template save for non-premium users', () => {
    render(<AuctionListingForm vehicle={mockVehicle} isPremium={false} />);
    const btn = screen.getByText('Save as Template');
    expect(btn).toBeDisabled();
  });

  it('shows scheduling field and restricts it based on isPremium', () => {
    render(<AuctionListingForm vehicle={mockVehicle} isPremium={false} />);
    const input = screen.getByLabelText(/Schedule Listing/i);
    expect(input).toBeDisabled();
    expect(screen.getByText(/upgrade to enable scheduling/i)).toBeInTheDocument();
  });
});

/*
Functions Summary:
- Tests AI bid suggestion rendering and gating
- Verifies template save button enabled/disabled by premium flag
- Checks schedule listing input accessibility based on premium status
- Dependencies: React, jest, @services/auction/AIBidStarter, AuctionTemplateEngine, @testing-library/react
*/
