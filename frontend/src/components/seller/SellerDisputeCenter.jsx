/**
 * SellerDisputeCenter.jsx
 * Path: frontend/src/components/seller/SellerDisputeCenter.jsx
 * Purpose: Allow sellers to view and manage disputes raised on their listings in a responsive, clean interface.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const SellerDisputeCenter = ({ sellerId }) => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch disputes on mount
  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view disputes');
          setLoading(false);
          toast.error('Authentication required');
          return;
        }

        const response = await axios.get(`/api/disputes/seller/${sellerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDisputes(response.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load disputes');
        setLoading(false);
        toast.error('Error loading disputes');
      }
    };

    fetchDisputes();
  }, [sellerId]);

  if (loading) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Dispute Center</h2>
        <div className="bg-white rounded-xl shadow-md p-6">
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          {disputes.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              No active disputes. Keep up the great work! 🌟
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left text-gray-600">Car</th>
                    <th className="px-4 py-2 text-left text-gray-600">Issue Summary</th>
                    <th className="px-4 py-2 text-left text-gray-600">Status</th>
                    <th className="px-4 py-2 text-left text-gray-600">Created</th>
                    <th className="px-4 py-2 text-left text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {disputes.map((dispute) => (
                    <tr
                      key={dispute.id}
                      className="border-b hover:bg-gray-50 animate-fadeIn"
                    >
                      <td className="px-4 py-2 text-gray-700">
                        {dispute.car?.make} {dispute.car?.model} ({dispute.car?.year})
                      </td>
                      <td className="px-4 py-2 text-gray-700">{dispute.issueSummary}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            dispute.status === 'Open'
                              ? 'bg-yellow-100 text-yellow-700'
                              : dispute.status === 'Resolved'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {dispute.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        {new Date(dispute.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        <Link
                          to={`/seller/dispute/${dispute.id}`}
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                          aria-label={`View details for dispute ${dispute.id}`}
                        >
                          View Details
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

SellerDisputeCenter.propTypes = {
  sellerId: PropTypes.string.isRequired,
};

export default SellerDisputeCenter;