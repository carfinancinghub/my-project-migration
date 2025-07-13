// File: AdminNotificationCenter.js
// Path: frontend/src/components/admin/notifications/AdminNotificationCenter.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { theme } from '@/styles/theme';

const AdminNotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('❌ Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">🔔 Notification Center</h1>

          {loading && <LoadingSpinner />}
          {error && <p className={theme.errorText}>{error}</p>}

          {!loading && !error && notifications.length === 0 && (
            <p className="text-gray-500">No notifications available.</p>
          )}

          {!loading && !error && notifications.length > 0 && (
            <div className="space-y-4">
              {notifications.map((note) => (
                <Card key={note._id} className="hover:shadow-md">
                  <div>
                    <p className="font-semibold">{note.title}</p>
                    <p className="text-sm text-gray-600">{note.message}</p>
                    <p className="text-xs text-gray-400 mt-1">Created: {new Date(note.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="mt-2 text-right">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm">Acknowledge</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default AdminNotificationCenter;
