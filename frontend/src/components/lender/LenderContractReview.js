// File: LenderContractReview.js
// Path: frontend/src/components/lender/LenderContractReview.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../admin/layout/AdminLayout';
import LoadingSpinner from '../../common/LoadingSpinner';
import Button from '../../common/Button';

const LenderContractReview = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/lender/contracts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContracts(res.data);
      } catch (err) {
        setError('❌ Failed to load lender contracts');
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/lender/contracts/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContracts((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert('❌ Approval failed');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/lender/contracts/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContracts((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert('❌ Rejection failed');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">📑 Contract Approval Queue</h1>
        {loading && <LoadingSpinner />}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && contracts.length === 0 && (
          <p className="text-gray-500">No pending contracts.</p>
        )}

        {!loading && !error && contracts.length > 0 && (
          <ul className="space-y-4">
            {contracts.map((c) => (
              <li key={c._id} className="border p-4 rounded shadow">
                <p><strong>Buyer:</strong> {c.buyer?.email}</p>
                <p><strong>Amount:</strong> ${c.amount}</p>
                <p><strong>Status:</strong> {c.status}</p>
                <div className="mt-2 space-x-2">
                  <Button variant="success" onClick={() => handleApprove(c._id)}>✅ Approve</Button>
                  <Button variant="danger" onClick={() => handleReject(c._id)}>❌ Reject</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminLayout>
  );
};

export default LenderContractReview;
