// File: Navbar.jsx
// Path: frontend/src/components/common/Navbar.jsx
// 👑 Cod1 Crown Certified — Fully Responsive Navbar

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '@/utils/useAuth';
import UnreadNotificationBadge from '@/components/notifications/UnreadNotificationBadge';
import { Bell, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-indigo-700 text-white px-6 py-4 flex items-center justify-between shadow-md relative">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold hover:text-indigo-300">
        Car Financing Hub
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        {role === 'buyer' && (
          <Link to="/buyer" className="hover:text-indigo-200">
            Buyer Dashboard
          </Link>
        )}
        {role === 'seller' && (
          <Link to="/seller" className="hover:text-indigo-200">
            Seller Dashboard
          </Link>
        )}
        {role === 'admin' && (
          <Link to="/admin" className="hover:text-indigo-200">
            Admin Panel
          </Link>
        )}

        <Link to="/notifications" className="relative hover:text-indigo-200">
          <Bell className="w-5 h-5" />
          <UnreadNotificationBadge />
        </Link>

        <span className="text-sm italic text-gray-300 hidden md:inline-block">
          ({role})
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded text-sm font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Mobile Toggle Button */}
      <div className="md:hidden">
        <button onClick={toggleMenu}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-indigo-700 flex flex-col items-start px-6 py-4 gap-4 shadow-md z-50">
          {role === 'buyer' && (
            <Link to="/buyer" onClick={toggleMenu} className="hover:text-indigo-200">
              Buyer Dashboard
            </Link>
          )}
          {role === 'seller' && (
            <Link to="/seller" onClick={toggleMenu} className="hover:text-indigo-200">
              Seller Dashboard
            </Link>
          )}
          {role === 'admin' && (
            <Link to="/admin" onClick={toggleMenu} className="hover:text-indigo-200">
              Admin Panel
            </Link>
          )}

          <Link to="/notifications" onClick={toggleMenu} className="relative hover:text-indigo-200">
            <Bell className="inline-block w-5 h-5 mr-2" />
            Notifications
            <UnreadNotificationBadge />
          </Link>

          <span className="text-sm italic text-gray-300">
            ({role})
          </span>

          <button
            onClick={() => { toggleMenu(); handleLogout(); }}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-semibold w-full text-left"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
