// File: EscrowStatusSync.test.jsx
// Path: frontend/src/tests/EscrowStatusSync.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EscrowStatusSync from '@components/mechanic/EscrowStatusSync';
import { PremiumFeature } from '@components/common/PremiumFeature';

jest.mock('axios', () => ({ post: jest.fn(() => Promise.resolve({ data: { success: true } })) }));

test('renders Notify Escrow button and shows status', async () => {
  render(
    <PremiumFeature feature="mechanicEnterprise">
      <EscrowStatusSync />
    </PremiumFeature>
  );
  fireEvent.change(screen.getByPlaceholderText(/Vehicle ID/i), { target: { value: 'VH-4567' }});
  fireEvent.click(screen.getByText(/Notify Escrow/i));
  expect(await screen.findByText(/Notification Sent/i)).toBeInTheDocument();
});
