/**
 * SellerBadgesPage.jsx
 * Path: frontend/src/components/seller/SellerBadgesPage.jsx
 * Purpose: Display seller's earned badges in a responsive, visually appealing grid.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const SellerBadgesPage = ({ sellerId }) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch badges on mount
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view badges');
          setLoading(false);
          toast.error('Authentication required');
          return;
        }

        const response = await axios.get(`/api/sellers/${sellerId}/badges`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBadges(response.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load badges');
        setLoading(false);
        toast.error('Error loading badges');
      }
    };

    fetchBadges();
  }, [sellerId]);

  if (loading) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Badges</h2>
        <div className="bg-white rounded-xl shadow-md p-6">
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          {badges.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              No badges earned yet. Keep selling to unlock achievements! 🏆
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-gray-100 rounded-lg p-4 hover:shadow-lg transition-shadow animate-fadeIn"
                  role="region"
                  aria-label={`Badge: ${badge.name}`}
                >
                  <img
                    src={badge.iconUrl || 'https://via.placeholder.com/50'}
                    alt={`${badge.name} icon`}
                    className="w-12 h-12 mx-auto mb-2"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 text-center">{badge.name}</h3>
                  <p className="text-sm text-gray-600 text-center">{badge.description}</p>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
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

SellerBadgesPage.propTypes = {
  sellerId: PropTypes.string.isRequired,
};

export default SellerBadgesPage;