// File: AdminSidebar.jsx
// Path: frontend/src/components/admin/layout/AdminSidebar.jsx
// 👑 Cod1 Crown Certified — Final Admin Sidebar Navigation

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

// 🌟 AdminSidebar: Responsive Slide-In Sidebar for Admin Panel
const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const linkClasses = (path) =>
    `block px-4 py-2 rounded-lg text-sm font-medium transition ${
      location.pathname.includes(path)
        ? 'bg-indigo-600 text-white'
        : 'text-white hover:bg-indigo-500'
    }`;

  return (
    <aside
      className={`fixed inset-y-0 left-0 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out bg-indigo-700 w-64 overflow-y-auto z-50 md:static md:translate-x-0`}
    >
      {/* 🔹 Mobile Close Button */}
      <div className="flex justify-end p-4 md:hidden">
        <button
          onClick={() => setSidebarOpen(false)}
          className="text-white focus:outline-none"
        >
          <X size={28} />
        </button>
      </div>

      {/* 🔹 Sidebar Navigation Links */}
      <nav className="mt-8 space-y-2 px-6">
        <Link to="/admin/payments" className={linkClasses('/payments')}>
          Payments
        </Link>
        <Link to="/admin/health" className={linkClasses('/health')}>
          System Health
        </Link>
        <Link to="/admin/notifications" className={linkClasses('/notifications')}>
          Notifications
        </Link>
        <Link to="/admin/support" className={linkClasses('/support')}>
          Support Tickets
        </Link>
        <Link to="/admin/arbitration" className={linkClasses('/arbitration')}>
          Arbitration
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
