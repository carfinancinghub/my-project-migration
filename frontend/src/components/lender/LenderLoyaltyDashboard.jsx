/**
 * File: LenderLoyaltyDashboard.jsx
 * Path: frontend/src/components/lender/LenderLoyaltyDashboard.jsx
 * Purpose: Gamified dashboard for lenders to track loyalty points, badges, and loan approval rewards
 * Author: SG
 * Date: April 28, 2025
 * Updated: Added SEOHead, used AdminLayout, applied theme.js utilities, enhanced comments and accessibility
 * Cod2 Crown Certified: Yes
 * Features:
 * - Displays loyalty points summary with total points and loan approvals
 * - Shows earned badges with animation effects
 * - Tracks loan approval rewards progress with accessible progress bars
 * - Responsive layout with TailwindCSS, animations, and error/loading states
 * Functions:
 * - fetchLoyaltyData(): Fetches loyalty data (points, badges, rewards) from /api/lender/{lenderId}/loyalty
 * Dependencies: axios, AdminLayout, SEOHead, theme
 */

// Imports
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AdminLayout from '@components/admin/layout/AdminLayout';
import SEOHead from '@components/common/SEOHead';
import { theme } from '@styles/theme';

const LenderLoyaltyDashboard = ({ lenderId }) => {
  // State Management
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Loyalty Data on Component Mount or LenderId Change
  useEffect(() => {
    const fetchLoyaltyData = async () => {
      try {
        const response = await fetch(`/api/lender/${lenderId}/loyalty`);
        if (!response.ok) {
          throw new Error('Failed to fetch loyalty data');
        }
        const data = await response.json();
        setLoyaltyData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLoyaltyData();
  }, [lenderId]);

  // Render Loading State with Accessible Spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" role="status" aria-label="Loading loyalty dashboard">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // Render Error State with Accessible Alert
  if (error) {
    return (
      <div className={`text-red-500 text-center ${theme.spacingMd}`} role="alert" aria-live="assertive">
        Error: {error}
      </div>
    );
  }

  // UI Rendering
  return (
    <AdminLayout>
      <SEOHead title="Lender Loyalty Dashboard - CFH Auction Platform" />
      <div
        className={`bg-white ${theme.cardShadow} ${theme.borderRadius} ${theme.spacingLg} max-w-3xl mx-auto`}
        aria-labelledby="loyalty-dashboard-title"
      >
        {/* Dashboard Header */}
        <h2 id="loyalty-dashboard-title" className="text-2xl font-bold text-gray-800 mb-6">
          Lender Loyalty Dashboard
        </h2>

        {/* Points Summary */}
        <div className="mb-8 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-700 mb-2" id="points-title">
            Loyalty Points
          </h3>
          <div
            className={`flex items-center justify-between bg-blue-100 ${theme.spacingMd} ${theme.borderRadius}`}
            role="region"
            aria-labelledby="points-title"
          >
            <span className="text-2xl font-bold text-blue-600" aria-label={`Total points: ${loyaltyData.points}`}>
              {loyaltyData.points} Points
            </span>
            <span
              className={`${theme.fontSizeSm} text-gray-600`}
              aria-label="Points earned from loan approvals"
            >
              Earned from {loyaltyData.loanApprovals} approvals
            </span>
          </div>
        </div>

        {/* Badges Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4" id="badges-title">
            Badges
          </h3>
          <div
            className="flex flex-wrap gap-3"
            role="region"
            aria-labelledby="badges-title"
          >
            {loyaltyData.badges.length > 0 ? (
              loyaltyData.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`${theme.infoText} bg-purple-100 ${theme.spacingSm} rounded-full animate-pulse-short transition-transform hover:scale-105`}
                  aria-label={`Badge: ${badge.name}`}
                >
                  {badge.name}
                </div>
              ))
            ) : (
              <p className={`${theme.fontSizeSm} text-gray-500`} aria-label="No badges earned">
                No badges earned yet. Approve more loans to unlock!
              </p>
            )}
          </div>
        </div>

        {/* Loan Approval Rewards Progress */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4" id="rewards-title">
            Loan Approval Rewards
          </h3>
          <div
            className="space-y-6"
            role="region"
            aria-labelledby="rewards-title"
          >
            {loyaltyData.rewards.map((reward) => (
              <div
                key={reward.id}
                className="flex flex-col animate-fade-in"
                role="progressbar"
                aria-labelledby={`reward-${reward.id}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 id={`reward-${reward.id}`} className="text-md font-medium text-gray-700">
                    {reward.name}
                  </h4>
                  <span
                    className={`${theme.fontSizeSm} text-gray-500`}
                    aria-label={`Progress: ${reward.progress} of ${reward.target}`}
                  >
                    {reward.progress}/{reward.target}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${(reward.progress / reward.target) * 100}%` }}
                    aria-valuenow={reward.progress}
                    aria-valuemin="0"
                    aria-valuemax={reward.target}
                    aria-label={`Progress for ${reward.name}`}
                  ></div>
                </div>
                <p className={`${theme.fontSizeSm} text-gray-600 mt-1`}>{reward.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// Prop Type Validation
LenderLoyaltyDashboard.propTypes = {
  lenderId: PropTypes.string.isRequired,
};

export default LenderLoyaltyDashboard;