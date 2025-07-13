// File: BuyerSearchPreferences.test.jsx
// Path: frontend/src/tests/BuyerSearchPreferences.test.jsx
// Author: Cod5 (05050000, May 5, 2025, 00:00 PDT)
// Purpose: Unit tests for BuyerSearchPreferences.jsx to ensure reliable preference form and premium features

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BuyerSearchPreferences from '@components/buyer/BuyerSearchPreferences';
import { saveSearchPreferences, fetchAISearchSuggestions, subscribeToSearchAlerts } from '@utils/searchUtils';
import { toast } from 'react-toastify';

// Mock utilities
jest.mock('@utils/searchUtils', () => ({
  saveSearchPreferences: jest.fn(),
  fetchAISearchSuggestions: jest.fn(),
  subscribeToSearchAlerts: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe('BuyerSearchPreferences', () => {
  const mockPreferences = {
    make: 'Toyota',
    model: 'Camry',
    priceRange: [10000, 20000],
    year: 2020,
  };
  const mockAISuggestions = [
    { make: 'Toyota', model: 'Corolla', reason: 'High reliability' },
    { make: 'Honda', model: 'Civic', reason: 'Fuel efficiency' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (saveSearchPreferences as jest.Mock).mockResolvedValue(undefined);
    (fetchAISearchSuggestions as jest.Mock).mockResolvedValue(mockAISuggestions);
    (subscribeToSearchAlerts as jest.Mock).mockReturnValue(jest.fn());
  });

  it('renders preference form and updates inputs', async () => {
    render(<BuyerSearchPreferences isPremium={false} />);

    const makeInput = screen.getByLabelText(/Make/i);
    const modelInput = screen.getByLabelText(/Model/i);
    const yearInput = screen.getByLabelText(/Year/i);

    await userEvent.type(makeInput, 'Honda');
    await userEvent.type(modelInput, 'Civic');
    await userEvent.type(yearInput, '2021');

    expect(makeInput).toHaveValue('Honda');
    expect(modelInput).toHaveValue('Civic');
    expect(yearInput).toHaveValue('2021');
  });

  it('saves preferences when button is clicked', async () => {
    render(<BuyerSearchPreferences isPremium={false} />);

    const saveButton = screen.getByRole('button', { name: /Save Preferences/i });
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(saveSearchPreferences).toHaveBeenCalledWith({
        make: '',
        model: '',
        priceRange: [0, 50000],
        year: 2020,
      });
      expect(toast.success).toHaveBeenCalledWith('Preferences saved!');
    });
  });

  it('displays AI suggestions and search alerts for premium users', async () => {
    render(<BuyerSearchPreferences isPremium={true} />);

    await waitFor(() => {
      expect(fetchAISearchSuggestions).toHaveBeenCalled();
      expect(screen.getByText(/AI-Driven Suggestions/i)).toBeInTheDocument();
      expect(screen.getByText(/Toyota Corolla/i)).toBeInTheDocument();
      expect(screen.getByText(/High reliability/i)).toBeInTheDocument();
      expect(subscribeToSearchAlerts).toHaveBeenCalled();
    });
  });

  it('shows premium gating message when not premium', async () => {
    render(<BuyerSearchPreferences isPremium={false} />);

    await waitFor(() => {
      expect(fetchAISearchSuggestions).not.toHaveBeenCalled();
      expect(screen.queryByText(/AI-Driven Suggestions/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Upgrade to Pro\/Enterprise to access analytics/i)).toBeInTheDocument();
    });
  });

  it('handles save preferences error', async () => {
    (saveSearchPreferences as jest.Mock).mockRejectedValue(new Error('Save failed'));
    render(<BuyerSearchPreferences isPremium={false} />);

    const saveButton = screen.getByRole('button', { name: /Save Preferences/i });
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to save preferences.');
    });
  });
});