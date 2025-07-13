// File: AdminLayout.jsx
// Path: frontend/src/components/admin/layout/AdminLayout.jsx
// 👑 Cod1 Crown Certified — Admin Shell Layout (Sidebar + Topbar + Content)

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/admin/layout/AdminSidebar.jsx';
import AdminTopbar from '@/components/admin/layout/AdminTopbar.jsx';

// 🌟 AdminLayout: Responsive Structure for Admin Pages
const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* 🔹 Sidebar Navigation */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* 🔹 Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar for mobile */}
        <AdminTopbar setSidebarOpen={setSidebarOpen} />

        {/* Routed Admin Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-white rounded-lg shadow-inner">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
