// File: NavbarMobileToggle.jsx
// Path: frontend/src/components/common/NavbarMobileToggle.jsx
// 👑 Cod1 Crown Certified — Mobile Navbar Toggle with Live Notifications

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Bell } from 'lucide-react';
import useAuth from '@/utils/useAuth'; // 🔑 Auth role and logout manager
import UnreadNotificationBadge from '@/components/common/UnreadNotificationBadge.jsx'; // 🔔 Live Notification Count

const NavbarMobileToggle = () => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false); // Close menu on logout
  };

  return (
    <nav className="bg-indigo-700 text-white px-4 py-3 shadow-md md:hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="text-2xl font-bold hover:text-indigo-300 tracking-wide">
          Car Financing Hub
        </Link>

        {/* Toggle Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="mt-4 space-y-4 animate-slide-down">
          {/* Role Links */}
          {role === 'buyer' && (
            <Link to="/buyer" className="block hover:text-indigo-200" onClick={() => setIsOpen(false)}>
              Buyer Dashboard
            </Link>
          )}
          {role === 'seller' && (
            <Link to="/seller" className="block hover:text-indigo-200" onClick={() => setIsOpen(false)}>
              Seller Dashboard
            </Link>
          )}
          {role === 'admin' && (
            <Link to="/admin" className="block hover:text-indigo-200" onClick={() => setIsOpen(false)}>
              Admin Panel
            </Link>
          )}

          {/* Notifications Link */}
          <Link to="/notifications" className="flex items-center gap-2 hover:text-indigo-200" onClick={() => setIsOpen(false)}>
            <Bell size={20} />
            Notifications
            <UnreadNotificationBadge /> {/* 🔥 Live Badge */}
          </Link>

          {/* Role Tag */}
          <span className="block text-xs italic text-gray-300">({role})</span>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavbarMobileToggle;
