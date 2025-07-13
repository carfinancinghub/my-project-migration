/**
 * © 2025 CFH, All Rights Reserved.
 * Purpose: Test PointsHistory.jsx for rendering, data fetching, export, accessibility, and multi-language support.
 * Author: CFH Dev Team
 * Date: 061825 [1655]
 * Save Location: C:\CFH\frontend\src\tests\user\PointsHistory.test.jsx
 */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import PointsHistory from '@components/user/PointsHistory';
import { analyticsApi } from '@services/analyticsApi';
import { useAuth } from '@utils/UserAuth';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('@services/analyticsApi');
jest.mock('@utils/UserAuth');

describe('PointsHistory', () => {
  const mockUserId = '123';
  const mockAuthToken = 'token';
  const mockPointsData = [
    { date: '2025-06-17', action: 'Bid', points: 100 },
    { date: '2025-06-16', action: 'Purchase', points: 200 },
  ];

  beforeEach(() => {
    useAuth.mockReturnValue({ authToken: mockAuthToken });
    analyticsApi.getPointsHistory.mockResolvedValue({ data: mockPointsData });
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
    const mockLink = { click: jest.fn(), href: '', download: '' };
    document.createElement = jest.fn().mockReturnValue(mockLink);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <PointsHistory userId={mockUserId} />
      </I18nextProvider>
    );
    expect(screen.getByText(i18n.t('pointsHistory.loading'))).toBeInTheDocument();
  });

  test('renders points table and chart after data fetch', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <PointsHistory userId={mockUserId} />
      </I18nextProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('2025-06-17')).toBeInTheDocument();
      expect(screen.getByText('Bid')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByLabelText(i18n.t('pointsHistory.chartLabel'))).toBeInTheDocument();
    });
  });

  test('handles export button click', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <PointsHistory userId={mockUserId} />
      </I18nextProvider>
    );
    await waitFor(() => {
      const exportButton = screen.getByText(i18n.t('pointsHistory.exportButton'));
      fireEvent.click(exportButton);
      expect(document.createElement).toHaveBeenCalledWith('a');
    });
  });

  test('supports multi-language', async () => {
    i18n.changeLanguage('es');
    render(
      <I18nextProvider i18n={i18n}>
        <PointsHistory userId={mockUserId} />
      </I18nextProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(i18n.t('pointsHistory.title', { lng: 'es' }))).toBeInTheDocument();
    });
  });

  test('is accessible', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <PointsHistory userId={mockUserId} />
      </I18nextProvider>
    );
    await waitFor(() => {
      expect(screen.getByRole('region', { name: i18n.t('pointsHistory.title') })).toBeInTheDocument();
      expect(screen.getByLabelText(i18n.t('pointsHistory.tableLabel'))).toBeInTheDocument();
    });
  });
});