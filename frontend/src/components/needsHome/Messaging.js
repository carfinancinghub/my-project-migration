import { io } from 'socket.io-client';
import React, { useEffect, useRef, useState } from 'react';

const socket = io('http://localhost:5000');

const Messaging = ({ conversationId, recipientId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit('joinRoom', conversationId);

    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off('receiveMessage');
  }, [conversationId]);

  useEffect(() => {
    fetch(`/api/messages/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setMessages(data));
  }, [conversationId]);

  const sendMessage = async () => {
    const messagePayload = {
      conversationId,
      recipientId,
      content: newMsg
    };

    socket.emit('sendMessage', messagePayload);
    setMessages((prev) => [...prev, messagePayload]);

    await fetch(`/api/messages/${conversationId}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ content: newMsg })
    });

    setNewMsg('');
  };

  return (
    <div className="messaging-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className="message">
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <input
        value={newMsg}
        onChange={(e) => setNewMsg(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Messaging;