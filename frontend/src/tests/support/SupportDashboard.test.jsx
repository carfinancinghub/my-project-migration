// File: SupportDashboard.test.jsx
// Path: frontend/src/tests/support/SupportDashboard.test.jsx
// Purpose: Unit tests for enhanced SupportDashboard with metrics, filters, and escalation AI
// Author: Cod1 (05111432 - PDT)
// 👑 Cod2 Crown Certified

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SupportDashboard from '@components/support/SupportDashboard';

jest.mock('@services/metrics/SupportAgentAnalytics', () => ({
  getAgentMetrics: jest.fn(() => Promise.resolve({ avgTime: '2h', escalationRate: 15 }))
}));

jest.mock('@services/ai/TicketClassifier', () => ({
  getEscalationSuggestion: jest.fn(() => Promise.resolve('Escalate to Arbitration'))
}));

jest.mock('@services/storage/SupportActionEngine', () => ({
  triggerSupportAction: jest.fn()
}));

describe('SupportDashboard', () => {
  const mockTickets = [
    { id: 't1', status: 'Open', description: 'Payment issue', priority: false },
    { id: 't2', status: 'Resolved', description: 'Delivery delay', priority: true }
  ];

  it('renders ticket list and filters work', () => {
    render(<SupportDashboard tickets={mockTickets} isPremium={false} />);
    expect(screen.getByText(/payment issue/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/resolved/i));
    expect(screen.getByText(/delivery delay/i)).toBeInTheDocument();
  });

  it('shows agent metrics if premium', async () => {
    render(<SupportDashboard tickets={mockTickets} isPremium={true} />);
    await waitFor(() => {
      expect(screen.getByText(/avg res time/i)).toBeInTheDocument();
    });
  });

  it('renders AI escalation suggestion if premium', async () => {
    render(<SupportDashboard tickets={mockTickets} isPremium={true} />);
    await waitFor(() => {
      expect(screen.getByText(/escalate to arbitration/i)).toBeInTheDocument();
    });
  });

  it('calls quick action handler when resolve is clicked', async () => {
    const { triggerSupportAction } = require('@services/storage/SupportActionEngine');
    render(<SupportDashboard tickets={mockTickets} isPremium={true} />);
    await waitFor(() => {
      fireEvent.click(screen.getAllByText(/resolve/i)[0]);
      expect(triggerSupportAction).toHaveBeenCalled();
    });
  });
});

/**
 * Functions Summary:
 * - renders ticket list with filters
 * - shows agent metrics and escalation suggestions for premium users
 * - calls quick actions like resolve/escalate on click
 * Dependencies: @services/metrics, @services/ai, @services/storage
 */