// File: StorageInventoryTracker.test.jsx
// Path: frontend/src/tests/storage/StorageInventoryTracker.test.jsx
// Purpose: Unit tests for StorageInventoryTracker.jsx
// Author: Cod1 (05111414 - PDT)
// 👑 Cod2 Crown Certified

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StorageInventoryTracker from '@components/storage/StorageInventoryTracker';

jest.mock('@services/storage/StorageOptimizer', () => ({
  getOptimizedStorageLayout: jest.fn(() =>
    Promise.resolve({ summary: 'Optimized layout A1 -> B2 -> C3' })
  )
}));

describe('StorageInventoryTracker', () => {
  const items = [
    { id: 'item1', name: 'Car Part', slot: 1 },
    { id: 'item2', name: 'Engine', slot: 2 }
  ];

  it('renders stored items', () => {
    render(<StorageInventoryTracker initialItems={items} />);
    expect(screen.getByText(/Car Part/i)).toBeInTheDocument();
    expect(screen.getByText(/Slot 2/i)).toBeInTheDocument();
  });

  it('shows optimized layout on success', async () => {
    render(<StorageInventoryTracker initialItems={items} />);
    await waitFor(() => {
      expect(screen.getByText(/Optimized layout/i)).toBeInTheDocument();
    });
  });

  it('displays error message on layout failure', async () => {
    const { getOptimizedStorageLayout } = require('@services/storage/StorageOptimizer');
    getOptimizedStorageLayout.mockImplementationOnce(() =>
      Promise.reject(new Error('Optimization failed'))
    );
    render(<StorageInventoryTracker initialItems={items} />);
    await waitFor(() => {
      expect(screen.getByText(/Optimization failed/i)).toBeInTheDocument();
    });
  });
});

/**
 * Functions Summary:
 * - renders stored items: Validates basic rendering of items and slots.
 * - shows optimized layout on success: Confirms optimization success path.
 * - displays error message on layout failure: Handles mock rejection path.
 * Dependencies: @services/storage/StorageOptimizer, React Testing Library
 */