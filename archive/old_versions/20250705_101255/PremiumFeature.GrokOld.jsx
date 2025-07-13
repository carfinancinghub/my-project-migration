// File: PremiumFeature.GrokOld.jsx
// Path: frontend/src/components/common/PremiumFeature.GrokOld.jsx
// Purpose: Role-based gating system for premium features (e.g., DisputeSimulator)
// Author: Cod2
// Date: 2025-05-01
// 👑 Cod2 Crown Certified

import React from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '@/src/utils/useAuth';
import { toast } from 'react-toastify';

const PremiumFeature = ({ children }) => {
  const { user } = useAuth();
  const isPremium = user?.roles?.includes('premium') || user?.isAdmin;

  if (!user) {
    toast.warn('Please log in to access this feature');
    return <div className="text-gray-500 italic">Log in to access premium features.</div>;
  }

  if (!isPremium) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-800 rounded-md animate-pulse">
        <p className="font-semibold">Premium Feature</p>
        <p className="text-sm">Upgrade to unlock this powerful tool. ✨</p>
      </div>
    );
  }

  return <>{children}</>;
};

PremiumFeature.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PremiumFeature;
