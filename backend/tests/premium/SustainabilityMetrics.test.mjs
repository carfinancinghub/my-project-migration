// File: SustainabilityMetrics.test.js
// Path: C:\CFH\backend\tests\premium\SustainabilityMetrics.test.js
// Purpose: Unit tests for SustainabilityMetrics component
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SustainabilityMetrics from '@components/premium/SustainabilityMetrics';
import { getSustainabilityMetrics } from '@services/api/sustainability';
import logger from '@utils/logger';

jest.mock('@services/api/sustainability');
jest.mock('@utils/logger');

describe('SustainabilityMetrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<SustainabilityMetrics userId="123" vehicleId="789" />);
    expect(screen.getByText(/loading sustainability metrics/i)).toBeInTheDocument();
  });

  it('renders sustainability metrics when data is available', async () => {
    const mockMetrics = {
      carbonFootprintTransport: 150,
      fuelEfficiency: 30,
      emissionRating: 8
    };
    getSustainabilityMetrics.mockResolvedValueOnce(mockMetrics);

    render(<SustainabilityMetrics userId="123" vehicleId="789" />);
    await waitFor(() => {
      expect(screen.getByText(/Carbon Footprint \(Transport\)/i)).toBeInTheDocument();
      expect(screen.getByText(/150 kg CO₂/i)).toBeInTheDocument();
      expect(screen.getByText(/Fuel Efficiency/i)).toBeInTheDocument();
      expect(screen.getByText(/30 MPG/i)).toBeInTheDocument();
      expect(screen.getByText(/Emission Rating/i)).toBeInTheDocument();
      expect(screen.getByText(/8\/10/i)).toBeInTheDocument();
    });
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Fetched sustainability metrics'));
  });

  it('renders error message on fetch failure', async () => {
    getSustainabilityMetrics.mockRejectedValueOnce(new Error('API error'));
    render(<SustainabilityMetrics userId="123" vehicleId="789" />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to load sustainability metrics/i)).toBeInTheDocument();
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch sustainability metrics'));
    });
  });

  it('renders no metrics message when data is unavailable', async () => {
    getSustainabilityMetrics.mockResolvedValueOnce(null);
    render(<SustainabilityMetrics userId="123" vehicleId="789" />);
    await waitFor(() => {
      expect(screen.getByText(/No sustainability metrics available/i)).toBeInTheDocument();
    });
  });

  it('requires userId and vehicleId props', () => {
    expect(SustainabilityMetrics.propTypes.userId).toBe(PropTypes.string.isRequired);
    expect(SustainabilityMetrics.propTypes.vehicleId).toBe(PropTypes.string.isRequired);
  });
});