// File: ChatInterface.js
// Path: frontend/src/components/chat/ChatInterface.js

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import useAuth from '@/utils/useAuth';
import MessageBubble from './MessageBubble';
import ChatAttachmentPreviewer from './ChatAttachmentPreviewer';
import SmartSearchBar from './SmartSearchBar';
import AuditTrail from './AuditTrail';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const socket = io(import.meta.env.VITE_API_BASE_URL);

const ChatInterface = () => {
  const { token } = useAuth();
  const { disputeId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!disputeId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat/${disputeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Error loading messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    socket.emit('join', { room: disputeId });

    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off('message');
  }, [disputeId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage && attachments.length === 0) return;

    const messagePayload = {
      text: newMessage,
      attachments,
      timestamp: new Date().toISOString(),
    };

    socket.emit('sendMessage', { room: disputeId, message: messagePayload });
    setMessages((prev) => [...prev, messagePayload]);
    setNewMessage('');
    setAttachments([]);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <SmartSearchBar messages={messages} />

      <div className="bg-white p-4 rounded shadow h-[400px] overflow-y-auto">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ChatAttachmentPreviewer attachments={attachments} setAttachments={setAttachments} />

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-4 py-2"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button onClick={sendMessage} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
          Send
        </Button>
      </div>

      <AuditTrail messages={messages} />
    </div>
  );
};

export default ChatInterface;
