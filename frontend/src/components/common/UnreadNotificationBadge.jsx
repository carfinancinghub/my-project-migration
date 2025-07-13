// File: UnreadNotificationBadge.jsx
// Path: frontend/src/components/common/UnreadNotificationBadge.jsx
// 👑 Cod1 Crown Certified — Notification Badge with Smart Auth Guard

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const UnreadNotificationBadge = () => {
  const [count, setCount] = useState(0);
  const socket = io(import.meta.env.VITE_SOCKET_URL || '/');

  useEffect(() => {
    const token = localStorage.getItem('token');

    // 🚨 If no token, don't fetch unread notifications
    if (!token) return;

    fetchUnreadCount(token);

    socket.on('connect', () => {
      const userId = localStorage.getItem('userId');
      if (userId) socket.emit('join', userId);
    });

    socket.on('notification:new', () => {
      setCount(prev => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchUnreadCount = async (token) => {
    try {
      const res = await axios.get('/api/notifications/unread-count', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to load unread count');
    }
  };

  if (count === 0) return null;

  return (
    <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 animate-pulse">
      {count}
    </span>
  );
};

export default UnreadNotificationBadge;
