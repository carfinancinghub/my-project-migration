/**
 * © 2025 CFH, All Rights Reserved
 * File: AIRecommendations.test.tsx
 * Path: frontend/src/components/__tests__/AIRecommendations.test.tsx
 * Purpose: Jest/RTL test for AIRecommendations component, covering fetch, render, and error states.
 * Author: CFH Dev Team, Cod1
 * Date: 2025-07-17 [1124]
 * Version: 1.0.0
 * Crown Certified: Yes (pending)
 * Related To: frontend/src/components/AIRecommendations.tsx
 */

import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AIRecommendations from '../AIRecommendations';

jest.mock('axios', () => ({
  get: jest.fn(),
}));
import axios from 'axios';

const mockRecs = [
  {
    _id: 'rec1',
    title: 'Best Value',
    description: 'This vehicle offers the highest value per dollar.',
    confidence: 95,
  },
  {
    _id: 'rec2',
    title: 'Low Mileage',
    description: 'One of the lowest mileage cars in its segment.',
    confidence: 90,
  },
];

describe('AIRecommendations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders recommendations returned from API', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockRecs });
    render(<AIRecommendations />);
    await waitFor(() => expect(screen.getByText(/Best Value/)).toBeInTheDocument());
    expect(screen.getByText(/Low Mileage/)).toBeInTheDocument();
    expect(screen.getByText('Confidence: 95%')).toBeInTheDocument();
    expect(screen.getByText('Confidence: 90%')).toBeInTheDocument();
  });

  it('renders nothing if API returns empty array', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: [] });
    render(<AIRecommendations />);
    await waitFor(() => {
      expect(screen.queryByText(/Confidence:/)).not.toBeInTheDocument();
    });
  });

  it('logs error if fetch fails', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
    render(<AIRecommendations />);
    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith('Failed to fetch recommendations:', expect.any(Error));
    });
    spy.mockRestore();
  });
});
