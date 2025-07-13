// File: LenderReviewDashboard.js
// Path: frontend/src/components/lender/LenderReviewDashboard.js
// 👑 Cod1 Crown Certified — Contract Review Suite with Bonus Enhancements

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { theme } from '../../styles/theme';

const LenderReviewDashboard = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/contracts/review`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContracts(res.data);
      } catch (err) {
        console.error('Error fetching contracts:', err);
        setError('❌ Unable to load contracts');
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, [token]);

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = search.trim() === '' || contract.buyerEmail?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === '' || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = (id, action) => {
    alert(`${action} contract ${id}`);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📑 Lender Contract Review</h1>

      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Buyer Email..."
          className="border rounded px-3 py-1 w-full sm:w-64"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className={theme.errorText}>{error}</p>}

      {!loading && filteredContracts.length === 0 && (
        <p className="text-gray-500">No contracts match the criteria.</p>
      )}

      {!loading && filteredContracts.length > 0 && (
        <div className="grid gap-4">
          {filteredContracts.map(contract => (
            <Card key={contract._id} className="p-4 space-y-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-lg">Buyer: {contract.buyerEmail}</p>
                  <p>Status: <span className="font-medium text-blue-600">{contract.status}</span></p>
                  <p>Date: {new Date(contract.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="space-y-2 flex flex-col items-end">
                  <Button onClick={() => handleAction(contract._id, '✅ Approve')} variant="success">Approve</Button>
                  <Button onClick={() => handleAction(contract._id, '❌ Reject')} variant="danger">Reject</Button>
                  <Button onClick={() => handleAction(contract._id, '📄 Export PDF')} variant="outline">Export PDF</Button>
                  <Button onClick={() => handleAction(contract._id, '🔎 View Audit')} variant="secondary">View Audit</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LenderReviewDashboard;
