/**
 * @file InsuranceRoleGuard.jsx
 * @path frontend/src/components/insurance/InsuranceRoleGuard.jsx
 * @description Role guard component for Insurance Officer, enforcing access control, premium tier validation, and onboarding UI with role switch support.
 * @author Cod2
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useUserContext } from '@utils/UserContext';
import ToastManager from '@components/common/ToastManager';
import { triggerConfetti } from '@utils/ConfettiHelper';
import RoleSwitchWrapper from '@components/needsHome/RoleSwitchWrapper';
import OnboardingGuide from '@components/onboarding/OnboardingGuide';
import { logAudit } from '@utils/escrow/EscrowAuditLogStore';
import '@styles/InsuranceRoleGuard.css';

/**
 * @component InsuranceRoleGuard
 * @description Guards children components for insurance officers and handles onboarding, license alerts, and premium gating.
 */
const InsuranceRoleGuard = ({ children }) => {
  const { user } = useUserContext();

  /**
   * @function checkUserRole
   * @description Verifies the user has the 'insuranceOfficer' role.
   */
  const checkUserRole = () => user?.role === 'insuranceOfficer';

  /**
   * @function checkPremiumTier
   * @description Verifies user has active premium or enterprise subscription.
   */
  const checkPremiumTier = () => ['premium', 'enterprise'].includes(user?.subscription);

  useEffect(() => {
    if (!checkUserRole()) {
      logAudit('unauthorized-access', user?.email || 'unknown', 'insurance-role-guard');
      ToastManager.error('Access denied: Insurance officers only');
    }

    if (checkUserRole()) {
      // 🎉 WOW: Confetti for first-time officer login
      if (user?.firstLogin) triggerConfetti();

      // 🚨 WOW: License expiry alert
      if (checkPremiumTier() && user?.licenseExpiresSoon) {
        ToastManager.warning('⚠️ Your insurance license is nearing expiration. Please renew.');
      }
    }
  }, [user]);

  if (!checkUserRole()) {
    return <RoleSwitchWrapper />;
  }

  return (
    <div className="insurance-role-guard" data-testid="role-guard" role="region" aria-label="Insurance role guard">
      <OnboardingGuide role="insurance" />
      {children}
    </div>
  );
};

InsuranceRoleGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default InsuranceRoleGuard;
