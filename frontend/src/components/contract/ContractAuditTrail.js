// File: ContractAuditTrail.js
// Path: frontend/src/components/contract/ContractAuditTrail.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { theme } from '@/styles/theme';

import { useParams } from 'react-router-dom';

const ContractAuditTrail = () => {
  const { contractId } = useParams();
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/contracts/${contractId}/audit`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAuditLogs(res.data);
      } catch (err) {
        console.error('Failed to load audit logs:', err);
        setError('❌ Could not load audit logs.');
      } finally {
        setLoading(false);
      }
    };
    fetchAuditLogs();
  }, [contractId, token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📑 Contract Audit Trail</h1>

      {loading && <LoadingSpinner />}
      {error && <p className={theme.errorText}>{error}</p>}

      {!loading && !error && auditLogs.length === 0 && (
        <p className="text-gray-500">No audit events recorded.</p>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Timestamp</th>
              <th className="p-2 border">Action</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log._id}>
                <td className="p-2 border">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="p-2 border">{log.action}</td>
                <td className="p-2 border">{log.user?.email || 'Unknown'}</td>
                <td className="p-2 border">{log.ip || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContractAuditTrail;
