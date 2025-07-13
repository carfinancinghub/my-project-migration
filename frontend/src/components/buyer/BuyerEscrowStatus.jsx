/**
 * BuyerEscrowStatus.jsx
 * Path: frontend/src/components/buyer/BuyerEscrowStatus.jsx
 * Purpose: Display escrow transaction status for buyers with links to delivery confirmation.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import PropTypes from 'prop-types';

const BuyerEscrowStatus = ({ buyerId }) => {
  const [escrowStatuses, setEscrowStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch escrow status on component mount
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

        // Fetch escrow statuses from API
        const response = await axios.get(`/api/escrow/buyer/${buyerId}`, {
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
  }, [buyerId]);

  if (loading) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Escrow Status</h2>
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
                    <th className="px-4 py-2 text-left text-gray-600">Escrow Status</th>
                    <th className="px-4 py-2 text-left text-gray-600">Next Steps</th>
                    <th className="px-4 py-2 text-left text-gray-600">Confirm Delivery</th>
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
                            escrow.status === 'Funds Held'
                              ? 'bg-blue-100 text-blue-700'
                              : escrow.status === 'Delivery Pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : escrow.status === 'Completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {escrow.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        {escrow.nextSteps.length > 0
                          ? escrow.nextSteps.join(', ')
                          : 'None'}
                      </td>
                      <td className="px-4 py-2">
                        <Link
                          to={`/buyer/delivery-confirmation/${escrow.id}`}
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                          aria-label={`Confirm delivery for escrow ${escrow.id}`}
                        >
                          Confirm Delivery
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

BuyerEscrowStatus.propTypes = {
  buyerId: PropTypes.string.isRequired,
};

export default BuyerEscrowStatus;
