// File: NotificationCenter.js
// Path: frontend/src/components/NotificationCenter.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const socket = io(process.env.REACT_APP_SOCKET_URL || '/');

  useEffect(() => {
    fetchNotifications();

    socket.on('connect', () => {
      const userId = localStorage.getItem('userId');
      if (userId) socket.emit('join', userId);
    });

    socket.on('notification:new', (data) => {
      setNotifications(prev => [data, ...prev]);
      toast.success(`🔔 ${data.title}: ${data.message}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      toast.error('❌ Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
    } catch (err) {
      toast.error('❌ Failed to mark as read');
    }
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success('🧹 Cleared all locally (demo only)');
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'Vote Submitted': return '🗳️';
      case 'Evidence Uploaded': return '📤';
      case 'Resolved': return '✅';
      default: return '🔔';
    }
  };

  const filtered = notifications.filter(n => {
    if (filter === 'all') return true;
    return filter === 'unread' ? !n.read : n.read;
  });

  return (
    <div className="p-6 bg-white rounded shadow max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">🔔 Notification Center</h2>
        <button onClick={handleClearAll} className="text-sm text-red-500 hover:underline">Clear All</button>
      </div>

      <div className="flex gap-3 mb-4">
        <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
          All
        </button>
        <button onClick={() => setFilter('unread')} className={`px-3 py-1 rounded ${filter === 'unread' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
          Unread
        </button>
        <button onClick={() => setFilter('read')} className={`px-3 py-1 rounded ${filter === 'read' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
          Read
        </button>
      </div>

      {loading ? <p>Loading...</p> : (
        <ul className="space-y-2">
          {filtered.length === 0 ? <p className="text-gray-500">No notifications</p> :
            filtered.map(n => (
              <li key={n._id} className="border rounded p-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span>{renderIcon(n.context?.type)}</span>
                    <strong>{n.title}</strong>
                  </div>
                  <p className="text-sm text-gray-700">{n.message}</p>
                </div>
                {!n.read && <button onClick={() => handleMarkAsRead(n._id)} className="text-sm text-indigo-600 hover:underline">Mark as Read</button>}
              </li>
            ))
          }
        </ul>
      )}
    </div>
  );
};

export default NotificationCenter;
