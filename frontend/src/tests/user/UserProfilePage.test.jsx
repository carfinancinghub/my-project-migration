/**
 * Author: G Echo System Team
 * Date: 061825 [1643]
 * Purpose: Test UserProfilePage.jsx for rendering, data fetching, edit/save/cancel, accessibility, and multi-language support.
 * Save Location: C:\CFH\frontend\src\tests\user\UserProfilePage.test.jsx
 * Batch ID: UserProfile-061725
 */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import UserProfilePage from '@components/user/UserProfilePage';
import { analyticsApi } from '@services/analyticsApi';
import { useAuth } from '@utils/UserAuth';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('@services/analyticsApi');
jest.mock('@utils/UserAuth');
jest.mock('@components/user/PointsHistory', () => () => <div data-testid="points-history">PointsHistory Mock</div>);

describe('UserProfilePage', () => {
  const mockUserId = '123';
  const mockAuthToken = 'mock-token';
  const mockUserData = {
    username: 'testuser',
    email: 'test@example.com',
    subscription: {
      plan: 'premium',
      payments: [{ date: '2025-06-01', amount: '$100', status: 'paid' }],
    },
  };

  beforeEach(() => {
    useAuth.mockReturnValue({ authToken: mockAuthToken });
    analyticsApi.getUserProfile.mockResolvedValue({ data: mockUserData });
    analyticsApi.updateUserProfile.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <UserProfilePage userId={mockUserId} />
      </I18nextProvider>
    );
    expect(screen.getByText(i18n.t('userProfile.loading'))).toBeInTheDocument();
  });

  test('renders user profile and subscription table', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <UserProfilePage userId={mockUserId} />
      </I18nextProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('premium')).toBeInTheDocument();
      expect(screen.getByText('paid')).toBeInTheDocument();
      expect(screen.getByTestId('points-history')).toBeInTheDocument();
    });
  });

  test('allows editing and saving user profile', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <UserProfilePage userId={mockUserId} />
      </I18nextProvider>
    );
    await waitFor(() => {
      fireEvent.click(screen.getByText(i18n.t('userProfile.edit')));
      const usernameInput = screen.getByLabelText(i18n.t('userProfile.username'));
      fireEvent.change(usernameInput, { target: { value: 'newname' } });
      fireEvent.click(screen.getByLabelText(i18n.t('userProfile.save')));
      expect(analyticsApi.updateUserProfile).toHaveBeenCalledWith(mockUserId, expect.objectContaining({ username: 'newname' }), mockAuthToken);
    });
  });

  test('supports multi-language', async () => {
    i18n.changeLanguage('es');
    render(
      <I18nextProvider i18n={i18n}>
        <UserProfilePage userId={mockUserId} />
      </I18nextProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(i18n.t('userProfile.title', { lng: 'es' }))).toBeInTheDocument();
    });
  });

  test('is accessible', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <UserProfilePage userId={mockUserId} />
      </I18nextProvider>
    );
    await waitFor(() => {
      expect(screen.getByRole('region', { name: i18n.t('userProfile.title') })).toBeInTheDocument();
      expect(screen.getByLabelText(i18n.t('userProfile.paymentTable'))).toBeInTheDocument();
    });
  });
});