// File: AdminPaymentOverview.jsx
// Path: frontend/src/components/admin/payments/AdminPaymentOverview.jsx
// 👑 Cod1 Crown Certified — Admin Payment Overview Panel (Crown Refactor)

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ErrorBoundary from '@/components/common/ErrorBoundary.jsx';
import Card from '@/components/common/Card.jsx';
import Button from '@/components/common/Button.jsx';

// 🌟 AdminPaymentOverview: View Financial Summaries
const AdminPaymentOverview = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Fetch Payment Data
  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/payments/overview', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(res.data);
    } catch (err) {
      console.error('Error fetching payment overview:', err);
      setError('Failed to load payment overview.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // 🔄 UI Logic
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-10">
        {error}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">💳 Payment Overview</h1>

        {payments.length === 0 ? (
          <p className="text-gray-500 text-center">No payment records found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {payments.map((payment) => {
              const formattedDate = new Date(payment.date).toLocaleDateString();
              return (
                <Card key={payment._id || payment.date} className="hover:shadow-lg p-4 space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-xl font-semibold">{formattedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Volume</p>
                    <p className="text-lg font-bold">${payment.totalVolume.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Transactions</p>
                    <p className="text-lg font-bold">{payment.transactionCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Average Amount</p>
                    <p className="text-lg font-bold">${payment.averageAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fees Collected</p>
                    <p className="text-lg font-bold">${payment.feesCollected.toFixed(2)}</p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => alert(`Viewing details for ${formattedDate}`)}
                    aria-label={`View details for payments on ${formattedDate}`}
                  >
                    View Details
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AdminPaymentOverview;
