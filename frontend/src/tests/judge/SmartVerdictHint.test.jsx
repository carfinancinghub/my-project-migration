/**
 * File: SmartVerdictHint.test.jsx
 * Path: C:\CFH\frontend\src\tests\judge\SmartVerdictHint.test.jsx
 * Purpose: Unit and integration tests for SmartVerdictHint.jsx (real-time verdict suggestion panel)
 * Author: Cod1 Test Suite
 * Date: May 29, 2025
 * 👑 Cod1 Crown Certified
 *
 * Tests:
 * - Renders null when not premium
 * - Renders loading state correctly
 * - Displays verdict hint and confidence after receiving socket data
 * - Cleans up socket listeners on unmount
 */

import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import SmartVerdictHint from '@/components/judge/SmartVerdictHint';
import { io } from 'socket.io-client';

jest.mock('socket.io-client');

let mockSocket;
beforeEach(() => {
  mockSocket = {
    on: jest.fn(),
    off: jest.fn(),
  };
  io.mockReturnValue(mockSocket);
});

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('SmartVerdictHint Component', () => {
  test('renders nothing when isPremium is false', () => {
    const { container } = render(<SmartVerdictHint isPremium={false} disputeId="123" />);
    expect(container.firstChild).toBeNull();
  });

  test('renders loading message for premium user', () => {
    render(<SmartVerdictHint isPremium={true} disputeId="123" />);
    expect(screen.getByText(/awaiting smart hint/i)).toBeInTheDocument();
  });

  test('renders verdict hint when socket receives data', async () => {
    const hintData = {
      hint: 'Offer compromise settlement.',
      confidence: 92,
    };

    mockSocket.on.mockImplementation((event, callback) => {
      if (event === 'disputeUpdated') {
        callback(hintData);
      }
    });

    render(<SmartVerdictHint isPremium={true} disputeId="123" />);

    await waitFor(() => {
      expect(screen.getByText(/offer compromise settlement/i)).toBeInTheDocument();
      expect(screen.getByText(/92%/i)).toBeInTheDocument();
    });
  });

  test('cleans up socket listener on unmount', () => {
    const { unmount } = render(<SmartVerdictHint isPremium={true} disputeId="123" />);
    unmount();
    expect(mockSocket.off).toHaveBeenCalledWith('disputeUpdated', expect.any(Function));
  });
});
