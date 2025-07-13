/**
 * File: SellerDashboard.jsx
 * Path: frontend/src/components/seller/SellerDashboard.jsx
 * Purpose: Seller’s dashboard with analytics and inventory overview
 * Author: Rivers Auction Dev Team
 * Date: 2025-05-24
 * Updated: Added SEOHead, wrapped in AdminLayout, applied theme.js utilities
 * Cod2 Crown Certified: Yes
 * @aliases: @utils/logger, @services/api/auction, @services/api/inventory
 */

// Imports
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { getSellerAnalytics } from '@services/api/auction';
import { getInventory } from '@services/api/inventory';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import SEOHead from '@components/common/SEOHead';
import { theme } from '@/styles/theme';

const SellerDashboard = ({ sellerId }) => {
  // State Management
  const [analytics, setAnalytics] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Data on Component Mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [analyticsData, inventoryData] = await Promise.all([
          getSellerAnalytics(sellerId),
          getInventory(sellerId),
        ]);
        setAnalytics(analyticsData);
        setInventory(inventoryData);
        logger.info(`[SellerDashboard] Fetched data for sellerId: ${sellerId}`);
      } catch (err) {
        logger.error(`[SellerDashboard] Failed to fetch data for sellerId ${sellerId}: ${err.message}`, err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [sellerId]);

  // UI Rendering
  if (isLoading) return <div className={`${theme.spacingMd} text-center text-gray-500`} aria-live="polite">Loading dashboard...</div>;
  if (error) return <div className={`${theme.spacingMd} text-center ${theme.errorText} bg-red-100 border border-red-300 ${theme.borderRadius}`} role="alert">{error}</div>;

  return (
    <AdminLayout>
      <SEOHead title="Seller Dashboard - CFH Auction Platform" />
      <div className={`${theme.spacingLg}`}>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Seller Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-medium text-gray-700 mb-4">Auction Analytics</h3>
            {analytics ? (
              <div className="space-y-2">
                <p className={`${theme.fontSizeSm} text-gray-600`}>Total Auctions: {analytics.totalAuctions}</p>
                <p className={`${theme.fontSizeSm} text-gray-600`}>Active Auctions: {analytics.activeAuctions}</p>
                <p className={`${theme.fontSizeSm} text-gray-600`}>Total Revenue: ${analytics.totalRevenue}</p>
                <p className={`${theme.fontSizeSm} text-gray-600`}>Avg. Bid per Auction: ${analytics.avgBid}</p>
              </div>
            ) : (
              <p className={`${theme.fontSizeSm} text-gray-500`}>No analytics available.</p>
            )}
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-700 mb-4">Inventory Overview</h3>
            {inventory.length ? (
              <ul className="space-y-2">
                {inventory.slice(0, 3).map((item) => (
                  <li key={item.id} className="border-b pb-2">
                    <p className={`${theme.fontSizeSm} text-gray-600`}>{item.vehicleName}</p>
                    <p className={`${theme.fontSizeSm} text-gray-500`}>Listed: {item.isListed ? 'Yes' : 'No'}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`${theme.fontSizeSm} text-gray-500`}>No inventory available.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// Prop Type Validation
SellerDashboard.propTypes = {
  sellerId: PropTypes.string.isRequired,
};

export default SellerDashboard;