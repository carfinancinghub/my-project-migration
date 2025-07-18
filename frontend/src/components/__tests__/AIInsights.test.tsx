/**
 * © 2025 CFH, All Rights Reserved
 * File: AIInsights.test.tsx
 * Path: frontend/src/components/__tests__/AIInsights.test.tsx
 * Purpose: Jest/RTL test for AIInsights component, validating fetch logic, rendering, and error handling.
 * Author: CFH Dev Team, Cod1
 * Date: 2025-07-17 [1118]
 * Version: 1.0.0
 * Crown Certified: Yes (pending)
 * Related To: frontend/src/components/AIInsights.tsx
 */

import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AIInsights from '../AIInsights';

jest.mock('axios', () => ({
  get: jest.fn(),
}));
import axios from 'axios';

const mockInsights = [
  {
    _id: '1',
    title: 'Price Drop Detected',
    description: 'Your listing price is now $500 below market average.',
    confidence: 88,
  },
  {
    _id: '2',
    title: 'High Demand Alert',
    description: 'Similar vehicles have sold quickly in your area.',
    confidence: 92,
  },
];

describe('AIInsights', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders insights returned from API', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockInsights });
    render(<AIInsights />);
    await waitFor(() => expect(screen.getByText('Price Drop Detected')).toBeInTheDocument());
    expect(screen.getByText('High Demand Alert')).toBeInTheDocument();
    expect(screen.getByText('Confidence: 88%')).toBeInTheDocument();
    expect(screen.getByText('Confidence: 92%')).toBeInTheDocument();
  });

  it('renders no insights if API returns empty array', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: [] });
    render(<AIInsights />);
    await waitFor(() => expect(screen.queryByText(/Confidence:/i)).not.toBeInTheDocument());
  });

  it('logs error if fetch fails', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));
    render(<AIInsights />);
    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith('Failed to fetch insights:', expect.any(Error));
    });
    spy.mockRestore();
  });
});
