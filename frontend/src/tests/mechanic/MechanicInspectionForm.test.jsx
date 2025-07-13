// File: MechanicInspectionForm.test.jsx
// Path: frontend/src/tests/mechanic/MechanicInspectionForm.test.jsx
// Purpose: Unit tests for MechanicInspectionForm.jsx verifying inspection logic, gamification feedback, and form behavior
// Author: Rivers Auction Team
// Editor: Cod2 (05131343 - PDT)
// Edits: Created full test suite covering basic form logic, badge progress integration, and premium gating
// 👑 Cod2 Crown Certified

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MechanicInspectionForm from '@components/mechanic/MechanicInspectionForm';

jest.mock('@services/mechanic/InspectionSubmitter', () => ({
  submitInspectionReport: jest.fn(() => Promise.resolve({ success: true }))
}));

jest.mock('@services/gamification/MechanicBadgeEngine', () => ({
  updateBadgeProgress: jest.fn(() => Promise.resolve('Badge updated'))
}));

describe('MechanicInspectionForm', () => {
  const props = {
    userId: 'mech123',
    vehicleId: 'veh456',
    isPremium: true
  };

  it('renders the inspection form', () => {
    render(<MechanicInspectionForm {...props} />);
    expect(screen.getByLabelText(/Damage Notes/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit Inspection/i)).toBeInTheDocument();
  });

  it('submits inspection successfully', async () => {
    render(<MechanicInspectionForm {...props} />);
    fireEvent.change(screen.getByLabelText(/Damage Notes/i), {
      target: { value: 'Scratches on left fender' }
    });
    fireEvent.click(screen.getByText(/Submit Inspection/i));
    await waitFor(() => {
      expect(screen.getByText(/Inspection submitted successfully/i)).toBeInTheDocument();
    });
  });

  it('shows error if inspection submission fails', async () => {
    const { submitInspectionReport } = require('@services/mechanic/InspectionSubmitter');
    submitInspectionReport.mockImplementationOnce(() => Promise.reject(new Error('Server error')));
    render(<MechanicInspectionForm {...props} />);
    fireEvent.change(screen.getByLabelText(/Damage Notes/i), {
      target: { value: 'Cracked windshield' }
    });
    fireEvent.click(screen.getByText(/Submit Inspection/i));
    await waitFor(() => {
      expect(screen.getByText(/Failed to submit inspection/i)).toBeInTheDocument();
    });
  });

  it('displays gamified badge update for premium users', async () => {
    render(<MechanicInspectionForm {...props} />);
    fireEvent.change(screen.getByLabelText(/Damage Notes/i), {
      target: { value: 'Tire wear detected' }
    });
    fireEvent.click(screen.getByText(/Submit Inspection/i));
    await waitFor(() => {
      expect(screen.getByText(/Badge progress updated/i)).toBeInTheDocument();
    });
  });

  it('hides badge logic if not premium', async () => {
    render(<MechanicInspectionForm {...props} isPremium={false} />);
    fireEvent.change(screen.getByLabelText(/Damage Notes/i), {
      target: { value: 'Rear camera broken' }
    });
    fireEvent.click(screen.getByText(/Submit Inspection/i));
    await waitFor(() => {
      expect(screen.queryByText(/Badge progress updated/i)).not.toBeInTheDocument();
    });
  });
});

/**
 * Functions Summary:
 * - renders the inspection form: Ensures form UI renders with required fields.
 * - submits inspection successfully: Confirms success path when API works.
 * - shows error if inspection submission fails: Tests error scenario for API failure.
 * - displays gamified badge update for premium users: Tests badge integration when `isPremium` is true.
 * - hides badge logic if not premium: Ensures badge updates don’t trigger for basic users.
 * Dependencies: @services/mechanic/InspectionSubmitter, @services/gamification/MechanicBadgeEngine
 */