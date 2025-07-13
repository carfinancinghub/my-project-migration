// File: AdminInsights.js
// Path: frontend/src/components/AdminInsights.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const AdminInsights = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/insights`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMetrics(res.data);
      } catch (err) {
        setError('❌ Failed to load platform insights');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Platform Insights</h1>
        {loading && <p>Loading insights...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InsightCard label="Total Users" value={metrics.totalUsers} />
            <InsightCard label="Verified Users" value={metrics.verifiedUsers} />
            <InsightCard label="Active Auctions" value={metrics.activeAuctions} />
            <InsightCard label="Pending Disputes" value={metrics.pendingDisputes} />
            <InsightCard label="Storage Listings" value={metrics.storageListings} />
            <InsightCard label="Contracts Signed" value={metrics.contractsSigned} />
          </div>
        )}
      </div>
    </div>
  );
};

const InsightCard = ({ label, value }) => (
  <div className="p-4 border rounded shadow bg-white">
    <h2 className="text-lg font-semibold text-gray-800">{label}</h2>
    <p className="text-2xl font-bold text-blue-600 mt-2">{value ?? '--'}</p>
  </div>
);

export default AdminInsights;
