/**
 * SellerEngagementLeaderboard.jsx
 * Path: frontend/src/components/seller/SellerEngagementLeaderboard.jsx
 * Purpose: Display a ranked leaderboard of top sellers with sortable columns and animated entrance.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const SellerEngagementLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'listingsCreated', direction: 'desc' });

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/seller/leaderboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaderboard(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load leaderboard');
        setIsLoading(false);
        toast.error('Error loading leaderboard');
      }
    };
    fetchLeaderboard();
  }, []);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      const direction = prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc';
      return { key, direction };
    });

    setLeaderboard((prev) =>
      [...prev].sort((a, b) => {
        if (a[key] < b[key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      })
    );
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '';
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Seller Leaderboard</h1>
        {leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No leaderboard data available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Seller
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                    onClick={() => handleSort('listingsCreated')}
                  >
                    Listings Created {getSortIndicator('listingsCreated')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                    onClick={() => handleSort('carsSold')}
                  >
                    Cars Sold {getSortIndicator('carsSold')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                    onClick={() => handleSort('auctionWins')}
                  >
                    Auction Wins {getSortIndicator('auctionWins')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                    onClick={() => handleSort('communityPoints')}
                  >
                    Community Points {getSortIndicator('communityPoints')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((seller, index) => (
                  <tr
                    key={seller.id}
                    className="border-b hover:bg-gray-50 animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      {index < 3 ? (
                        <span className="text-2xl">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                      ) : (
                        index + 1
                      )}
                    </td>
                    <td className="px-6 py-4">{seller.sellerName}</td>
                    <td className="px-6 py-4">{seller.listingsCreated}</td>
                    <td className="px-6 py-4">{seller.carsSold}</td>
                    <td className="px-6 py-4">{seller.auctionWins}</td>
                    <td className="px-6 py-4">{seller.communityPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}
      </style>
    </ErrorBoundary>
  );
};

export default SellerEngagementLeaderboard;