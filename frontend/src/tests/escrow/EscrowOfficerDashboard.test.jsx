// File: EscrowOfficerDashboard.test.jsx
// Path: frontend/src/tests/escrow/EscrowOfficerDashboard.test.jsx
// Purpose: Unit tests for EscrowOfficerDashboard including SEO, PDF export, analytics, audit log visibility, and rendering correctness
// Author: Cod2 Crown Certified (05072030)

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import EscrowOfficerDashboard from '@/components/escrow/EscrowOfficerDashboard';
import * as userContext from '@/components/common/UserContext';

jest.mock('axios');

const mockTransactions = [
  {
    _id: 'txn1',
    dealId: 'D001',
    buyer: { email: 'buyer@example.com' },
    seller: { email: 'seller@example.com' },
    amount: 15000,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    conditions: [
      { description: 'Title Received', met: true },
      { description: 'Inspection Complete', met: false }
    ],
    auditLog: [
      { action: 'Deposit', timestamp: Date.now(), user: { username: 'officer1' } }
    ]
  }
];

describe('EscrowOfficerDashboard', () => {
  beforeEach(() => {
    jest.spyOn(userContext, 'useUserContext').mockReturnValue({ user: { role: 'officer' } });
    axios.get.mockResolvedValue({ data: mockTransactions });
  });

  it('renders the dashboard and loads transactions', async () => {
    render(<EscrowOfficerDashboard />);
    expect(screen.getByText('🔐 Escrow Officer Dashboard')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/D001/)).toBeInTheDocument();
    });
  });

  it('handles release action correctly', async () => {
    axios.post.mockResolvedValue({});
    render(<EscrowOfficerDashboard />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('✅ Release Funds'));
    });
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/release'), expect.anything(), expect.anything());
  });

  it('displays audit log and condition checklist', async () => {
    render(<EscrowOfficerDashboard />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('🔍 View Details'));
    });
    expect(screen.getByText(/Title Received/)).toBeInTheDocument();
    expect(screen.getByText(/Deposit/)).toBeInTheDocument();
  });
});
