// File: RouteRiskAnalysis.test.jsx
// Path: frontend/src/tests/RouteRiskAnalysis.test.jsx
// Author: Cod3 (05051024)

import React from 'react';
import { render, screen } from '@testing-library/react';
import RouteRiskAnalysis from '@components/hauler/RouteRiskAnalysis';

test('renders route risk panel with mocked data', () => {
  render(<RouteRiskAnalysis embedded />);
  expect(screen.getByText(/Route Risk Panel/i)).toBeInTheDocument();
});