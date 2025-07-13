import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/common/Navbar.jsx';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/payments', label: 'Payments' },
    { to: '/admin/health', label: 'System Health' },
    { to: '/admin/notifications', label: 'Notifications' },
    { to: '/admin/support', label: 'Support Tickets' },
    { to: '/admin/arbitration', label: 'Arbitration' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform z-30
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative lg:shadow-none`}
        aria-label="Admin sidebar"
      >
        <nav className="h-full p-4 space-y-2 overflow-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin'}
              className={({ isActive }) =>
                `block px-3 py-2 rounded focus:outline-none focus:ring focus:ring-indigo-300 mt-1
                 ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar for mobile */}
        <header className="flex items-center justify-between bg-white shadow p-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded focus:outline-none focus:ring focus:ring-indigo-300"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
          <Navbar />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
