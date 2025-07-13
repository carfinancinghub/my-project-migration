// File: AdminSummaryPanel.jsx
// Path: frontend/src/components/admin/dashboard/AdminSummaryPanel.jsx
// 👑 Cod1 Crown Certified — Admin Home Summary with Stats Panels (Vite Compatible)

import React, { useEffect, useState } from 'react';
import axios from 'axios';

// 🌟 Admin Summary Panel Component
const AdminSummaryPanel = () => {
  const [stats, setStats] = useState({
    totalDisputes: 0,
    openVotes: 0,
    activeContracts: 0, // 🚧 Placeholder, to be made dynamic in Phase 2
    unreadNotifications: 0,
    fraudAlerts: 0,
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL; // ✅ Vite-friendly environment variable usage

        // 📜 Fetch Disputes
        const disputeRes = await axios.get(`${API_URL}/api/disputes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const disputes = Array.isArray(disputeRes.data) ? disputeRes.data : [];
        const totalDisputes = disputes.length;
        const openVotes = disputes.filter(d => d.status === 'pending').length;

        // 📬 Fetch Notifications
        const notifRes = await axios.get(`${API_URL}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const notifications = Array.isArray(notifRes.data) ? notifRes.data : [];

        // ⚠️ Fetch Fraud Alerts
        const fraudRes = await axios.get(`${API_URL}/api/fraud/alerts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const frauds = Array.isArray(fraudRes.data) ? fraudRes.data : [];

        setStats({
          totalDisputes,
          openVotes,
          activeContracts: 17, // 🚧 Still placeholder
          unreadNotifications: notifications.filter(n => !n.read).length,
          fraudAlerts: frauds.length,
        });
      } catch (err) {
        console.error('❌ Error loading admin summary:', err);
        // 🚨 Optional: Toast or UI fallback could go here in future upgrades
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white rounded shadow p-6 space-y-4">
      <h2 className="text-xl font-bold mb-4">📊 Admin Control Panel</h2>

      {/* 🔥 Dynamic Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Disputes" value={stats.totalDisputes} icon="🧾" />
        <StatCard label="Open Votes" value={stats.openVotes} icon="🗳️" />
        <StatCard label="Active Contracts" value={stats.activeContracts} icon="📄" />
        <StatCard label="Unread Notifications" value={stats.unreadNotifications} icon="🔔" />
        <StatCard label="Fraud Alerts" value={stats.fraudAlerts} icon="⚠️" />
      </div>
    </div>
  );
};

// 🧱 Small reusable Stat Card Component
const StatCard = ({ label, value, icon }) => (
  <div className="border border-gray-200 rounded p-4 shadow hover:shadow-md transition">
    <div className="text-3xl">{icon}</div>
    <div className="text-xl font-semibold">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

export default AdminSummaryPanel;
