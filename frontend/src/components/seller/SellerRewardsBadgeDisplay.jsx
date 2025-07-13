/**
 * SellerRewardsBadgeDisplay.jsx
 * Path: frontend/src/components/seller/SellerRewardsBadgeDisplay.jsx
 * Purpose: Showcase seller's earned and locked badges in an animated, responsive gallery.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const SellerRewardsBadgeDisplay = () => {
  const [badges, setBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/seller/badges', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBadges(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load badges');
        setIsLoading(false);
        toast.error('Error loading badges');
      }
    };
    fetchBadges();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  const earnedBadges = badges.filter((badge) => badge.status === 'Earned');
  const lockedBadges = badges.filter((badge) => badge.status === 'Locked');

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Badges</h1>
        {earnedBadges.length === 0 && lockedBadges.length === 0 ? (
          <div className="text-center py-12">
            <img
              src="/empty-badges.svg"
              alt="No badges"
              className="mx-auto h-32 w-32 mb-4 opacity-50"
            />
            <p className="text-gray-500 text-lg">Start earning your first badge! 🚀</p>
          </div>
        ) : (
          <>
            {earnedBadges.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Earned Badges</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {earnedBadges.map((badge, index) => (
                    <div
                      key={badge.id}
                      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow animate-popIn"
                      style={{ animationDelay: `${index * 100}ms` }}
                      aria-label={`Earned badge: ${badge.name}`}
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-4xl">{badge.icon || '🏅'}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{badge.name}</h3>
                          <p className="text-gray-600 text-sm">{badge.description}</p>
                          <p className="text-gray-500 text-sm mt-1">
                            Earned: {new Date(badge.earnedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {lockedBadges.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Locked Badges</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lockedBadges.map((badge, index) => (
                    <div
                      key={badge.id}
                      className="bg-gray-100 rounded-xl shadow-md p-6 opacity-60 hover:shadow-lg transition-shadow animate-popIn"
                      style={{ animationDelay: `${(index + earnedBadges.length) * 100}ms` }}
                      aria-label={`Locked badge: ${badge.name}`}
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-4xl">{badge.icon || '🔒'}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-600">{badge.name}</h3>
                          <p className="text-gray-500 text-sm">{badge.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <style>
        {`
          @keyframes popIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-popIn {
            animation: popIn 0.3s ease-out forwards;
          }
        `}
      </style>
    </ErrorBoundary>
  );
};

export default SellerRewardsBadgeDisplay;