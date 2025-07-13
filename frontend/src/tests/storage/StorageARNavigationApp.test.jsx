// File: StorageARNavigationApp.test.jsx
// Path: frontend/src/tests/storage/StorageARNavigationApp.test.jsx
// Purpose: Unit tests for StorageARNavigationApp.jsx
// Author: Cod1 (05111402 - PDT)
// 👑 Cod2 Crown Certified

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StorageARNavigationApp from '@components/storage/StorageARNavigationApp';

jest.mock('@services/storage/ARMapEngine', () => ({
  fetchARNavigationMap: jest.fn(() =>
    Promise.resolve({ overlayCode: 'AR-12345' })
  )
}));

describe('StorageARNavigationApp', () => {
  it('renders AR map overlay on success', async () => {
    render(<StorageARNavigationApp />);
    await waitFor(() => {
      expect(screen.getByText(/AR Map Overlay/i)).toBeInTheDocument();
    });
  });

  it('renders error message on map load failure', async () => {
    const { fetchARNavigationMap } = require('@services/storage/ARMapEngine');
    fetchARNavigationMap.mockImplementationOnce(() =>
      Promise.reject(new Error('AR map failed'))
    );
    render(<StorageARNavigationApp />);
    await waitFor(() => {
      expect(screen.getByText(/Unable to load AR map/i)).toBeInTheDocument();
    });
  });
});

/**
 * Functions Summary:
 * - renders AR map overlay on success: Verifies correct AR data rendering.
 * - renders error message on map load failure: Ensures failure UI fallback is shown.
 * Dependencies: @services/storage/ARMapEngine, React Testing Library
 */