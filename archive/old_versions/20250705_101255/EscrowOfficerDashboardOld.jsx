// File: EscrowOfficerDashboard.jsx
// Path: frontend/src/components/escrow/EscrowOfficerDashboard.jsx
// 
// Features:
// - Escrow Officer view of active escrow transactions
// - Ability to Release Funds, Hold/Flag a transaction, View Full Details
// - Secure token-protected API requests
// - Responsive Card layout for transactions
// - Crown UI/UX polish: hover effects, flex spacing, error and loading states
// - Integrated modal for detailed transaction view

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import EscrowTransactionDetailModal from '@/components/escrow/EscrowTransactionDetailModal';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const EscrowOfficerDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEscrow, setSelectedEscrow] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/escrow-transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(res.data);
      } catch (err) {
        console.error('Error loading escrow transactions:', err);
        setError('❌ Failed to load escrow data');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [token]);

  const handleAction = async (id, action) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/escrow-transactions/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/escrow-transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data);
    } catch (err) {
      console.error(`Failed to ${action} transaction`, err);
      alert(`❌ Failed to ${action} transaction`);
    }
  };

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-indigo-700">🔐 Escrow Officer Dashboard</h1>

          {loading && (
            <div className="flex justify-center items-center min-h-[50vh]">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <p className="text-center text-red-600 py-4">{error}</p>
          )}

          {!loading && !error && transactions.length === 0 && (
            <p className="text-center text-gray-500">No active escrow transactions.</p>
          )}

          {!loading && !error && transactions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transactions.map((tx) => (
                <Card key={tx._id} className="flex flex-col justify-between p-4">
                  <div className="space-y-2">
                    <p><strong>Deal ID:</strong> {tx.dealId || 'N/A'}</p>
                    <p><strong>Status:</strong> {tx.status}</p>
                    <p><strong>Buyer:</strong> {tx.buyer?.email || 'Unknown'}</p>
                    <p><strong>Seller:</strong> {tx.seller?.email || 'Unknown'}</p>
                    <p><strong>Amount:</strong> ${tx.amount?.toLocaleString() || '0.00'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button onClick={() => handleAction(tx._id, 'release')} className="bg-green-600 hover:bg-green-700">
                      ✅ Release Funds
                    </Button>
                    <Button onClick={() => handleAction(tx._id, 'hold')} className="bg-red-600 hover:bg-red-700">
                      ❌ Hold / Flag
                    </Button>
                    <Button onClick={() => setSelectedEscrow(tx)} className="bg-blue-600 hover:bg-blue-700">
                      🔍 View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Modal to View Escrow Details */}
          {selectedEscrow && (
            <EscrowTransactionDetailModal
              escrow={selectedEscrow}
              onClose={() => setSelectedEscrow(null)}
            />
          )}
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default EscrowOfficerDashboard;
