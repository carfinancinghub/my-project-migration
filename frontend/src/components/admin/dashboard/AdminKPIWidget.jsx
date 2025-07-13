// File: AdminKPIWidget.jsx
// Path: frontend/src/components/admin/dashboard/AdminKPIWidget.jsx
// 👑 Cod1 Crown Certified — Reusable KPI Card for Admin Panel

import React from 'react';

// 🌟 AdminKPIWidget: Accepts title, value, and optional color props
const AdminKPIWidget = ({ title, value, color = 'bg-indigo-600' }) => {
  return (
    <div className={`rounded-lg shadow-lg p-6 ${color} text-white animate-fadeIn`}> {/* Card Container */}
      <h2 className="text-lg font-semibold mb-2">{title}</h2> {/* KPI Title */}
      <p className="text-3xl font-bold">{value}</p> {/* KPI Value */}
    </div>
  );
};

export default AdminKPIWidget;
