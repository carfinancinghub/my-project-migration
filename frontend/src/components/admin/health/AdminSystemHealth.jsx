// File: AdminSystemHealth.jsx
// Path: frontend/src/components/admin/health/AdminSystemHealth.jsx
// 👑 Cod1 Crown Certified — Admin System Health Panel

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@/components/common/Card.jsx';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ErrorBoundary from '@/components/common/ErrorBoundary.jsx';

// 🌟 Admin System Health Component
const AdminSystemHealth = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || '';

  const fetchSystemHealth = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/admin/system/health`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHealth(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching system health:', err);
      setError('Failed to load system health information.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemHealth();
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
      <div className="text-center text-red-600 py-10">
        {error}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">System Health Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="API Latency">
            <p className="text-2xl font-semibold text-gray-700">{health.apiLatency} ms</p>
          </Card>
          <Card title="Database Status">
            <p className="text-2xl font-semibold text-gray-700">{health.databaseStatus}</p>
          </Card>
          <Card title="Server Uptime">
            <p className="text-2xl font-semibold text-gray-700">{health.serverUptime}</p>
          </Card>
          <Card title="Active Connections">
            <p className="text-2xl font-semibold text-gray-700">{health.activeConnections}</p>
          </Card>
          <Card title="Memory Usage">
            <p className="text-2xl font-semibold text-gray-700">{health.memoryUsage}</p>
          </Card>
          <Card title="CPU Load">
            <p className="text-2xl font-semibold text-gray-700">{health.cpuLoad}</p>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AdminSystemHealth;
