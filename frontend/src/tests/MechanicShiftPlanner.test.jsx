// File: MechanicShiftPlanner.test.jsx
// Path: frontend/src/tests/MechanicShiftPlanner.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import MechanicShiftPlanner from '@components/mechanic/MechanicShiftPlanner';

test('renders shift planner with tasks', () => {
  render(<MechanicShiftPlanner />);
  expect(screen.getByText(/Shift Planner/i)).toBeInTheDocument();
  expect(screen.getByText(/Task for/i)).toBeInTheDocument();
});
