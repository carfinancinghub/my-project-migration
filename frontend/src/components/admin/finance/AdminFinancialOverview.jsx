// File: AdminFinancialOverview.jsx
// Path: frontend/src/components/admin/finance/AdminFinancialOverview.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/common/Navbar';

const AdminFinancialOverview = () => {
  const [financials, setFinancials] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFinancials = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/financial-overview`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFinancials(res.data);
      } catch (err) {
        console.error('Failed to load financials', err);
        setError('❌ Unable to fetch financial data');
      } finally {
        setLoading(false);
      }
    };
    fetchFinancials();
  }, [token]);

  if (loading) return <div className="p-6">Loading financial data...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div>
      <Navbar />
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold mb-6">Financial Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-gray-500">Total Escrow Balance</p>
              <h2 className="text-xl font-semibold">${financials?.escrowBalance.toFixed(2) || '0.00'}</h2>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-gray-500">Platform Fees Collected</p>
              <h2 className="text-xl font-semibold">${financials?.platformFees.toFixed(2) || '0.00'}</h2>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-gray-500">Total Payouts Completed</p>
              <h2 className="text-xl font-semibold">${financials?.payoutsCompleted.toFixed(2) || '0.00'}</h2>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-gray-500">Pending Payout Requests</p>
              <h2 className="text-xl font-semibold">{financials?.pendingPayoutRequests || 0}</h2>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-gray-500">Dispute-Related Holds</p>
              <h2 className="text-xl font-semibold">${financials?.disputeHolds.toFixed(2) || '0.00'}</h2>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminFinancialOverview;
