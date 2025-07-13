// File: ContractAuditViewer.js
// Path: frontend/src/components/contract/ContractAuditViewer.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '@/layout/Navbar';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { theme } from '@/styles/theme';


const ContractAuditViewer = () => {
  const { id } = useParams();
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/contracts/${id}/audit`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuditLogs(res.data);
      } catch (err) {
        setError('❌ Failed to fetch audit logs');
        console.error('Audit log fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuditLogs();
  }, [id, token]);

  const handleExportCSV = () => {
    const rows = [
      ['Timestamp', 'Event', 'User', 'IP'],
      ...auditLogs.map(log => [
        new Date(log.timestamp).toLocaleString(),
        log.event,
        log.user?.email || 'N/A',
        log.ip || 'Unknown'
      ])
    ];

    const csvContent = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `contract_audit_${id}.csv`);
    link.click();
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">🕵️ Contract Audit Trail</h1>
          {auditLogs.length > 0 && (
            <Button onClick={handleExportCSV}>⬇️ Export CSV</Button>
          )}
        </div>

        {loading && <LoadingSpinner />}
        {error && <p className={theme.errorText}>{error}</p>}

        {!loading && !error && auditLogs.length === 0 && (
          <p className="text-gray-500">No audit events recorded for this contract.</p>
        )}

        {!loading && !error && auditLogs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Timestamp</th>
                  <th className="border px-4 py-2">Event</th>
                  <th className="border px-4 py-2">User</th>
                  <th className="border px-4 py-2">IP</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log._id} className="text-center">
                    <td className="border px-2 py-1">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="border px-2 py-1">{log.event}</td>
                    <td className="border px-2 py-1">{log.user?.email || 'N/A'}</td>
                    <td className="border px-2 py-1">{log.ip || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractAuditViewer;
