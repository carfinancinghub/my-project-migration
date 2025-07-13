// File: AdminTopbar.jsx
// Path: frontend/src/components/admin/layout/AdminTopbar.jsx
// 👑 Cod1 Crown Certified — Polished Admin Topbar with Notification Integration

import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import UnreadNotificationBadge from '@/components/notifications/UnreadNotificationBadge.jsx';

// 🌟 AdminTopbar: Mobile Header Bar for Admin Panel
const AdminTopbar = ({ setSidebarOpen }) => {
  return (
    <header className="bg-white shadow flex items-center justify-between px-4 py-3 md:hidden">
      {/* 🔹 Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="text-gray-700 hover:text-indigo-600 focus:outline-none transition"
      >
        <Menu size={28} />
      </button>

      {/* 🌍 Admin Title */}
      <Link
        to="/admin"
        className="text-lg font-bold text-indigo-700 hover:text-indigo-900 transition"
      >
        Admin Panel
      </Link>

      {/* 🔔 Notifications Button with Badge */}
      <Link
        to="/admin/notifications"
        className="relative text-gray-700 hover:text-indigo-600 transition"
      >
        <Bell size={24} />
        <UnreadNotificationBadge />
      </Link>
    </header>
  );
};

export default AdminTopbar;
