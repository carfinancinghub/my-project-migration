// File: SupportTicketForm.test.jsx
// Path: frontend/src/tests/support/SupportTicketForm.test.jsx
// Purpose: Unit tests for SupportTicketForm.jsx covering both free and premium support flows
// Author: Rivers Auction Team
// Date: May 14, 2025
// Editor: Cod1 (05142047 - PDT) — Added full coverage tests for premium and free ticket flows
// 👑 Cod2 Crown Certified

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SupportTicketForm from '@components/support/SupportTicketForm';

jest.mock('@services/ai/TicketClassifier', () => ({
  suggestCategory: jest.fn(() => Promise.resolve('Logistics')),
}));

jest.mock('@services/common/FileUploader', () => ({
  uploadFile: jest.fn(() => Promise.resolve('mockFileId123')),
}));

jest.mock('@services/loyalty/LoyaltyBoostEngine', () => ({
  checkLoyaltyBoost: jest.fn(() => true),
}));

describe('SupportTicketForm (Free)', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    render(<SupportTicketForm isPremium={false} userId="user123" onSubmit={mockOnSubmit} />);
  });

  it('renders basic ticket fields', () => {
    expect(screen.getByPlaceholderText('Subject')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Describe your issue...')).toBeInTheDocument();
    expect(screen.getByText('Submit Ticket')).toBeInTheDocument();
  });

  it('shows upgrade message for premium-only features', () => {
    expect(screen.getByText(/Premium support, upgrade to unlock/i)).toBeInTheDocument();
  });

  it('submits ticket with subject and description', () => {
    fireEvent.change(screen.getByPlaceholderText('Subject'), { target: { value: 'Help needed' } });
    fireEvent.change(screen.getByPlaceholderText('Describe your issue...'), {
      target: { value: 'Having a problem with delivery' },
    });
    fireEvent.click(screen.getByText('Submit Ticket'));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      userId: 'user123',
      subject: 'Help needed',
      description: 'Having a problem with delivery',
      fileId: null,
      priorityBoost: false,
      category: null,
    });
  });
});

describe('SupportTicketForm (Premium)', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    render(<SupportTicketForm isPremium={true} userId="user789" onSubmit={mockOnSubmit} />);
  });

  it('renders category selector and loyalty boost', async () => {
    await waitFor(() => {
      expect(screen.getByDisplayValue('Logistics')).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/Priority Boost/i)).toBeInTheDocument();
  });

  it('handles file upload and ticket submission', async () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/Attach File/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.change(screen.getByPlaceholderText('Subject'), { target: { value: 'Billing Issue' } });
    fireEvent.change(screen.getByPlaceholderText('Describe your issue...'), {
      target: { value: 'Wrong amount charged' },
    });
    fireEvent.click(screen.getByLabelText(/Priority Boost/i));
    fireEvent.click(screen.getByText('Submit Ticket'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        userId: 'user789',
        subject: 'Billing Issue',
        description: 'Wrong amount charged',
        fileId: 'mockFileId123',
        priorityBoost: true,
        category: 'Logistics',
      });
    });
  });
});

/**
 * Functions Summary:
 * - renders basic ticket fields: Ensures free fields appear for all users.
 * - shows upgrade message: Displays locked UI for free users.
 * - submits ticket: Mocks basic ticket submission success path.
 * - renders category and boost: Validates premium-only features show up.
 * - handles file upload and submission: Mocks end-to-end premium submission flow.
 * Dependencies: @services/ai/TicketClassifier, @services/common/FileUploader, @services/loyalty/LoyaltyBoostEngine, React Testing Library
 */