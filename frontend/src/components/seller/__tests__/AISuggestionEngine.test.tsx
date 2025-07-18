/**
 * © 2025 CFH, All Rights Reserved
 * File: AISuggestionEngine.test.tsx
 * Path: frontend/src/components/seller/__tests__/AISuggestionEngine.test.tsx
 * Purpose: Jest/RTL test for AISuggestionEngine component, focusing on UI, API, and tiered features.
 * Author: CFH Dev Team, Cod1
 * Date: 2025-07-17 [1116]
 * Version: 1.0.0
 * Crown Certified: Yes (pending)
 * Related To: frontend/src/components/seller/AISuggestionEngine.tsx
 */

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AISuggestionEngine, { FormData } from '../AISuggestionEngine';

jest.mock('axios', () => ({
  post: jest.fn(),
}));
import axios from 'axios';

describe('AISuggestionEngine', () => {
  const mockSetForm = jest.fn();
  const defaultForm: FormData = {
    title: 'Nice Car',
    description: 'A gently used sedan.',
    tags: ['sedan', 'used'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.setItem('token', 'mock-token');
  });

  it('renders and displays AI Listing Assistant', () => {
    render(<AISuggestionEngine form={defaultForm} setForm={mockSetForm} />);
    expect(screen.getByText('🤖 AI Listing Assistant')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /suggest improvements/i })).toBeInTheDocument();
  });

  it('alerts if not logged in', () => {
    window.localStorage.removeItem('token');
    window.alert = jest.fn();
    render(<AISuggestionEngine form={defaultForm} setForm={mockSetForm} />);
    fireEvent.click(screen.getByRole('button', { name: /suggest improvements/i }));
    expect(window.alert).toHaveBeenCalledWith('You must be logged in to use AI Suggestions.');
  });

  it('calls API and displays suggestions', async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: {
        title: 'Best Used Sedan',
        description: 'Excellent condition, low miles.',
        tags: ['best', 'low-mileage'],
      },
    });
    render(<AISuggestionEngine form={defaultForm} setForm={mockSetForm} />);
    fireEvent.click(screen.getByRole('button', { name: /suggest improvements/i }));

    await waitFor(() => expect(screen.getByText('Suggested Title:')).toBeInTheDocument());
    expect(screen.getByText('Best Used Sedan')).toBeInTheDocument();
    expect(screen.getByText('Excellent condition, low miles.')).toBeInTheDocument();
    expect(screen.getByText('best, low-mileage')).toBeInTheDocument();
  });

  it('applies suggestions to form', async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: {
        title: 'Best Used Sedan',
        description: 'Excellent condition, low miles.',
        tags: ['best', 'low-mileage'],
      },
    });
    render(<AISuggestionEngine form={defaultForm} setForm={mockSetForm} />);
    fireEvent.click(screen.getByRole('button', { name: /suggest improvements/i }));

    await waitFor(() => expect(screen.getByText('Apply Suggestions')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /apply suggestions/i }));
    expect(mockSetForm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Best Used Sedan',
        description: 'Excellent condition, low miles.',
        tags: ['best', 'low-mileage'],
      })
    );
  });

  it('handles API errors gracefully', async () => {
    window.alert = jest.fn();
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error('API fail'));
    render(<AISuggestionEngine form={defaultForm} setForm={mockSetForm} />);
    fireEvent.click(screen.getByRole('button', { name: /suggest improvements/i }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('AI failed to suggest improvements.'));
  });
});
