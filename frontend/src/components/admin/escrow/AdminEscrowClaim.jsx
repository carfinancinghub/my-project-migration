// File: AdminEscrowClaim.jsx
// Path: frontend/src/components/admin/escrow/AdminEscrowClaim.jsx
// 
// Features:
// - Displays escrow claims awaiting admin action
// - Allows admin to Approve or Reject escrow claims
// - Token-protected API requests
// - Responsive UI with Card components for each claim
// - Crown UI/UX polish with hover, spacing, and button styling

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

const AdminEscrowClaim = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/escrow/claims`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClaims(res.data);
      } catch (err) {
        console.error('Error fetching escrow claims:', err);
        setError('❌ Failed to load escrow claims');
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, [token]);

  const handleAction = async (id, action) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/escrow/claims/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClaims((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(`Error ${action} claim:`, err);
      alert(`❌ Failed to ${action} claim`);
    }
  };

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-indigo-700">🔑 Escrow Claims Management</h1>

          {loading && (
            <div className="flex justify-center items-center min-h-[50vh]">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <p className="text-center text-red-600 py-4">{error}</p>
          )}

          {!loading && !error && claims.length === 0 && (
            <p className="text-center text-gray-500">No escrow claims awaiting review.</p>
          )}

          {!loading && !error && claims.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {claims.map((claim) => (
                <Card key={claim._id} className="flex flex-col justify-between p-4">
                  <div className="space-y-2">
                    <p><strong>Claim ID:</strong> {claim._id}</p>
                    <p><strong>Amount:</strong> ${claim.amount.toFixed(2)}</p>
                    <p><strong>Requested By:</strong> {claim.requestedBy?.email || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{new Date(claim.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => handleAction(claim._id, 'approve')} className="bg-green-600 hover:bg-green-700">
                      Approve
                    </Button>
                    <Button onClick={() => handleAction(claim._id, 'reject')} className="bg-red-600 hover:bg-red-700">
                      Reject
                    </Button>
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

export default AdminEscrowClaim;
