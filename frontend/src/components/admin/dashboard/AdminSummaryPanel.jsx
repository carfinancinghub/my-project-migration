// File: AdminSummaryPanel.jsx
// Path: frontend/src/components/admin/dashboard/AdminSummaryPanel.jsx
// 👑 Cod1 Crown Certified — Admin Dashboard Overview Metrics

import React from 'react';

// 🌟 AdminSummaryPanel: Displays Key Admin Stats
const AdminSummaryPanel = ({ stats }) => {
  const statCards = [
    { title: 'Total Disputes', value: stats.totalDisputes, color: 'bg-red-500' },
    { title: 'Open Votes', value: stats.openVotes, color: 'bg-yellow-500' },
    { title: 'Active Contracts', value: stats.activeContracts, color: 'bg-green-500' },
    { title: 'Unread Notifications', value: stats.unreadNotifications, color: 'bg-indigo-500' },
    { title: 'Fraud Alerts', value: stats.fraudAlerts, color: 'bg-pink-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((card, idx) => (
        <div
          key={idx}
          className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-md text-white ${card.color} transition-transform transform hover:scale-105`}
        >
          <div className="text-4xl font-bold mb-2">{card.value}</div>
          <div className="text-lg font-semibold">{card.title}</div>
        </div>
      ))}
    </div>
  );
};

export default AdminSummaryPanel;
