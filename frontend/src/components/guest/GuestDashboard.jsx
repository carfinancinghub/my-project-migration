/**
 * File: GuestDashboard.jsx
 * Path: frontend/src/components/guest/GuestDashboard.jsx
 * Purpose: Displays recent auctions and platform features for guest/new users, with premium analytics and guided tours
 * Author: Cod5 (05042219)
 * Date: May 4, 2025
 * Updated: Added SEOHead, used AdminLayout, applied theme.js utilities, enhanced comments and accessibility
 * Cod2 Crown Certified: Yes
 * Features:
 * - Displays recent auctions with title, current bid, and time remaining
 * - Onboarding guide link for new users
 * - Premium features: trending vehicles analytics and guided tour (welcomeAnalytics)
 * - Responsive layout with TailwindCSS, animations, and toast notifications
 * Functions:
 * - fetchAuctions(): Fetches recent auctions data using fetchRecentAuctions
 * - fetchTrends(): Fetches trending vehicles data (Premium: welcomeAnalytics)
 * - handleStartTour(): Initiates a guided tour for the dashboard (Premium: welcomeAnalytics)
 * Dependencies: motion, Button, PremiumFeature, toast, logError, fetchRecentAuctions, fetchTrendingVehicles, startGuidedTour, Link, AdminLayout, SEOHead, theme
 */

// Imports
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@components/common/Button';
import { PremiumFeature } from '@components/common/PremiumFeature';
import { toast } from 'react-toastify';
import { logError } from '@utils/logger';
import { fetchRecentAuctions, fetchTrendingVehicles } from '@utils/auctionUtils';
import { startGuidedTour } from '@utils/tourUtils';
import { Link } from 'react-router-dom';
import AdminLayout from '@components/admin/layout/AdminLayout';
import SEOHead from '@components/common/SEOHead';
import { theme } from '@styles/theme';

// Interfaces
interface Auction {
  id: string;
  title: string;
  currentBid: number;
  timeRemaining: string;
}

interface TrendingVehicle {
  make: string;
  model: string;
  count: number;
}

interface Props {
  isPremium: boolean;
}

const GuestDashboard: React.FC<Props> = ({ isPremium }) => {
  // State Setup
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [trendingVehicles, setTrendingVehicles] = useState<TrendingVehicle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch Recent Auctions
  const fetchAuctions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchRecentAuctions();
      setAuctions(data);
      toast.success('Recent auctions loaded!');
    } catch (err) {
      logError(err);
      toast.error('Failed to load auctions.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch Trending Vehicles (Premium)
  const fetchTrends = useCallback(async () => {
    if (!isPremium) return;
    setIsLoading(true);
    try {
      const data = await fetchTrendingVehicles();
      setTrendingVehicles(data);
      toast.success('Trending vehicles loaded!');
    } catch (err) {
      logError(err);
      toast.error('Failed to load trending vehicles.');
    } finally {
      setIsLoading(false);
    }
  }, [isPremium]);

  // Start Guided Tour (Premium)
  const handleStartTour = useCallback(() => {
    try {
      startGuidedTour('guestDashboard');
      toast.success('Guided tour started!');
    } catch (err) {
      logError(err);
      toast.error('Failed to start tour.');
    }
  }, []);

  // Initial Fetch
  useEffect(() => {
    fetchAuctions();
    if (isPremium) fetchTrends();
  }, [fetchAuctions, fetchTrends, isPremium]);

  // Render
  return (
    <AdminLayout>
      <SEOHead title="Guest Dashboard - CFH Auction Platform" />
      <div className={`min-h-screen bg-gray-50 ${theme.spacingLg}`}>
        <header className="mb-6">
          <h1 className={`${theme.successText} text-2xl font-bold`}>Welcome to Rivers Auction</h1>
          <p className="text-gray-600">Explore recent auctions and platform features.</p>
        </header>

        {/* Recent Auctions */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Recent Auctions</h2>
          {isLoading ? (
            <p className="text-gray-600">Loading...</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {auctions.length > 0 ? (
                auctions.map((auction) => (
                  <li key={auction.id} className={`bg-white ${theme.spacingMd} ${theme.borderRadius} ${theme.cardShadow}`}>
                    <h3 className="text-lg font-medium">{auction.title}</h3>
                    <p>Current Bid: ${auction.currentBid.toFixed(2)}</p>
                    <p>Time Remaining: {auction.timeRemaining}</p>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No recent auctions found.</p>
              )}
            </ul>
          )}
        </section>

        {/* Onboarding Guide */}
        <section className="mb-6 text-center">
          <Link to="/onboarding">
            <Button className={`${theme.primaryButton}`} aria-label="View onboarding guide">
              View Onboarding Guide
            </Button>
          </Link>
        </section>

        {/* Premium Features */}
        <PremiumFeature feature="welcomeAnalytics">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-xl font-semibold mb-4">Trending Vehicles</h2>
            {isLoading ? (
              <p className="text-gray-600">Loading...</p>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trendingVehicles.length > 0 ? (
                  trendingVehicles.map((vehicle, index) => (
                    <li key={index} className={`bg-white ${theme.spacingMd} ${theme.borderRadius} ${theme.cardShadow}`}>
                      <p>{vehicle.make} {vehicle.model}</p>
                      <p>Auction Count: {vehicle.count}</p>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No trending vehicles found.</p>
                )}
              </ul>
            )}
          </motion.section>

          <section className="text-center">
            <Button
              onClick={handleStartTour}
              className="bg-purple-500 text-white hover:bg-purple-600"
              disabled={isLoading}
              aria-label="Start guided tour of the dashboard"
            >
              Start Guided Tour
            </Button>
          </section>
        </PremiumFeature>
      </div>
    </AdminLayout>
  );
};

export default GuestDashboard;