// Crown Certified Component — SupportChatWidget.jsx
// Path: C:\CFH\frontend\src\components\support\SupportChatWidget.jsx
// Author: Rivers Auction Team — May 18, 2025
// Cod2 Crown Certified

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ChatMessage from '@components/common/ChatMessage';
import SupportService from '@services/support/SupportService';
import LiveUpdates from '@services/websocket/LiveUpdates';
import logger from '@utils/logger';

const SupportChatWidget = ({ userId, isPremium, ticketId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [language, setLanguage] = useState('en');
  const wsRef = useRef(null);

  useEffect(() => {
    fetchInitialMessages();
    if (isPremium) fetchSuggestions();
    wsRef.current = LiveUpdates.connect(`/ws/support/chat/${userId}`, handleMessage);
    return () => wsRef.current?.close();
  }, [userId, isPremium]);

  const fetchInitialMessages = async () => {
    try {
      const history = await SupportService.getMessages(ticketId);
      setMessages(history || []);
    } catch (err) {
      logger.error('Failed to fetch chat history', err);
      setError('Could not load chat messages.');
    }
  };

  const fetchSuggestions = async () => {
    try {
      const result = await SupportService.getSuggestions(userId);
      setSuggestions(result || []);
    } catch (err) {
      logger.error('Failed to fetch AI suggestions', err);
    }
  };

  const handleMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const message = { userId, content: input, timestamp: Date.now(), language, ticketId };
    try {
      await SupportService.sendMessage(message);
      wsRef.current.send(JSON.stringify(message));
      setMessages((prev) => [...prev, message]);
      setInput('');
    } catch (err) {
      logger.error('Message send failed', err);
      setError('Failed to send message.');
    }
  };

  const handleEscalate = async () => {
    try {
      await SupportService.escalateTicket(ticketId || 'manual');
      alert('Your issue was escalated to priority support.');
    } catch (err) {
      logger.error('Escalation failed', err);
      setError('Could not escalate the ticket.');
    }
  };

  return (
    <div className="support-chat-widget p-4 shadow rounded bg-white">
      <h2 className="text-lg font-bold mb-2">💬 Support Chat</h2>
      {error && <p className="text-red-600">{error}</p>}
      <div className="chat-messages max-h-64 overflow-y-auto mb-2">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}
      </div>
      <div className="flex gap-2 items-center mb-2">
        <input
          type="text"
          className="flex-1 border px-2 py-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend} className="bg-blue-600 text-white px-3 py-1 rounded">
          Send
        </button>
      </div>

      {isPremium && (
        <>
          <div className="mb-2">
            <label className="block font-medium">🌐 Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
          <button
            onClick={handleEscalate}
            className="bg-red-600 text-white px-3 py-1 rounded mt-1"
          >
            🚨 Escalate to Priority
          </button>
          {suggestions.length > 0 && (
            <div className="mt-3">
              <p className="font-semibold mb-1">🧠 AI Suggestions:</p>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

SupportChatWidget.propTypes = {
  userId: PropTypes.string.isRequired,
  isPremium: PropTypes.bool.isRequired,
  ticketId: PropTypes.string,
};

export default SupportChatWidget;