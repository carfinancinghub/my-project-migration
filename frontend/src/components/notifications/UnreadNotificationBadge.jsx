// File: UnreadNotificationBadge.jsx
// Path: frontend/src/components/common/UnreadNotificationBadge.jsx
// 👑 Cod1 Crown Certified — Live Unread Notification Tracker (Crowned Edition)

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import useAuth from '@/utils/useAuth'; // ✅ Crown Upgrade: Auth-Aware Connections

const UnreadNotificationBadge = () => {
  const [count, setCount] = useState(0);
  const { isAuthenticated } = useAuth(); // 🛡️ Only fetch if logged in
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return; // 🚫 Don't setup socket if not logged in

    const newSocket = io(import.meta.env.VITE_SOCKET_URL || '/', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    setSocket(newSocket);

    const userId = localStorage.getItem('userId');
    if (userId) {
      newSocket.emit('join', userId);
    }

    newSocket.on('notification:new', () => {
      setCount((prev) => prev + 1);
    });

    fetchUnreadCount(); // 📬 Initial unread fetch

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return; // 🚫 No token? Abort safely

      const res = await axios.get('/api/notifications/unread-count', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error('❌ Failed to fetch unread notifications:', err);
    }
  };

  if (count === 0) return null; // 💤 No unread? Stay invisible

  return (
    <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 animate-pulse shadow-md">
      {count}
    </span>
  );
};

export default UnreadNotificationBadge;
