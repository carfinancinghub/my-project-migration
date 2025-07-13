// File: Navbar.js
// Path: frontend/src/components/Navbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
import UnreadNotificationBadge from './common/UnreadNotificationBadge';
import { Bell } from 'lucide-react';

const Navbar = () => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-700 text-white px-6 py-4 flex justify-between items-center shadow">
      <Link to="/" className="text-xl font-bold hover:text-indigo-300">Car Financing Hub</Link>

      <div className="flex items-center gap-4">
        {role === 'buyer' && <Link to="/buyer" className="hover:text-indigo-200">Buyer Dashboard</Link>}
        {role === 'seller' && <Link to="/seller" className="hover:text-indigo-200">Seller Dashboard</Link>}
        {role === 'admin' && <Link to="/admin" className="hover:text-indigo-200">Admin Panel</Link>}

        <Link to="/notifications" className="relative hover:text-indigo-200">
          <Bell className="inline-block" />
          <UnreadNotificationBadge />
        </Link>

        <span className="text-sm italic text-gray-300">({role})</span>

        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
