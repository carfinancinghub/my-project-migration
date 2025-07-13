/**
 * File: AnalyticsDashboard.jsx
 * Path: frontend/src/components/analytics/AnalyticsDashboard.jsx
 * Purpose: Display analytics dashboard for user and auction insights
 * Author: Rivers Auction Dev Team
 * Date: 2025-05-24
 * Updated: Added SEOHead, used AdminLayout, applied theme.js utilities, enhanced comments and accessibility
 * Cod2 Crown Certified: Yes
 * Features:
 * - Displays user insights for the last 30 days
 * - Shows auction-specific insights if auctionId is provided
 * - Responsive layout with TailwindCSS and error/loading states
 * Functions:
 * - fetchData(): Fetches user and auction insights from /api/analytics endpoints
 * Dependencies: logger, getUserInsights, getAuctionInsights, AdminLayout, SEOHead, theme
 */

// Imports
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { getUserInsights, getAuctionInsights } from '@services/api/analytics';
import AdminLayout from '@components/admin/layout/AdminLayout';
import SEOHead from '@components/common/SEOHead';
import { theme } from '@styles/theme';

const AnalyticsDashboard = ({ userId, auctionId }) => {
  // State Management
  const [userInsights, setUserInsights] = useState(null);
  const [auctionInsights, setAuctionInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Analytics Data on Component Mount or UserId/AuctionId Change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Last 30 days
        const endDate = new Date().toISOString().split('T')[0];

        const userData = await getUserInsights(userId, startDate, endDate);
        setUserInsights(userData.insights);

        if (auctionId) {
          const auctionData = await getAuctionInsights(auctionId);
          setAuctionInsights(auctionData.insights);
        }

        logger.info(`[AnalyticsDashboard] Fetched analytics data for userId: ${userId}, auctionId: ${auctionId || 'N/A'}`);
      } catch (err) {
        logger.error(`[AnalyticsDashboard] Failed to fetch analytics data for userId ${userId}: ${err.message}`, err);
        setError('Failed to load analytics data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId, auctionId]);

  // Render Loading State
  if (isLoading) return <div className={`${theme.spacingMd} text-center text-gray-500`} aria-live="polite">Loading analytics...</div>;

  // Render Error State
  if (error) return <div className={`${theme.spacingMd} text-center ${theme.errorText} bg-red-100 border border-red-300 ${theme.borderRadius}`} role="alert">{error}</div>;

  // UI Rendering
  return (
    <AdminLayout>
      <SEOHead title="Analytics Dashboard - CFH Auction Platform" />
      <div className={`bg-white ${theme.cardShadow} ${theme.borderRadius} ${theme.spacingLg} border border-gray-200 max-w-2xl mx-auto my-8`}>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Analytics Dashboard</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">User Insights (Last 30 Days)</h3>
            {userInsights && userInsights.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {userInsights.map((insight, index) => (
                  <li key={index} className="text-gray-600">{insight}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No user insights available.</p>
            )}
          </div>
          {auctionId && (
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Auction Insights</h3>
              {auctionInsights && auctionInsights.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {auctionInsights.map((insight, index) => (
                    <li key={index} className="text-gray-600">{insight}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No auction insights available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

// Prop Type Validation
AnalyticsDashboard.propTypes = {
  userId: PropTypes.string.isRequired,
  auctionId: PropTypes.string,
};

export default AnalyticsDashboard;