// File: NotificationCenter.jsx
// Path: frontend/src/components/notifications/NotificationCenter.jsx
// 👑 Cod1 Crown Certified — Full Notification Manager with Toast Notifications + ToastWrapper Enhancement

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from '@/components/common/ToastManager'; // ✅ ToastManager Import
import ToastWrapper from '@/components/common/ToastWrapper'; // ✅ New ToastWrapper Import

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Failed to load notifications.');
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      toast.success('Marked as read!');
    } catch (err) {
      console.error('Failed to mark as read:', err);
      toast.error('Failed to mark as read.');
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success('Notification deleted!');
    } catch (err) {
      console.error('Failed to delete notification:', err);
      toast.error('Failed to delete notification.');
    }
  };

  if (loading) return <div className="text-center py-10">Loading notifications...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ToastWrapper /> {/* 🧹 Global Toast Mount Point */}
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Bell size={28} /> Notifications
      </h1>

      {notifications.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg">No notifications yet.</p>
          <Bell className="mx-auto mt-4" size={40} />
        </div>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li key={n._id} className={`p-4 border rounded-lg shadow-sm flex justify-between items-center transition ${n.read ? 'bg-gray-100' : 'bg-white animate-pulse'}`}>
              <div>
                <p className={`font-${n.read ? 'normal' : 'bold'} text-gray-800`}>{n.message}</p>
                <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
              </div>
              <div className="flex items-center gap-2">
                {!n.read && (
                  <button
                    onClick={() => markAsRead(n._id)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(n._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationCenter;
