// File: SupportChatWidget.test.jsx
// Path: C:\CFH\frontend\src\tests\support\SupportChatWidget.test.jsx
// Purpose: Unit tests for SupportChatWidget component
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SupportChatWidget from '@components/support/SupportChatWidget';
import { sendMessage, getMessages } from '@services/api/support';
import logger from '@utils/logger';

jest.mock('@services/api/support');
jest.mock('@utils/logger');

const mockMessages = [
  { text: 'Hello!', timestamp: '2025-05-20 10:00', fromUser: true },
  { text: 'Hi! How can I help?', timestamp: '2025-05-20 10:01', fromUser: false }
];

describe('SupportChatWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<SupportChatWidget userId="123" />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders messages when data is available', async () => {
    getMessages.mockResolvedValueOnce(mockMessages);
    render(<SupportChatWidget userId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/Hello!/i)).toBeInTheDocument();
      expect(screen.getByText(/Hi! How can I help?/i)).toBeInTheDocument();
    });
  });

  it('sends a new message and refreshes message list', async () => {
    getMessages.mockResolvedValueOnce(mockMessages);
    sendMessage.mockResolvedValueOnce({});
    render(<SupportChatWidget userId="123" />);
    const input = screen.getByPlaceholderText(/type your message/i);
    const sendButton = screen.getByText(/send/i);

    fireEvent.change(input, { target: { value: 'New message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(sendMessage).toHaveBeenCalledWith('123', 'New message');
      expect(getMessages).toHaveBeenCalledTimes(2); // Initial fetch + refresh
    });
  });

  it('logs errors and shows error message on fetch failure', async () => {
    getMessages.mockRejectedValueOnce(new Error('API failed'));
    render(<SupportChatWidget userId="123" />);
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch messages'));
      expect(screen.getByText(/Failed to load messages/i)).toBeInTheDocument();
    });
  });

  it('disables input and button while loading', async () => {
    getMessages.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<SupportChatWidget userId="123" />);
    expect(screen.getByPlaceholderText(/type your message/i)).toBeDisabled();
    expect(screen.getByText(/send/i)).toBeDisabled();
  });
});

SupportChatWidget.test.propTypes = {};