/**
 * File: PremiumDashboard.jsx
 * Path: frontend/src/components/premium/PremiumDashboard.jsx
 * Purpose: Display a dashboard for premium users with Wow++ features
 * Author: Rivers Auction Dev Team
 * Date: 2025-05-24
 * Updated: Added SEOHead, used AdminLayout, applied theme.js utilities, enhanced comments and accessibility
 * Cod2 Crown Certified: Yes
 * Features:
 * - Displays a list of premium features with names, descriptions, and access links
 * - Responsive layout with TailwindCSS and error/loading states
 * Functions:
 * - fetchFeatures(): Fetches premium features for the user from /api/premium endpoint
 * Dependencies: logger, getPremiumFeatures, AdminLayout, SEOHead, theme
 */

// Imports
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { getPremiumFeatures } from '@services/api/premium';
import AdminLayout from '@components/admin/layout/AdminLayout';
import SEOHead from '@components/common/SEOHead';
import { theme } from '@styles/theme';

const PremiumDashboard = ({ userId }) => {
  // State Management
  const [features, setFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Premium Features on Component Mount or UserId Change
  useEffect(() => {
    const fetchFeatures = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const premiumFeatures = await getPremiumFeatures(userId);
        setFeatures(premiumFeatures);
        logger.info(`[PremiumDashboard] Fetched premium features for userId: ${userId}`);
      } catch (err) {
        logger.error(`[PremiumDashboard] Failed to fetch premium features for userId ${userId}: ${err.message}`, err);
        setError('Failed to load premium features. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatures();
  }, [userId]);

  // Render Loading State
  if (isLoading) return <div className={`${theme.spacingMd} text-center text-gray-500`} aria-live="polite">Loading premium dashboard...</div>;

  // Render Error State
  if (error) return <div className={`${theme.spacingMd} text-center ${theme.errorText} bg-red-100 border border-red-300 ${theme.borderRadius}`} role="alert">{error}</div>;

  // UI Rendering
  return (
    <AdminLayout>
      <SEOHead title="Premium Dashboard - CFH Auction Platform" />
      <div className={`bg-white ${theme.borderRadius} ${theme.spacingLg} border border-gray-200 max-w-2xl mx-auto my-8`} role="region" aria-label="Premium Dashboard">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Your Premium Dashboard</h2>
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Wow++ Features</h3>
          {features.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="text-gray-600">
                  <span className="font-medium">{feature.name}</span>: {feature.description}
                  <a
                    href={feature.link}
                    className="text-blue-500 hover:underline ml-2"
                    aria-label={`Access ${feature.name} feature`}
                  >
                    Access Now
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No premium features available.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

// Prop Type Validation
PremiumDashboard.propTypes = {
  userId: PropTypes.string.isRequired
};

export default PremiumDashboard;