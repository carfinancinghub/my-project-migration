// File: SupportChatWidget.jsx
// Path: C:\CFH\frontend\src\components\support\SupportChatWidget.jsx
// Purpose: Support chat widget for real-time assistance
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/support

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { sendMessage, getMessages } from '@services/api/support';

const SupportChatWidget = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMessages(userId);
      setMessages(data);
      logger.info(`[SupportChatWidget] Fetched messages for userId: ${userId}`);
    } catch (err) {
      logger.error(`[SupportChatWidget] Failed to fetch messages for userId ${userId}: ${err.message}`, err);
      setError('Failed to load messages. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      await sendMessage(userId, newMessage);
      setNewMessage('');
      fetchMessages();
      logger.info(`[SupportChatWidget] Sent message for userId: ${userId}`);
    } catch (err) {
      logger.error(`[SupportChatWidget] Failed to send message for userId ${userId}: ${err.message}`, err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 max-w-md mx-auto my-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Support Chat</h2>
      {isLoading && <div className="text-center text-gray-500" aria-live="polite">Loading...</div>}
      {error && <div className="text-center text-red-600 bg-red-100 border border-red-300 rounded-md mb-4" role="alert">{error}</div>}
      <div className="max-h-64 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 mb-2 rounded-lg ${msg.fromUser ? 'bg-blue-100 ml-auto' : 'bg-gray-100'} max-w-xs`}>
            <p className="text-sm">{msg.text}</p>
            <p className="text-xs text-gray-500">{msg.timestamp}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

SupportChatWidget.propTypes = { userId: PropTypes.string.isRequired };
export default SupportChatWidget;