// File: AdminReports.js
// Path: frontend/src/components/admin/reports/AdminReports.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorBoundary from '../../common/ErrorBoundary';

const AdminReports = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/audit-logs`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLogs(res.data);
      } catch (err) {
        console.error('Error fetching audit logs:', err);
        setError('❌ Failed to load system audit logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">📋 System Audit Logs</h1>

          {loading && <LoadingSpinner />}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && logs.length === 0 && (
            <p className="text-gray-500">No audit logs found.</p>
          )}

          {!loading && !error && logs.length > 0 && (
            <div className="overflow-auto">
              <table className="min-w-full table-auto border text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-2 border">Timestamp</th>
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Message</th>
                    <th className="p-2 border">User</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log._id} className="hover:bg-gray-50">
                      <td className="p-2 border">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="p-2 border">{log.type}</td>
                      <td className="p-2 border">{log.message}</td>
                      <td className="p-2 border">{log.userId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default AdminReports;
