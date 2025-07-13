// File: SellerAuctionForm.test.jsx
// Path: C:\CFH\frontend\src\tests\seller\SellerAuctionForm.test.jsx
// Purpose: Unit tests for SellerAuctionForm component
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SellerAuctionForm from '@components/seller/SellerAuctionForm';
import { createAuction } from '@services/api/auction';
import logger from '@utils/logger';

jest.mock('@services/api/auction');
jest.mock('@utils/logger');

describe('SellerAuctionForm', () => {
  const mockProps = { sellerId: '123' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with all fields', () => {
    render(<SellerAuctionForm {...mockProps} />);
    expect(screen.getByLabelText(/Auction Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Vehicle Details/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Reserve Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument();
  });

  it('submits auction successfully', async () => {
    createAuction.mockResolvedValueOnce({});
    render(<SellerAuctionForm {...mockProps} />);
    fireEvent.change(screen.getByLabelText(/Auction Title/i), { target: { value: 'Test Auction' } });
    fireEvent.change(screen.getByLabelText(/Vehicle Details/i), { target: { value: 'Test Vehicle' } });
    fireEvent.change(screen.getByLabelText(/Reserve Price/i), { target: { value: '10000' } });
    fireEvent.change(screen.getByLabelText(/End Date/i), { target: { value: '2025-05-25' } });
    fireEvent.click(screen.getByText(/Create Auction/i));

    await waitFor(() => {
      expect(createAuction).toHaveBeenCalledWith({
        sellerId: '123',
        title: 'Test Auction',
        vehicleDetails: 'Test Vehicle',
        reservePrice: 10000,
        endDate: '2025-05-25'
      });
      expect(screen.getByText(/Auction created successfully/i)).toBeInTheDocument();
    });
  });

  it('logs errors and shows error message on submission failure', async () => {
    createAuction.mockRejectedValueOnce(new Error('API failed'));
    render(<SellerAuctionForm {...mockProps} />);
    fireEvent.change(screen.getByLabelText(/Auction Title/i), { target: { value: 'Test Auction' } });
    fireEvent.change(screen.getByLabelText(/Vehicle Details/i), { target: { value: 'Test Vehicle' } });
    fireEvent.change(screen.getByLabelText(/Reserve Price/i), { target: { value: '10000' } });
    fireEvent.change(screen.getByLabelText(/End Date/i), { target: { value: '2025-05-25' } });
    fireEvent.click(screen.getByText(/Create Auction/i));

    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to create auction'));
      expect(screen.getByText(/Failed to create auction/i)).toBeInTheDocument();
    });
  });

  it('disables inputs while loading', async () => {
    createAuction.mockImplementation(() => new Promise(() => {}));
    render(<SellerAuctionForm {...mockProps} />);
    fireEvent.change(screen.getByLabelText(/Auction Title/i), { target: { value: 'Test Auction' } });
    fireEvent.change(screen.getByLabelText(/Vehicle Details/i), { target: { value: 'Test Vehicle' } });
    fireEvent.change(screen.getByLabelText(/Reserve Price/i), { target: { value: '10000' } });
    fireEvent.change(screen.getByLabelText(/End Date/i), { target: { value: '2025-05-25' } });
    fireEvent.click(screen.getByText(/Create Auction/i));

    expect(screen.getByLabelText(/Auction Title/i)).toBeDisabled();
    expect(screen.getByText(/Creating.../i)).toBeInTheDocument();
  });

  it('requires all fields to submit', () => {
    render(<SellerAuctionForm {...mockProps} />);
    fireEvent.click(screen.getByText(/Create Auction/i));
    expect(createAuction).not.toHaveBeenCalled();
  });
});

SellerAuctionForm.test.propTypes = {};