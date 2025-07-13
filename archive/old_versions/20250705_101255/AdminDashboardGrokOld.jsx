// File: AdminDashboard.jsx
// Path: frontend/src/components/admin/dashboard/AdminDashboard.jsx

// Features:
// - Central Admin Home linking all major modules
// - View platform summary stats (disputes, votes, contracts, alerts)
// - Quick action cards linking to: User Manager, Financial Overview, Dispute Manager, Notification Center
// - Responsive Grid Layout for desktop and mobile
// - Crown UI/UX polish with hover effects and icons
// - Token-secured data fetch (protected route)

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AdminSummaryPanel from '@/components/admin/dashboard/AdminSummaryPanel';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDisputes: 0,
    openVotes: 0,
    activeContracts: 0,
    unreadNotifications: 0,
    fraudAlerts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // 🔹 Fetch Admin Stats on load
  const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setError('Failed to load admin dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  // 🔹 Navigation Handlers
  const handleGoToUserManager = () => navigate('/admin/user-manager');
  const handleGoToFinancialOverview = () => navigate('/admin/financial-overview');
  const handleGoToDisputeDashboard = () => navigate('/admin/disputes');
  const handleGoToNotificationCenter = () => navigate('/admin/notifications');

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-10">{error}</div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="p-6 space-y-8">
        {/* 🔹 Admin Platform Summary Stats */}
        <h1 className="text-3xl font-bold text-indigo-700">Admin Dashboard Overview</h1>
        <AdminSummaryPanel stats={stats} />

        {/* 🔹 Quick Action Cards for Admin Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <button
            onClick={handleGoToUserManager}
            className="border rounded-2xl shadow-md p-4 hover:shadow-xl transition flex flex-col items-center"
          >
            <span className="text-4xl">👤</span>
            <span className="mt-2 font-semibold">Manage Users</span>
          </button>

          <button
            onClick={handleGoToFinancialOverview}
            className="border rounded-2xl shadow-md p-4 hover:shadow-xl transition flex flex-col items-center"
          >
            <span className="text-4xl">💰</span>
            <span className="mt-2 font-semibold">Financial Overview</span>
          </button>

          <button
            onClick={handleGoToDisputeDashboard}
            className="border rounded-2xl shadow-md p-4 hover:shadow-xl transition flex flex-col items-center"
          >
            <span className="text-4xl">⚖️</span>
            <span className="mt-2 font-semibold">Disputes Panel</span>
          </button>

          <button
            onClick={handleGoToNotificationCenter}
            className="border rounded-2xl shadow-md p-4 hover:shadow-xl transition flex flex-col items-center"
          >
            <span className="text-4xl">🔔</span>
            <span className="mt-2 font-semibold">Notifications</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
