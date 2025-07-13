// File: AdminNotificationCenter.jsx
// Path: frontend/src/components/admin/notifications/AdminNotificationCenter.jsx

// Features:
// - View all platform notifications (new bids, disputes, system alerts)
// - Delete individual notifications with live toast feedback
// - Live fetch notifications on page load with token authentication
// - Responsive card layout for notifications
// - Crown UI/UX polish (spacing, hover effects, modular actions)
// - Error handling with ErrorBoundary

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/common/Navbar';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import ToastWrapper from '@/components/common/ToastWrapper';
import { toast } from 'react-toastify';

const AdminNotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || '';

  // 🔹 Fetch notifications for admin view
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete a notification with toast feedback
  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiUrl}/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Notification deleted');
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast.error('Failed to delete notification');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-10">{error}</div>
    );
  }

  return (
    <ErrorBoundary>
      <ToastWrapper />
      <Navbar />
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-indigo-700">🔔 Notification Center</h1>

        {notifications.length === 0 ? (
          <div className="text-gray-500 text-center">No notifications available.</div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div>
                  <p className="text-lg font-semibold">{notification.message}</p>
                  <p className="text-sm text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => deleteNotification(notification._id)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AdminNotificationCenter;
