// 👑 Crown Certified Test — StorageInventoryTracker.test.jsx
// Path: frontend/src/tests/storage/StorageInventoryTracker.test.jsx
// Author: Rivers Auction Team — Restored May 19, 2025

import React from 'react';
import { render, screen } from '@testing-library/react';
import StorageInventoryTracker from '@components/storage/StorageInventoryTracker';

describe('StorageInventoryTracker', () => {
  const mockProps = {
    items: [
      { id: 'item1', name: 'Tire Rack', status: 'stored', quantity: 10 },
      { id: 'item2', name: 'Lift Crate', status: 'in-transit', quantity: 4 }
    ],
    userRole: 'officer',
    isPremium: true,
  };

  it('renders inventory item names', () => {
    render(<StorageInventoryTracker {...mockProps} />);
    expect(screen.getByText(/Tire Rack/i)).toBeInTheDocument();
    expect(screen.getByText(/Lift Crate/i)).toBeInTheDocument();
  });

  it('displays correct quantity and status for each item', () => {
    render(<StorageInventoryTracker {...mockProps} />);
    expect(screen.getByText(/Quantity: 10/i)).toBeInTheDocument();
    expect(screen.getByText(/Status: stored/i)).toBeInTheDocument();
    expect(screen.getByText(/Quantity: 4/i)).toBeInTheDocument();
    expect(screen.getByText(/Status: in-transit/i)).toBeInTheDocument();
  });

  it('renders premium insights when isPremium is true', () => {
    render(<StorageInventoryTracker {...mockProps} />);
    expect(screen.getByText(/📊 Predictive Storage Flow/i)).toBeInTheDocument();
  });

  it('does not render premium features when isPremium is false', () => {
    render(<StorageInventoryTracker {...mockProps} isPremium={false} />);
    expect(screen.queryByText(/📊 Predictive Storage Flow/i)).toBeNull();
  });
});
