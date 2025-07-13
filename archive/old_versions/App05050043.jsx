/**
 * File: App.jsx
 * Path: frontend/src/App.jsx
 * Purpose: Main routing file for the Rivers Auction platform
 * Author: Cod3 (05050043)
 * Date: May 05, 2025 (Merged)
 * Cod1 & Cod3 Crown Certified
 */

// --- Dependencies ---
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Common Core Components
import Navbar from '@/components/common/Navbar.jsx';
import NavbarMobileToggle from '@/components/common/NavbarMobileToggle.jsx';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ProtectedRoute from '@/components/common/ProtectedRoute.jsx';
import NotificationCenter from '@/components/notifications/NotificationCenter.jsx';

// Lazy-loaded Pages for faster performance
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

// Newly Added Components
import AdminEngagementAnalytics from '@components/admin/analytics/AdminEngagementAnalytics';
import PartnerPortal from '@components/partner/PartnerPortal';

// --- Mock Authentication Role (to be replaced by real context/auth in production) ---
const userRole = 'partner';

// --- Fallback 404 Not Found ---
const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-5xl font-bold text-red-600 mb-4 animate-pulse">404</h1>
    <p className="text-xl text-gray-600 mb-6">Oops, the page you're looking for does not exist.</p>
    <a href="/" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Go Home</a>
  </div>
);

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

          {/* Notification Center */}
          <Route path="/notifications" element={
            <ProtectedRoute>
              <NotificationCenter />
            </ProtectedRoute>
          } />

          {/* User Role Dashboards */}
          <Route path="/buyer" element={<ProtectedRoute><BuyerDashboard /></ProtectedRoute>} />
          <Route path="/seller" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
          <Route path="/contract-viewer" element={<ProtectedRoute><ContractViewer fileUrl="/sample.pdf" /></ProtectedRoute>} />
          <Route path="/loading-test" element={<LoadingSpinner />} />

          {/* Admin Section */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            </ProtectedRoute>
          }>
            <Route index element={<AdminPaymentOverview />} />
            <Route path="payments" element={<AdminPaymentOverview />} />
            <Route path="health" element={<AdminSystemHealth />} />
            <Route path="notifications" element={<AdminNotificationCenter />} />
            <Route path="support" element={<AdminSupportTickets />} />
            <Route path="arbitration" element={<AdminArbitrationDashboard />} />
          </Route>

          {/* New Admin Analytics Route */}
          <Route path="/admin-analytics" element={<AdminEngagementAnalytics />} />

          {/* Partner Portal Route */}
          <Route
            path="/partner-portal"
            element={
              userRole === 'partner' ? (
                <PartnerPortal />
              ) : (
                <div>Access Denied: Partners Only</div>
              )
            }
          />

          {/* Catch-all Route */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </div>
    </Suspense>
  </Router>
);

export default App;
