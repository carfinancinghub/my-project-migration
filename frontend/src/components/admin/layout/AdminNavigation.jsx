import React from 'react';
import { Link } from 'react-router-dom';

const AdminNavigation = () => {
  return (
    <nav className="bg-gray-100 border-r border-gray-300 min-h-screen w-64 p-4">
      <h2 className="text-lg font-bold mb-6 text-blue-700">⚙️ Admin Panel</h2>

      <ul className="space-y-3">
        <li>
          <Link
            to="/admin/arbitration"
            className="block px-4 py-2 bg-white rounded hover:bg-blue-100"
          >
            ⚖️ Arbitration Dashboard
          </Link>
        </li>

        <li>
          <Link
            to="/admin/inspection-review"
            className="block px-4 py-2 bg-white rounded hover:bg-blue-100"
          >
            🔍 Inspection Review
          </Link>
        </li>

        <li>
          <Link
            to="/admin/title-dashboard"
            className="block px-4 py-2 bg-white rounded hover:bg-blue-100"
          >
            🚗 Title Management
          </Link>
        </li>

        <li>
          <Link
            to="/admin/badge-audit"
            className="block px-4 py-2 bg-white rounded hover:bg-blue-100"
          >
            🧾 Badge Audit Log
          </Link>
        </li>

        <li>
          <Link
            to="/admin/notification-center"
            className="block px-4 py-2 bg-white rounded hover:bg-blue-100"
          >
            🔔 Notification Center
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavigation;