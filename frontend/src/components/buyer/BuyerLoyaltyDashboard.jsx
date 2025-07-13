/**
 * File: BuyerLoyaltyDashboard.jsx
 * Path: frontend/src/components/buyer/BuyerLoyaltyDashboard.jsx
 * Purpose: Display gamified loyalty dashboard with points, badges, and reward tiers
 * Author: Cod2
 * Date: May 25, 2025
 * Updated: Added SEOHead, used AdminLayout, applied theme.js utilities, enhanced comments and accessibility
 * Cod2 Crown Certified: Yes
 * Features:
 * - Displays loyalty points summary with total points
 * - Shows earned badges with animation effects and icons
 * - Tracks reward tiers progress with accessible progress bars
 * - Responsive layout with TailwindCSS, animations, and error/loading states
 * - Toast notifications for error feedback
 * Functions:
 * - fetchLoyaltyData(): Fetches loyalty data (points, badges, tiers) from /api/buyer/{buyerId}/loyalty
 * Dependencies: axios, toast, LoadingSpinner, ErrorBoundary, AdminLayout, SEOHead, theme
 */

// Imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorBoundary from '@components/common/ErrorBoundary';
import PropTypes from 'prop-types';
import AdminLayout from '@components/admin/layout/AdminLayout';
import SEOHead from '@components/common/SEOHead';
import { theme } from '@styles/theme';

const BuyerLoyaltyDashboard = ({ buyerId }) => {
  // State Management
  const [loyaltyData, setLoyaltyData] = useState({
    points: 0,
    badges: [],
    tiers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Loyalty Data on Component Mount or BuyerId Change
  useEffect(() => {
    const fetchLoyaltyData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view loyalty dashboard');
          setLoading(false);
          toast.error('Authentication required');
          return;
        }

        const response = await axios.get(`/api/buyer/${buyerId}/loyalty`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLoyaltyData(response.data || { points: 0, badges: [], tiers: [] });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load loyalty data');
        setLoading(false);
        toast.error('Error loading loyalty data');
      }
    };

    fetchLoyaltyData();
  }, [buyerId]);

  // Render Loading State
  if (loading) return <LoadingSpinner />;

  // UI Rendering
  return (
    <AdminLayout>
      <SEOHead title="Buyer Loyalty Dashboard - CFH Auction Platform" />
      <ErrorBoundary>
        <div className={`container mx-auto ${theme.spacingMd} sm:${theme.spacingLg}`}>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loyalty Dashboard</h2>
          <div className={`bg-white rounded-xl ${theme.cardShadow} ${theme.spacingLg}`}>
            {error && <div className={`${theme.errorText} text-center mb-4`}>{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Points and Tiers */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Points</h3>
                <p className="text-2xl font-bold text-blue-500">{loyaltyData.points} Points</p>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Reward Tiers</h3>
                {loyaltyData.tiers.length === 0 ? (
                  <p className="text-gray-500">No reward tiers available yet.</p>
                ) : (
                  <div className="space-y-4">
                    {loyaltyData.tiers.map((tier) => (
                      <div key={tier.id} className="animate-fadeIn">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">{tier.name}</span>
                          <span className={`${theme.fontSizeSm} text-gray-500`}>{tier.pointsRequired} Points</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                (loyaltyData.points / tier.pointsRequired) * 100,
                                100
                              )}%`,
                            }}
                            role="progressbar"
                            aria-valuenow={loyaltyData.points}
                            aria-valuemin="0"
                            aria-valuemax={tier.pointsRequired}
                            aria-label={`Progress towards ${tier.name}`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Badges */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Earned Badges</h3>
                {loyaltyData.badges.length === 0 ? (
                  <p className="text-gray-500">
                    No badges earned yet. Keep buying to unlock rewards! 🏆
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {loyaltyData.badges.map((badge) => (
                      <div
                        key={badge.id}
                        className={`bg-gray-100 ${theme.borderRadius} ${theme.spacingSm} hover:shadow-lg transition-shadow animate-badgeUnlock`}
                        role="region"
                        aria-label={`Badge: ${badge.name}`}
                      >
                        <img
                          src={badge.iconUrl || 'https://via.placeholder.com/50'}
                          alt={`${badge.name} icon`}
                          className="w-10 h-10 mx-auto mb-2"
                        />
                        <p className={`${theme.fontSizeSm} font-semibold text-gray-800 text-center`}>
                          {badge.name}
                        </p>
                        <p className={`${theme.fontSizeSm} text-gray-600 text-center`}>{badge.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
            @keyframes badgeUnlock {
              0% { opacity: 0; transform: scale(0.8); }
              100% { opacity: 1; transform: scale(1); }
            }
            .animate-badgeUnlock {
              animation: badgeUnlock 0.5s ease-out;
            }
          `}
        </style>
      </ErrorBoundary>
    </AdminLayout>
  );
};

// Prop Type Validation
BuyerLoyaltyDashboard.propTypes = {
  buyerId: PropTypes.string.isRequired,
};

export default BuyerLoyaltyDashboard;