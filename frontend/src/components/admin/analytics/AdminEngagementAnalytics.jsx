/**
 * File: AdminEngagementAnalytics.jsx
 * Path: frontend/src/components/admin/analytics/AdminEngagementAnalytics.jsx
 * Purpose: Admin dashboard for engagement analytics, updated to include Hauler health monitoring
 * Author: Cod3 (05051715)
 * Date: May 05, 2025 (Updated)
 * 👑 Cod3 Crown Certified
 */

// --- Dependencies ---
import React from 'react';
import LiveDashboardHealthWidget from '@components/admin/LiveDashboardHealthWidget';

// --- Component Definition ---
const AdminEngagementAnalytics = () => {
  return (
    <div className="admin-engagement-analytics">
      {/* Existing analytics content */}
      <h2>Engagement Analytics</h2>

      {/* --- Hauler Health Monitor Section --- */}
      <div className="hauler-health-monitor mt-6">
        <h3 className="text-xl font-semibold mb-2">Hauler Health Monitor</h3>
        <LiveDashboardHealthWidget />
      </div>
    </div>
  );
};

export default AdminEngagementAnalytics;
