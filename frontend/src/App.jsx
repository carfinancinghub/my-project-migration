/**
 * File: App.jsx
 * Path: frontend/src/App.jsx
 * Purpose: Main routing file for the Rivers Auction platform with escrow, admin, and equity routes
 * Author: Cod3 (05082151)
 * Date: May 08, 2025 (Updated)
 * Cod2 Crown Certified
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// --- Core Components ---
import Navbar from '@/components/common/Navbar.jsx';
import NavbarMobileToggle from '@/components/common/NavbarMobileToggle.jsx';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ProtectedRoute from '@/components/common/ProtectedRoute.jsx';
import NotificationCenter from '@/components/notifications/NotificationCenter.jsx';

// --- Lazy-loaded Pages ---
const Register = lazy(() => import('@/components/auth/Register.jsx'));
const Login = lazy(() => import('@/components/auth/Login.jsx'));
const BuyerDashboard = lazy(() => import('@/components/buyer/BuyerDashboard.jsx'));
const SellerDashboard = lazy(() => import('@/components/seller/SellerDashboard.jsx'));
const ContractViewer = lazy(() => import('@/components/contract/ContractViewer.jsx'));
const AdminLayout = lazy(() => import('@/components/admin/layout/AdminLayout.jsx'));
const AdminPaymentOverview = lazy(() => import('@/components/admin/payments/AdminPaymentOverview.jsx'));
const AdminSystemHealth = lazy(() => import('@/components/admin/health/AdminSystemHealth.jsx'));
const AdminNotificationCenter = lazy(() => import('@/components/admin/notifications/AdminNotificationCenter.jsx'));
const AdminSupportTickets = lazy(() => import('@/components/admin/support/AdminSupportTickets.jsx'));
const AdminArbitrationDashboard = lazy(() => import('@/components/admin/arbitration/AdminArbitrationDashboard.jsx'));
const SharedReportViewer = lazy(() => import('@/components/mechanic/SharedReportViewer.jsx'));
const AdminEngagementAnalytics = lazy(() => import('@components/admin/analytics/AdminEngagementAnalytics.jsx'));
const PartnerPortal = lazy(() => import('@components/partner/PartnerPortal.jsx'));

// --- Escrow Lazy Routes ---
const EscrowOfficerDashboard = lazy(() => import('@/components/escrow/EscrowOfficerDashboard.jsx'));
const EscrowRoleGuard = lazy(() => import('@/components/escrow/EscrowRoleGuard.jsx'));

// --- Mock Authentication (To Replace in production) ---
const userRole = 'partner';

// --- 404 Fallback ---
const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-5xl font-bold text-red-600 mb-4 animate-pulse">404</h1>
    <p className="text-xl text-gray-600 mb-6">Oops, the page you're looking for does not exist.</p>
    <a href="/" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Go Home</a>
  </div>
);

// --- Main App Router ---
const App = () => (
  <Router>
    <Navbar />
    <NavbarMobileToggle />

    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><LoadingSpinner /></div>}>
      <div className="p-4">
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Notifications */}
          <Route path="/notifications" element={<ProtectedRoute><NotificationCenter /></ProtectedRoute>} />

          {/* User Dashboards */}
          <Route path="/buyer" element={<ProtectedRoute><BuyerDashboard /></ProtectedRoute>} />
          <Route path="/seller" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
          <Route path="/contract-viewer" element={<ProtectedRoute><ContractViewer fileUrl="/sample.pdf" /></ProtectedRoute>} />
          <Route path="/loading-test" element={<LoadingSpinner />} />

          {/* Admin Panel */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout><Outlet /></AdminLayout></ProtectedRoute>}>
            <Route index element={<AdminPaymentOverview />} />
            <Route path="payments" element={<AdminPaymentOverview />} />
            <Route path="health" element={<AdminSystemHealth />} />
            <Route path="notifications" element={<AdminNotificationCenter />} />
            <Route path="support" element={<AdminSupportTickets />} />
            <Route path="arbitration" element={<AdminArbitrationDashboard />} />
          </Route>

          {/* Admin Analytics */}
          <Route path="/admin-analytics" element={<AdminEngagementAnalytics />} />

          {/* Partner Portal */}
          <Route path="/partner-portal" element={userRole === 'partner' ? <PartnerPortal /> : <div>Access Denied: Partners Only</div>} />

          {/* Mechanic Shared Report Viewer */}
          <Route path="/shared-report/:token" element={<SharedReportViewer />} />

          {/* Escrow Dashboard Route */}
          <Route path="/escrow-dashboard" element={<EscrowRoleGuard role="officer"><EscrowOfficerDashboard /></EscrowRoleGuard>} />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </div>
    </Suspense>
  </Router>
);

export default App;
