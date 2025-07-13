// File: SupportChatWidget.jsx
// Path: C:\CFH\frontend\src\components\premium\SupportChatWidget.jsx
// Purpose: Provide a support chat widget for premium users
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/premium

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { startChatSession, sendMessage } from '@services/api/premium';

const SupportChatWidget = ({ userId, officerId }) => {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const initiateChat = async () => {
      try {
        const { sessionId } = await startChatSession(userId, officerId);
        setSessionId(sessionId);
        logger.info(`[SupportChatWidget] Chat session initiated for userId: ${userId}`);
      } catch (err) {
        logger.error(`[SupportChatWidget] Failed to initiate chat for userId ${userId}: ${err.message}`, err);
        setError('Failed to start chat. Please try again.');
      }
    };
    if (isOpen && !sessionId) {
      initiateChat();
    }
  }, [isOpen, sessionId, userId, officerId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await sendMessage(userId, sessionId, newMessage);
      setMessages([...messages, { sender: 'user', text: newMessage }]);
      setNewMessage('');
      // Simulate officer response for demo
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'officer', text: 'Thanks for reaching out! How can I assist you today?' }]);
      }, 1000);
    } catch (err) {
      logger.error(`[SupportChatWidget] Failed to send message for userId ${userId}: ${err.message}`, err);
      setError('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg"
        >
          Premium Support Chat
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-lg w-80 h-96 flex flex-col">
          <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="text-lg font-semibold">Premium Support</h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">✖</button>
          </div>
          {error && <div className="p-2 text-red-600 bg-red-100 border border-red-300 rounded-md m-2" role="alert">{error}</div>}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200 flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg p-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

SupportChatWidget.propTypes = {
  userId: PropTypes.string.isRequired,
  officerId: PropTypes.string.isRequired
};

export default SupportChatWidget;