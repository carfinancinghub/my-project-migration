// File: PremiumFeature.jsx
// Path: frontend/src/components/common/PremiumFeature.jsx
// Purpose: Gate premium features based on user roles and plan tiers
// Author: Cod2
// Date: 2025-05-01
// 👑 Cod2 Crown Certified

import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import useAuth from '@/utils/useAuth';

// Mocked feature flags by plan
const featureFlags = {
  disputeSimulator: ['pro', 'enterprise'],
  aiSummaryInsights: ['premium', 'pro', 'enterprise'],
  exportPDF: ['premium', 'pro', 'enterprise'],
  multilingual: ['enterprise'],
  aiDisputeTrends: ['pro', 'enterprise'],
  disputeNotifications: ['premium', 'pro', 'enterprise'],
};

/**
 * PremiumFeature component wraps children in premium-access logic.
 * If user's plan includes the feature, content is rendered; otherwise a fallback appears.
 */
const PremiumFeature = ({ feature = null, children }) => {
  const { user } = useAuth();

  // Default logic: allow premium or admin users if no feature specified
  const isAuthorized =
    user?.role === 'admin' ||
    user?.plan === 'premium' ||
    (feature && featureFlags[feature]?.includes(user?.plan));

  if (isAuthorized) return children;

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-sm text-yellow-800 animate-pulse">
      🚀 This is a premium feature.{' '}
      <button
        onClick={() => toast.info('Upgrade to Premium or Pro to unlock this feature')}
        className="underline text-blue-700 hover:text-blue-900 font-medium ml-1"
        aria-label="Upgrade to premium"
      >
        Upgrade Now
      </button>
    </div>
  );
};

PremiumFeature.propTypes = {
  children: PropTypes.node.isRequired,
  feature: PropTypes.string, // optional feature flag for modular gating
};

export default PremiumFeature;
