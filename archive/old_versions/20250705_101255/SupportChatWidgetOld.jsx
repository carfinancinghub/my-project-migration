// 👑 Crown Certified Component — SupportChatWidget.jsx
// Path: C:\CFH\frontend\src\components\support\SupportChatWidget.jsx
// Purpose: Real-time customer support chat interface with premium AI assistance and multilingual toggle.
// Author: Rivers Auction Team
// Date: May 18, 2025
// Cod2 Crown Certified

import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import ChatMessage from '@components/common/ChatMessage';
import SupportService from '@services/support/SupportService';
import LiveUpdates from '@services/websocket/LiveUpdates';
import logger from '@utils/logger';

const SupportChatWidget = ({ userId, isPremium, ticketId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');
  const [suggestions, setSuggestions] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
    if (isPremium) fetchSuggestions();
    connectWebSocket();
    return () => wsRef.current?.close();
  }, [ticketId, isPremium]);

  const loadChatHistory = async () => {
    try {
      const data = await SupportService.getChatHistory(userId, ticketId);
      setMessages(data);
    } catch (err) {
      logger.error('Error loading chat history', err);
      setError('Unable to load chat history.');
    }
  };

  const fetchSuggestions = async () => {
    try {
      const data = await SupportService.getSuggestions(userId);
      setSuggestions(data);
    } catch (err) {
      logger.error('Error fetching AI suggestions', err);
    }
  };

  const connectWebSocket = () => {
    try {
      wsRef.current = LiveUpdates.connect(`/ws/support/chat?userId=${userId}`);
      wsRef.current.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        setMessages((prev) => [...prev, msg]);
      };
    } catch (err) {
      logger.error('WebSocket connection failed', err);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const message = {
      userId,
      text: input,
      timestamp: new Date().toISOString(),
      language,
      ticketId,
    };
    try {
      await SupportService.sendMessage(message);
      wsRef.current?.send(JSON.stringify(message));
      setMessages((prev) => [...prev, message]);
      setInput('');
    } catch (err) {
      logger.error('Message send failed', err);
      setError('Message failed to send.');
    }
  };

  const handleEscalate = async () => {
    try {
      await SupportService.escalateTicket(ticketId);
      alert('Ticket escalated.');
    } catch (err) {
      logger.error('Escalation failed', err);
      setError('Could not escalate ticket.');
    }
  };

  return (
    <div className="bg-white border shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">📞 Support Chat</h2>
      {error && <p className="text-red-500">{error}</p>}

      <div className="h-64 overflow-y-scroll space-y-2 mb-3">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}
      </div>

      <div className="flex gap-2 mb-2">
        <input
          className="border rounded w-full p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSend}>
          Send
        </button>
      </div>

      {isPremium && (
        <div className="text-sm text-gray-700">
          <div className="mb-2">
            <strong>💡 Suggestions:</strong>
            <ul className="list-disc pl-5">
              {suggestions.map((sug, i) => (
                <li key={i}>{sug}</li>
              ))}
            </ul>
          </div>
          <div className="flex justify-between">
            <button
              className="bg-gray-600 text-white px-3 py-1 rounded"
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            >
              🌐 {language === 'en' ? 'Español' : 'English'}
            </button>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={handleEscalate}
            >
              🚨 Escalate
            </button>
          </div>
        </div>
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
