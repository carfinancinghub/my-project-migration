// File: AdminEscrowMonitor.jsx
// Path: frontend/src/components/admin/escrow/AdminEscrowMonitor.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

const AdminEscrowMonitor = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/escrow/transactions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTransactions(res.data);
      } catch (err) {
        console.error('Error fetching escrow transactions:', err);
        setError('❌ Failed to load escrow transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [token]);

  const handleViewDetails = (transactionId) => {
    console.log('Viewing details for transaction:', transactionId);
    // Future: Open modal or navigate to transaction detail page
  };

  const handleReleaseFunds = (transactionId) => {
    console.log('Releasing funds for transaction:', transactionId);
    // Future: Trigger API call to release funds
  };

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-indigo-700">🔒 Escrow Transactions Monitor</h1>

          {loading && (
            <div className="flex justify-center items-center min-h-[50vh]">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <p className="text-center text-red-600 py-4">{error}</p>
          )}

          {!loading && !error && transactions.length === 0 && (
            <p className="text-center text-gray-500">No escrow transactions found.</p>
          )}

          {!loading && !error && transactions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transactions.map((tx) => (
                <Card key={tx._id} className="flex flex-col justify-between p-4">
                  <div className="space-y-2">
                    <p><strong>ID:</strong> {tx._id}</p>
                    <p><strong>Amount:</strong> ${tx.amount.toFixed(2)}</p>
                    <p><strong>Status:</strong> {tx.status}</p>
                    <p><strong>Initiated:</strong> {new Date(tx.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => handleViewDetails(tx._id)}>
                      View Details
                    </Button>
                    {tx.status === 'pending' && (
                      <Button onClick={() => handleReleaseFunds(tx._id)} className="bg-green-600 hover:bg-green-700">
                        Release Funds
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default AdminEscrowMonitor;
