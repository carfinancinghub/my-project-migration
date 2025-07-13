/**
 * SellerEscrowStatus.jsx
 * Path: frontend/src/components/seller/SellerEscrowStatus.jsx
 * Purpose: Display seller's escrow transaction status with links to document uploader.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import PropTypes from 'prop-types';

const SellerEscrowStatus = ({ sellerId }) => {
  const [escrowStatuses, setEscrowStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch escrow status on mount
  useEffect(() => {
    const fetchEscrowStatuses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view escrow status');
          setLoading(false);
          toast.error('Authentication required');
          return;
        }

        const response = await axios.get(`/api/escrow/seller/${sellerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEscrowStatuses(response.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load escrow status');
        setLoading(false);
        toast.error('Error loading escrow statuses');
      }
    };

    fetchEscrowStatuses();
  }, [sellerId]);

  if (loading) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Escrow Status</h2>
        <div className="bg-white rounded-xl shadow-md p-6">
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          {escrowStatuses.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              No active escrow transactions yet. 🚗
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left text-gray-600">Car</th>
                    <th className="px-4 py-2 text-left text-gray-600">Status</th>
                    <th className="px-4 py-2 text-left text-gray-600">Pending Actions</th>
                    <th className="px-4 py-2 text-left text-gray-600">Documents</th>
                  </tr>
                </thead>
                <tbody>
                  {escrowStatuses.map((escrow) => (
                    <tr key={escrow.id} className="border-b hover:bg-gray-50 animate-fadeIn">
                      <td className="px-4 py-2 text-gray-700">
                        {escrow.car?.make} {escrow.car?.model} ({escrow.car?.year})
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            escrow.status === 'Completed'
                              ? 'bg-green-100 text-green-700'
                              : escrow.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {escrow.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        {escrow.pendingActions.length > 0
                          ? escrow.pendingActions.join(', ')
                          : 'None'}
                      </td>
                      <td className="px-4 py-2">
                        <Link
                          to={`/seller/escrow/${escrow.id}/documents`}
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                          aria-label={`Upload/view documents for escrow ${escrow.id}`}
                        >
                          Manage Documents
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `}
      </style>
    </ErrorBoundary>
  );
};

SellerEscrowStatus.propTypes = {
  sellerId: PropTypes.string.isRequired,
};

export default SellerEscrowStatus;
