// File: SupportTicketForm.test.jsx
// Path: frontend/src/tests/support/SupportTicketForm.test.jsx
// Purpose: Test support form behavior, file upload gating, and live chat display
// Author: Cod1 - Rivers Auction QA
// Date: May 14, 2025
// 👑 Cod1 Crown Certified

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import SupportTicketForm from '@components/support/SupportTicketForm';

jest.mock('axios');

describe('SupportTicketForm Component', () => {
  it('submits ticket as free user', async () => {
    axios.post.mockResolvedValueOnce({});

    render(<SupportTicketForm userId="user123" isPremium={false} />);
    fireEvent.change(screen.getByLabelText(/Subject/), {
      target: { value: 'Test subject' },
    });
    fireEvent.change(screen.getByLabelText(/Description/), {
      target: { value: 'Help me!' },
    });
    fireEvent.click(screen.getByText(/Submit/));

    await waitFor(() =>
      expect(screen.getByText(/Ticket submitted successfully/)).toBeInTheDocument()
    );
  });

  it('shows error on failed submit', async () => {
    axios.post.mockRejectedValueOnce(new Error('Server error'));

    render(<SupportTicketForm userId="fail" isPremium />);
    fireEvent.change(screen.getByLabelText(/Subject/), {
      target: { value: 'Error ticket' },
    });
    fireEvent.change(screen.getByLabelText(/Description/), {
      target: { value: 'Something went wrong' },
    });
    fireEvent.click(screen.getByText(/Submit/));

    await waitFor(() =>
      expect(screen.getByText(/Submission failed/)).toBeInTheDocument()
    );
  });

  it('renders file upload and live chat for premium', () => {
    render(<SupportTicketForm userId="userPremium" isPremium />);
    expect(screen.getByText(/Attachments/)).toBeInTheDocument();
    expect(screen.getByText(/Submit/)).toBeInTheDocument();
  });
});
