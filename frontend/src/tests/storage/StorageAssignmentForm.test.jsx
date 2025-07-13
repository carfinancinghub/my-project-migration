// File: StorageAssignmentForm.test.jsx
// Path: frontend/src/tests/storage/StorageAssignmentForm.test.jsx
// Purpose: Tests for StorageAssignmentForm component
// Author: Cod1 (05111402 - PDT)
// 👑 Cod2 Crown Certified

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import StorageAssignmentForm from '@components/storage/StorageAssignmentForm';

describe('StorageAssignmentForm', () => {
  const onSubmit = jest.fn();

  it('renders form fields and submit button', () => {
    render(<StorageAssignmentForm onSubmit={onSubmit} />);
    expect(screen.getByPlaceholderText(/Item ID/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Slot ID/i)).toBeInTheDocument();
    expect(screen.getByText(/Assign/i)).toBeInTheDocument();
  });

  it('submits form and shows success message', () => {
    render(<StorageAssignmentForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByPlaceholderText(/Item ID/i), { target: { value: 'item9' } });
    fireEvent.change(screen.getByPlaceholderText(/Slot ID/i), { target: { value: 'B3' } });
    fireEvent.click(screen.getByText(/Assign/i));
    expect(onSubmit).toHaveBeenCalledWith('item9', 'B3');
    expect(screen.getByText(/Assignment successful/i)).toBeInTheDocument();
  });

  it('handles submission failure and shows error', () => {
    const failingSubmit = () => {
      throw new Error('Submission failed');
    };
    render(<StorageAssignmentForm onSubmit={failingSubmit} />);
    fireEvent.change(screen.getByPlaceholderText(/Item ID/i), { target: { value: 'item9' } });
    fireEvent.change(screen.getByPlaceholderText(/Slot ID/i), { target: { value: 'B3' } });
    fireEvent.click(screen.getByText(/Assign/i));
    expect(screen.getByText(/Assignment failed/i)).toBeInTheDocument();
  });
});

/**
 * Functions Summary:
 * - renders form fields and submit button: Confirms UI presence.
 * - submits form and shows success message: Validates happy path.
 * - handles submission failure and shows error: Verifies error fallback on exception.
 * Dependencies: React Testing Library
 */