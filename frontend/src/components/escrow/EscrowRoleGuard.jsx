// File: EscrowRoleGuard.jsx
// Path: frontend/src/components/escrow/EscrowRoleGuard.jsx
// Author: Cod2 (05072100)
// Description: Restrict escrow views to authorized users only

import React from 'react';
import { Navigate } from 'react-router-dom';

const EscrowRoleGuard = ({ user, children }) => {
  if (!user || user.role !== 'escrow') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default EscrowRoleGuard;
