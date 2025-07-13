// File: App.jsx
// Path: frontend/src/App.jsx
// 👑 Cod1 Crown Certified — Core App Router with Suspense, Lazy Loading, Protected Routes, Notification System

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';

// Common Core Components
import Navbar from '@/components/common/Navbar.jsx';
import NavbarMobileToggle from "@/components/common/NavbarMobileToggle.jsx";
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ProtectedRoute from '@/components/common/ProtectedRoute.jsx';
import NotificationCenter from '@/components/notifications/NotificationCenter.jsx'; // 🔔 Notification Center

// Lazy-loaded Pages for faster page speed (only load on demand)
const Register = lazy(() => import('@/components/auth/Register.jsx'));
const Login = lazy(() => import('@/components/auth/Login.jsx'));
const BuyerDashboard = lazy(() => import('@/components/buyer/BuyerDashboard.jsx'));
const SellerDashboard = lazy(() => import('@/components/seller/SellerDashboard.jsx'));
const ContractViewer = lazy(() => import('@/components/contract/ContractViewer.jsx'));

// Admin Lazy Pages
const AdminLayout = lazy(() => import('@/components/admin/layout/AdminLayout.jsx'));
const AdminPaymentOverview = lazy(() => import('@/components/admin/payments/AdminPaymentOverview.jsx'));
const AdminSystemHealth = lazy(() => import('@/components/admin/health/AdminSystemHealth.jsx'));
const AdminNotificationCenter = lazy(() => import('@/components/admin/notifications/AdminNotificationCenter.jsx'));
const AdminSupportTickets = lazy(() => import('@/components/admin/support/AdminSupportTickets.jsx'));
const AdminArbitrationDashboard = lazy(() => import('@/components/admin/arbitration/AdminArbitrationDashboard.jsx'));

// 404 Not Found Page (fallback route)
const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-5xl font-bold text-red-600 mb-4 animate-pulse">404</h1>
    <p className="text-xl text-gray-600 mb-6">Oops, the page you're looking for does not exist.</p>
    <a href="/" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Go Home</a>
  </div>
);

const App = () => (
  <>
    {/* Global Navbars always visible */}
    <Navbar />
    <NavbarMobileToggle />

    {/* Protects lazy pages from flicker while loading */}
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><LoadingSpinner /></div>}>
      <div className="p-4">
        <Routes>

          {/* Public Pages */}
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Notification Center */}
          <Route path="/notifications" element={
            <ProtectedRoute>
              <NotificationCenter />
            </ProtectedRoute>
          } />

          {/* Role Dashboards */}
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

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </div>
    </Suspense>
  </>
);

export default App;
