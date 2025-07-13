// File: Navbar.jsx
// Path: frontend/src/components/common/Navbar.jsx
// 👑 Cod1 Crown Certified — Desktop Navbar with Live Notifications

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import UnreadNotificationBadge from '@/components/common/UnreadNotificationBadge.jsx'; // 🔔 Live Notification Count
import useAuth from '@/utils/useAuth'; // 🔑 Auth role and logout manager

const Navbar = () => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Brand */}
      <Link to="/" className="text-2xl font-bold hover:text-indigo-300 tracking-wide">
        Car Financing Hub
      </Link>

      {/* Navigation Actions */}
      <div className="flex items-center gap-6">
        {/* Role-Based Links */}
        {role === 'buyer' && (
          <Link to="/buyer" className="hover:text-indigo-200 transition">Buyer Dashboard</Link>
        )}
        {role === 'seller' && (
          <Link to="/seller" className="hover:text-indigo-200 transition">Seller Dashboard</Link>
        )}
        {role === 'admin' && (
          <Link to="/admin" className="hover:text-indigo-200 transition">Admin Panel</Link>
        )}

        {/* Notifications */}
        <Link to="/notifications" className="relative hover:text-indigo-200">
          <Bell className="inline-block" size={20} />
          <UnreadNotificationBadge /> {/* 🔥 Live Badge */}
        </Link>

        {/* Current Role Tag */}
        <span className="text-xs italic text-gray-300 hidden sm:inline">
          ({role})
        </span>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-md text-xs font-semibold transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
