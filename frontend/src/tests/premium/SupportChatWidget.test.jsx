// File: SupportChatWidget.test.jsx
// Path: C:\CFH\frontend\src\tests\premium\SupportChatWidget.test.jsx
// Purpose: Unit tests for SupportChatWidget component
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SupportChatWidget from '@components/premium/SupportChatWidget';
import { startChatSession, sendMessage } from '@services/api/premium';
import logger from '@utils/logger';

jest.mock('@services/api/premium');
jest.mock('@utils/logger');

describe('SupportChatWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders closed state initially', () => {
    render(<SupportChatWidget userId="123" officerId="officer1" />);
    expect(screen.getByText(/Premium Support Chat/i)).toBeInTheDocument();
  });

  it('opens chat and initiates session', async () => {
    startChatSession.mockResolvedValueOnce({ sessionId: 'chat-123' });
    render(<SupportChatWidget userId="123" officerId="officer1" />);
    fireEvent.click(screen.getByText(/Premium Support Chat/i));
    await waitFor(() => {
      expect(screen.getByText(/Premium Support/i)).toBeInTheDocument();
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Chat session initiated'));
    });
  });

  it('sends message successfully', async () => {
    startChatSession.mockResolvedValueOnce({ sessionId: 'chat-123' });
    sendMessage.mockResolvedValueOnce({});
    render(<SupportChatWidget userId="123" officerId="officer1" />);
    fireEvent.click(screen.getByText(/Premium Support Chat/i));
    await waitFor(() => {
      expect(screen.getByText(/Premium Support/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/Type your message/i), { target: { value: 'Hello' } });
    fireEvent.click(screen.getByText(/Send/i));
    await waitFor(() => {
      expect(screen.getByText(/Hello/i)).toBeInTheDocument();
      expect(screen.getByText(/How can I assist you today/i)).toBeInTheDocument();
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Sent message'));
    });
  });

  it('shows error on session initiation failure', async () => {
    startChatSession.mockRejectedValueOnce(new Error('API error'));
    render(<SupportChatWidget userId="123" officerId="officer1" />);
    fireEvent.click(screen.getByText(/Premium Support Chat/i));
    await waitFor(() => {
      expect(screen.getByText(/Failed to start chat/i)).toBeInTheDocument();
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to initiate chat'));
    });
  });

  it('requires userId and officerId props', () => {
    expect(SupportChatWidget.propTypes.userId).toBe(PropTypes.string.isRequired);
    expect(SupportChatWidget.propTypes.officerId).toBe(PropTypes.string.isRequired);
  });
});