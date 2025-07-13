// File: LenderInsightsPanel.js
// Path: frontend/src/components/lender/LenderInsightsPanel.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { theme } from '../../styles/theme';

const LenderInsightsPanel = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/lender/bids`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBids(res.data);
      } catch (err) {
        console.error('Failed to fetch lender bids:', err);
        setError('❌ Error fetching bids');
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, []);

  const filteredBids = bids.filter(bid => {
    if (filter === 'all') return true;
    return bid.status === filter;
  });

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Bid ID,Car ID,Amount,Status'].concat(
        filteredBids.map(b => `${b._id},${b.carId},${b.amount},${b.status}`)
      ).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'lender_bids.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📊 Lender Insights Panel</h2>
      <div className="flex items-center gap-4 mb-4">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border px-3 py-1 rounded">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="rejected">Rejected</option>
          <option value="accepted">Accepted</option>
        </select>
        <Button variant="secondary" onClick={handleExport}>Export CSV</Button>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className={theme.errorText}>{error}</p>}

      {!loading && !error && filteredBids.length === 0 && (
        <p className="text-gray-500">No bids matching the filter.</p>
      )}

      {!loading && !error && filteredBids.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBids.map(bid => (
            <Card key={bid._id}>
              <p><strong>Car ID:</strong> {bid.carId}</p>
              <p><strong>Amount:</strong> ${bid.amount}</p>
              <p><strong>Status:</strong> {bid.status}</p>
              <p className="text-xs text-gray-500 mt-1">Created: {new Date(bid.createdAt).toLocaleString()}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LenderInsightsPanel;
