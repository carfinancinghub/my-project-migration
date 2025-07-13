// File: AdminLoginHistory.js
// Path: frontend/src/components/admin/logins/AdminLoginHistory.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorBoundary from '../../common/ErrorBoundary';
import Card from '../../common/Card';

const AdminLoginHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/logins/history`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHistory(res.data);
      } catch (err) {
        console.error('Error fetching login history:', err);
        setError('❌ Failed to load login history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">👥 Login History</h1>

          {loading && <LoadingSpinner />}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && history.length === 0 && (
            <p className="text-gray-500">No login records found.</p>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              {history.map((entry) => (
                <Card key={entry._id} className="hover:shadow-md flex justify-between items-center">
                  <div>
                    <p><strong>User:</strong> {entry.userEmail || entry.userId}</p>
                    <p><strong>IP:</strong> {entry.ipAddress}</p>
                    <p><strong>Timestamp:</strong> {new Date(entry.timestamp).toLocaleString()}</p>
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

export default AdminLoginHistory;
