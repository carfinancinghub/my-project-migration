// File: AdminBadgeAuditLog.js
// Path: frontend/src/components/admin/badges/AdminBadgeAuditLog.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorBoundary from '../../common/ErrorBoundary';
import Card from '../../common/Card';
import Button from '../../common/Button';

const AdminBadgeAuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBadgeLogs = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/badge-audit`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLogs(res.data);
      } catch (err) {
        console.error('Error fetching badge audit logs:', err);
        setError('❌ Failed to load badge audit logs');
      } finally {
        setLoading(false);
      }
    };
    fetchBadgeLogs();
  }, []);

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">🎖️ Badge Audit Log</h1>

          {loading && <LoadingSpinner />}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && logs.length === 0 && (
            <p className="text-gray-500">No badge audit entries found.</p>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              {logs.map(log => (
                <Card key={log._id} className="hover:shadow-md flex justify-between items-start">
                  <div>
                    <p><strong>User:</strong> {log.userEmail || log.user}</p>
                    <p><strong>Badge:</strong> {log.badge}</p>
                    <p><strong>Role:</strong> {log.role}</p>
                    <p><strong>Awarded By:</strong> {log.awardedByEmail || log.awardedBy}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                  <Button onClick={() => {/* navigate to related user */}}>
                    View User
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default AdminBadgeAuditLog;
