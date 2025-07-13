// File: SellerInventoryList.test.jsx
// Path: C:\CFH\frontend\src\tests\seller\SellerInventoryList.test.jsx
// Purpose: Unit tests for SellerInventoryList component
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SellerInventoryList from '@components/seller/SellerInventoryList';
import { getInventory } from '@services/api/inventory';
import logger from '@utils/logger';

jest.mock('@services/api/inventory');
jest.mock('@utils/logger');

const mockInventory = [
  { id: '1', vehicleName: 'Toyota Camry', vin: '123VIN456', year: 2020, isListed: true, reservePrice: 15000 },
  { id: '2', vehicleName: 'Honda Civic', vin: '789VIN012', year: 2019, isListed: false, reservePrice: 12000 }
];

describe('SellerInventoryList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<SellerInventoryList sellerId="123" />);
    expect(screen.getByText(/loading inventory/i)).toBeInTheDocument();
  });

  it('renders inventory list when data is available', async () => {
    getInventory.mockResolvedValueOnce(mockInventory);
    render(<SellerInventoryList sellerId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/Toyota Camry/i)).toBeInTheDocument();
      expect(screen.getByText(/Honda Civic/i)).toBeInTheDocument();
      expect(screen.getByText(/VIN: 123VIN456/i)).toBeInTheDocument();
      expect(screen.getByText(/Listed: Yes/i)).toBeInTheDocument();
      expect(screen.getByText(/Reserve Price: \$15000/i)).toBeInTheDocument();
    });
  });

  it('renders no inventory message when data is empty', async () => {
    getInventory.mockResolvedValueOnce([]);
    render(<SellerInventoryList sellerId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/No inventory available/i)).toBeInTheDocument();
    });
  });

  it('logs errors and shows error message on fetch failure', async () => {
    getInventory.mockRejectedValueOnce(new Error('API failed'));
    render(<SellerInventoryList sellerId="123" />);
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch inventory'));
      expect(screen.getByText(/Failed to load inventory/i)).toBeInTheDocument();
    });
  });

  it('handles null response gracefully', async () => {
    getInventory.mockResolvedValueOnce(null);
    render(<SellerInventoryList sellerId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/No inventory available/i)).toBeInTheDocument();
    });
  });
});

SellerInventoryList.test.propTypes = {};