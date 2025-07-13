/**
 * File: EscrowDashboard.jsx
 * Path: frontend/src/components/escrow/EscrowDashboard.jsx
 * Purpose: Central dashboard for Escrow Admin role with summary stats and quick links
 * Author: Rivers Auction Dev Team
 * Date: 2025-05-25
 * Updated: Replaced SEOHead with EscrowSEOHead, applied theme.js utilities, enhanced comments and accessibility
 * Cod2 Crown Certified: Yes
 * Features:
 * - Displays summary stats: total transactions, pending claims, completed transactions, and resolved claims
 * - Quick links to Escrow Monitor, Escrow Claims, and Escrow Officer Dashboard
 * - Secure token-based API fetch for summary data
 * - Responsive card layout with hover effects, flex spacing, and Crown UI/UX polish
 * - Achievements section for Escrow Officers with milestones
 * - Error and loading states with user feedback
 * Functions:
 * - fetchSummary(): Fetches escrow summary stats from /api/admin/escrow/summary
 * - handleGoToMonitor(): Navigates to the Escrow Monitor page
 * - handleGoToClaims(): Navigates to the Escrow Claims page
 * Dependencies: axios, useNavigate, Link, AdminLayout, LoadingSpinner, ErrorBoundary, Card, Button, EscrowSEOHead, theme
 */

// Imports
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import EscrowSEOHead from '@/components/escrow/EscrowSEOHead';
import { theme } from '@/styles/theme';

const EscrowDashboard = () => {
  // State Management
  const [summary, setSummary] = useState({
    totalTransactions: 0,
    pendingClaims: 0,
    completedTransactions: 0, // Added for achievements
    successfulClaimsResolved: 0, // Added for achievements
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Fetch Escrow Summary Stats on Component Mount
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/escrow/summary`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSummary({
          totalTransactions: res.data.totalTransactions,
          pendingClaims: res.data.pendingClaims,
          completedTransactions: res.data.completedTransactions || 0, // Fallback if not provided
          successfulClaimsResolved: res.data.successfulClaimsResolved || 0, // Fallback if not provided
        });
      } catch (err) {
        console.error('Error loading escrow summary:', err);
        setError('❌ Failed to load escrow dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [token]);

  // Navigation Handlers
  const handleGoToMonitor = () => navigate('/admin/escrow-monitor');
  const handleGoToClaims = () => navigate('/admin/escrow-claims');

  // UI Rendering
  return (
    <AdminLayout>
      <EscrowSEOHead title="Escrow Dashboard" description="View escrow summary stats and manage transactions securely with Rivers Auction." />
      <ErrorBoundary>
        <div className={`${theme.spacingLg} space-y-8`}>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-indigo-700">🏛️ Escrow Summary Dashboard</h1>
            <Link
              to="/escrow/officer"
              className={`${theme.primaryButton}`}
              aria-label="Navigate to Escrow Officer Dashboard to manage transactions"
            >
              Manage Transactions
            </Link>
          </div>

          {loading && (
            <div className="flex justify-center items-center min-h-[50vh]">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <p className={`text-center ${theme.errorText} py-4`} role="alert" aria-live="assertive">{error}</p>
          )}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className={`flex flex-col items-center ${theme.spacingLg} space-y-4 hover:shadow-xl`}>
                  <p className="text-5xl">💵</p>
                  <p className="text-xl font-semibold">Total Transactions</p>
                  <p className="text-2xl font-bold">{summary.totalTransactions}</p>
                  <Button
                    onClick={handleGoToMonitor}
                    className={`${theme.primaryButton}`}
                    aria-label="Navigate to Escrow Monitor to view transactions"
                  >
                    View Escrow Monitor
                  </Button>
                </Card>

                <Card className={`flex flex-col items-center ${theme.spacingLg} space-y-4 hover:shadow-xl`}>
                  <p className="text-5xl">🛡️</p>
                  <p className="text-xl font-semibold">Pending Claims</p>
                  <p className="text-2xl font-bold">{summary.pendingClaims}</p>
                  <Button
                    onClick={handleGoToClaims}
                    className={`${theme.primaryButton}`}
                    aria-label="Navigate to Escrow Claims to manage claims"
                  >
                    Manage Escrow Claims
                  </Button>
                </Card>
              </div>

              {/* Achievements Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className={`flex flex-col items-center ${theme.spacingLg} space-y-4 hover:shadow-xl`}>
                  <p className="text-5xl">🎉</p>
                  <p className="text-xl font-semibold">Completed Transactions</p>
                  <p className="text-2xl font-bold">{summary.completedTransactions}</p>
                  <p className={`${theme.fontSizeSm} text-gray-500`}>
                    Milestone: {summary.completedTransactions >= 100 ? '🏆 Veteran Escrow Officer' : 'Keep going!'}
                  </p>
                </Card>

                <Card className={`flex flex-col items-center ${theme.spacingLg} space-y-4 hover:shadow-xl`}>
                  <p className="text-5xl">🛠️</p>
                  <p className="text-xl font-semibold">Claims Resolved</p>
                  <p className="text-2xl font-bold">{summary.successfulClaimsResolved}</p>
                  <p className={`${theme.fontSizeSm} text-gray-500`}>
                    Milestone: {summary.successfulClaimsResolved >= 50 ? '🏅 Expert Resolver' : 'Keep resolving!'}
                  </p>
                </Card>
              </div>
            </>
          )}
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default EscrowDashboard;