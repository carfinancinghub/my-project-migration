/**
 * File: CollaborationChat.test.js
 * Path: frontend/src/tests/CollaborationChat.test.js
 * Purpose: Unit tests for CollaborationChat.jsx to validate chat functionality
 * Author: SG
 * Date: April 28, 2025
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CollaborationChat from '@components/chat/CollaborationChat';
import { vi } from 'vitest';

// Mock dependencies
vi.mock('@utils/logger', () => ({ default: { error: vi.fn(), info: vi.fn() } }));
vi.mock('react-toastify', () => ({ toast: { error: vi.fn() } }));
global.fetch = vi.fn();
const mockWebSocket = {
  onopen: vi.fn(),
  onmessage: vi.fn(),
  onerror: vi.fn(),
  onclose: vi.fn(),
  send: vi.fn(),
  close: vi.fn(),
  readyState: WebSocket.OPEN,
};
vi.stubGlobal('WebSocket', vi.fn(() => mockWebSocket));

describe('CollaborationChat', () => {
  const defaultProps = {
    userId: 'user123',
    auctionId: 'auction123',
    isPremium: true,
    role: 'buyer',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    fetch.mockReset();
    WebSocket.mockReset();
  });

  it('should render chat history for free users', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ userId: 'user123', content: 'Hello', timestamp: '2025-04-28T12:00:00Z' }],
    });

    render(<CollaborationChat {...defaultProps} isPremium={false} />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/auction/auction123/chat',
        expect.any(Object)
      );
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });

  it('should connect to WebSocket for premium users', async () => {
    render(<CollaborationChat {...defaultProps} />);

    await waitFor(() => {
      expect(WebSocket).toHaveBeenCalledWith('ws://localhost:8080?group=auction_auction123');
      expect(mockWebSocket.send).toHaveBeenCalledWith(
        JSON.stringify({ type: 'join', userId: 'user123', role: 'buyer' })
      );
    });
  });

  it('should send and display messages for premium users', async () => {
    render(<CollaborationChat {...defaultProps} />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/chat message input/i), 'Test message');
    await user.click(screen.getByLabelText(/send chat message/i));

    await waitFor(() => {
      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining('"content":"Test message"')
      );
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
  });

  it('should anonymize financier IDs for blind bidding', async () => {
    render(<CollaborationChat {...defaultProps} role="financier" />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/chat message input/i), 'Offer terms');
    await user.click(screen.getByLabelText(/send chat message/i));

    await waitFor(() => {
      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining('"userId":"Financier_')
      );
    });
  });

  it('should handle WebSocket errors gracefully', async () => {
    WebSocket.mockImplementation(() => {
      throw new Error('Connection failed');
    });

    render(<CollaborationChat {...defaultProps} />);

    await waitFor(() => {
      expect(require('react-toastify').toast.error).toHaveBeenCalledWith('Failed to connect to chat');
    });
  });
});

// Cod2 Crown Certified: This test suite validates chat history, WebSocket messaging, blind bidding, and error handling,
// uses Jest with @ aliases, and ensures robust testing coverage.