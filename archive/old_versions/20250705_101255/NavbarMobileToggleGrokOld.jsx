// File: NavbarMobileToggle.js
// Path: frontend/src/components/NavbarMobileToggle.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '@/utils/useAuth'; // ✅
import { Menu, X, Bell } from 'lucide-react';
import UnreadNotificationBadge from './UnreadNotificationBadge';

const NavbarMobileToggle = () => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-700 text-white px-4 py-3 shadow md:hidden">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-xl font-bold hover:text-indigo-300">CarHub</Link>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 space-y-2">
          {role === 'buyer' && <Link to="/buyer" className="block hover:text-indigo-200">Buyer Dashboard</Link>}
          {role === 'seller' && <Link to="/seller" className="block hover:text-indigo-200">Seller Dashboard</Link>}
          {role === 'admin' && <Link to="/admin" className="block hover:text-indigo-200">Admin Panel</Link>}

          <Link to="/notifications" className="flex items-center gap-2 hover:text-indigo-200">
            <Bell size={18} /> <span>Notifications</span> <UnreadNotificationBadge />
          </Link>

          <span className="block text-sm italic text-gray-300">({role})</span>

          <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavbarMobileToggle;
