// File: AdminNotificationCenter.js
// Path: frontend/src/components/admin/notifications/AdminNotificationCenter.js
// Features: Admin layout, responsive notification center, mobile-friendly UI, send + view system-wide notifications, token-secured API, uses useAuth hook

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/layout/AdminLayout';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import useAuth from '@/utils/useAuth';

const AdminNotificationCenter = () => {
  const { token } = useAuth();
  const [message, setMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      setError('Failed to load notifications.');
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error('Send failed');
      setMessage('');
      fetchNotifications();
    } catch (err) {
      setError('Failed to send notification.');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="max-w-full sm:max-w-2xl md:max-w-3xl mx-auto px-4 sm:px-6 md:px-0">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl">
                📢 Send System Notification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                className="text-sm sm:text-base"
                placeholder="Enter your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button
                className="w-full sm:w-auto"
                onClick={handleSend}
              >
                Send Notification
              </Button>
              {error && <div className="text-red-500 text-sm">{error}</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl">
                📬 Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 space-y-2 text-sm sm:text-base">
                {notifications.map((n, idx) => (
                  <li key={idx}>{n.message}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default AdminNotificationCenter;
