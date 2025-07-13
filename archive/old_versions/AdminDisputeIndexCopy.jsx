// File: AdminDisputeIndex.js
// Path: frontend/src/components/AdminDisputeIndex.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../utils/useAuth';

const AdminDisputeIndex = () => {
  const { token, role } = useAuth();
  const [disputes, setDisputes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const res = await axios.get('/api/disputes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDisputes(res.data);
      } catch (err) {
        console.error('Failed to fetch disputes:', err);
        setError('Unable to load disputes.');
      }
    };

    if (role === 'admin') fetchDisputes();
  }, [token, role]);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString() + ' ' + new Date(iso).toLocaleTimeString();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Disputes (Admin View)</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        {disputes.map((d) => (
          <div key={d._id} className="border p-4 rounded-xl bg-white shadow space-y-1">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">Dispute #{d._id.slice(-6).toUpperCase()}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                d.status === 'open' ? 'bg-yellow-100 text-yellow-700' :
                d.status === 'resolved' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {d.status}
              </span>
            </div>
            <p>Created: {formatDate(d.createdAt)}</p>
            <p>Parties: {d.buyerName} vs {d.sellerName}</p>
            <p>Assigned Judges: {d.assignedJudges?.length || 0}</p>
            <p>Reason: {d.reason}</p>
            {d.resolution && (
              <p className="text-green-600 font-medium">Resolution: {d.resolution}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDisputeIndex;
