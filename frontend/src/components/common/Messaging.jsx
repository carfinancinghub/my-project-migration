// File: Messaging.jsx
// Path: C:\CFH\frontend\src\components\common\Messaging.jsx
// Purpose: Provide a UI for role-to-role messaging
// Author: Rivers Auction Dev Team
// Date: 2025-05-25
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/communication

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { sendMessage, getMessages } from '@services/api/communication';

const Messaging = ({ userId, context }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const userMessages = await getMessages(userId);
        setMessages(userMessages.filter(msg => msg.context.auctionId === context.auctionId));
        logger.info(`[Messaging] Fetched messages for userId: ${userId}`);
      } catch (err) {
        logger.error(`[Messaging] Failed to fetch messages for userId ${userId}: ${err.message}`, err);
        setError('Failed to load messages. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();

    const ws = new WebSocket(`ws://api.riversauction.com/user/${userId}`);
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      if (update.type === 'new_message' && update.message.context.auctionId === context.auctionId) {
        setMessages(prev => [...prev, update.message]);
      }
    };
    ws.onerror = (err) => {
      logger.error(`[Messaging] WebSocket error for userId ${userId}: ${err.message}`, err);
      setError('Failed to connect to live messages.');
    };
    return () => ws.close();
  }, [userId, context]);

  const handleSendMessage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await sendMessage(userId, receiverId, newMessage, context);
      setNewMessage('');
      logger.info(`[Messaging] Sent message from userId: ${userId} to receiverId: ${receiverId}`);
    } catch (err) {
      logger.error(`[Messaging] Failed to send message for userId ${userId}: ${err.message}`, err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-4 text-center text-gray-500" aria-live="polite">Loading messages...</div>;
  if (error) return <div className="p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded-md" role="alert">{error}</div>;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mx-2 my-4">
      <h3 className="text-lg font-medium text-gray-700 mb-2">Messages</h3>
      <div className="space-y-4">
        <div className="h-40 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.senderId === userId ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded-lg ${msg.senderId === userId ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <p className="text-gray-600 text-sm">User {msg.senderId === userId ? 'You' : msg.senderId}</p>
                <p>{msg.content}</p>
                <p className="text-gray-500 text-xs">{new Date(msg.timestamp).toLocaleTimeString()}</p>
              </span>
            </div>
          ))}
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Send To (User ID)</label>
          <input
            type="text"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter receiver's user ID"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Message</label>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            rows="3"
          />
        </div>
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !receiverId || !newMessage}
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg ${isLoading || !receiverId || !newMessage ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </div>
  );
};

Messaging.propTypes = {
  userId: PropTypes.string.isRequired,
  context: PropTypes.object.isRequired
};

export default Messaging;