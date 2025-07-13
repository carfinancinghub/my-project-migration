/**
 * SellerActionPanel.jsx
 * Path: frontend/src/components/seller/SellerActionPanel.jsx
 * Purpose: Display a Quick Actions panel for seller dashboard with links to key features.
 * 👑 Cod2 Crown Certified
 */

import React from 'react';
import { Link } from 'react-router-dom';

const SellerActionPanel = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-md p-6 mb-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
      <div className="flex flex-wrap gap-4">
        <Link
          to="/seller/create-listing"
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:scale-105 transition-all focus:ring-2 focus:ring-blue-400 focus:outline-none"
          aria-label="Create a new listing"
        >
          <span className="text-lg">➕</span>
          <span>Create Listing</span>
        </Link>
        <a
          href="#gallery"
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:scale-105 transition-all focus:ring-2 focus:ring-blue-400 focus:outline-none"
          aria-label="Manage listing media gallery"
        >
          <span className="text-lg">🖼️</span>
          <span>Manage Gallery</span>
        </a>
        <a
          href="#disputes"
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:scale-105 transition-all focus:ring-2 focus:ring-blue-400 focus:outline-none"
          aria-label="Resolve disputes"
        >
          <span className="text-lg">⚡</span>
          <span>Resolve Disputes</span>
        </a>
        <a
          href="#badges"
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:scale-105 transition-all focus:ring-2 focus:ring-blue-400 focus:outline-none"
          aria-label="View earned badges"
        >
          <span className="text-lg">🏆</span>
          <span>View Badges</span>
        </a>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default SellerActionPanel;