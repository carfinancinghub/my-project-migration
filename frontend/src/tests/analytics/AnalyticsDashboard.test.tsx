/**
 * @file AnalyticsDashboard.test.tsx
 * @path C:\CFH\frontend\src\tests\analytics\AnalyticsDashboard.test.tsx
 * @author Cod1 Team
 * @created 2025-06-11 [1810]
 * @purpose Tests the AnalyticsDashboard component for rendering and data loading.
 * @user_impact Ensures the dashboard displays data correctly.
 * @version 1.0.0
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AnalyticsDashboard } from '../../components/analytics/AnalyticsDashboard';
jest.mock('../../services/analyticsApi', () => ({
  fetchAnalytics: jest.fn(() => Promise.resolve([{ name: 'A', value: 1 }])),
}));

describe('AnalyticsDashboard', () => {
  it('renders and loads data', async () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByText(/Loading.../)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/Data Table/)).toBeInTheDocument());
  });
});
