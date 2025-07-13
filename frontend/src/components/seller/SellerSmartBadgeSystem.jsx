/**
 * SellerSmartBadgeSystem.jsx
 * Path: frontend/src/components/seller/SellerSmartBadgeSystem.jsx
 * Purpose: Analyze seller KPIs (listings, offers, auctions, contracts) and award dynamic badges with gamified animations.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const badgeDefinitions = [
  {
    name: 'Listing Pro',
    icon: '📝',
    condition: (data) => data.totalListings >= 5,
    description: 'Created 5+ listings',
  },
  {
    name: 'Offer Magnet',
    icon: '💬',
    condition: (data) => data.totalOffers >= 10,
    description: 'Received 10+ offers',
  },
  {
    name: 'Top Seller',
    icon: '🚗',
    condition: (data) => data.totalContracts >= 5,
    description: 'Sold 5+ cars',
  },
  {
    name: 'Auction Master',
    icon: '🔨',
    condition: (data) => data.totalAuctions >= 5,
    description: 'Started 5+ auctions',
  },
  {
    name: 'Deal Closer',
    icon: '✍️',
    condition: (data) => data.totalContracts >= 5,
    description: 'Signed 5+ contracts',
  },
];

// Custom hook for count-up animation
const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16); // 60fps
    const animate = () => {
      start += increment;
      if (start >= end) {
        setCount(end);
        return;
      }
      setCount(Math.floor(start));
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
};

const SellerSmartBadgeSystem = () => {
  const [activityData, setActivityData] = useState({
    totalListings: 0,
    totalOffers: 0,
    totalAuctions: 0,
    totalContracts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view activity insights');
          setIsLoading(false);
          return;
        }
        const response = await axios.get('/api/seller/activity-insights', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActivityData(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load activity insights');
        setIsLoading(false);
        toast.error('Error loading activity insights');
      }
    };
    fetchActivityData();
  }, []);

  // Determine awarded badges
  const awardedBadges = badgeDefinitions.filter((badge) =>
    badge.condition(activityData)
  );

  // Count-up animations for KPIs
  const listingCount = useCountUp(activityData.totalListings);
  const offerCount = useCountUp(activityData.totalOffers);
  const auctionCount = useCountUp(activityData.totalAuctions);
  const contractCount = useCountUp(activityData.totalContracts);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Your Achievements
        </h1>
        {/* KPI Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 animate-fadeIn">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Stats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-lg font-medium text-gray-700">{listingCount}</p>
              <p className="text-sm text-gray-500">Listings</p>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">{offerCount}</p>
              <p className="text-sm text-gray-500">Offers</p>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">{auctionCount}</p>
              <p className="text-sm text-gray-500">Auctions</p>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">{contractCount}</p>
              <p className="text-sm text-gray-500">Contracts</p>
            </div>
          </div>
        </div>
        {/* Badges */}
        <div className="bg-white rounded-xl shadow-md p-6 animate-fadeIn">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Badges Earned
          </h2>
          {awardedBadges.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              No badges earned yet. Keep pushing! 🚀
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6">
              {awardedBadges.map((badge, index) => (
                <div
                  key={badge.name}
                  className="relative bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-md w-48 animate-popIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-sparkle"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl mb-2">{badge.icon}</span>
                    <h3 className="text-lg font-semibold">{badge.name}</h3>
                    <p className="text-xs text-center">{badge.description}</p>
                  </div>
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
          @keyframes popIn {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-popIn {
            animation: popIn 0.5s ease-out forwards;
          }
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1.5); }
          }
          .animate-sparkle {
            animation: sparkle 1.5s infinite;
          }
        `}
      </style>
    </ErrorBoundary>
  );
};

export default SellerSmartBadgeSystem;