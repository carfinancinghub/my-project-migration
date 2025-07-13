// File: VehicleHealthTrendCharts.test.jsx
// Path: frontend/src/tests/VehicleHealthTrendCharts.test.jsx
// Author: Cod1 (05051135)
// Purpose: Unit test for vehicle health trend chart rendering

import React from 'react';
import { render, screen } from '@testing-library/react';
import VehicleHealthTrendCharts from '@components/mechanic/VehicleHealthTrendCharts';

describe('VehicleHealthTrendCharts', () => {
  it('renders trend chart title', () => {
    render(<VehicleHealthTrendCharts />);
    expect(screen.getByText(/Vehicle Health Trends/i)).toBeInTheDocument();
  });
});
