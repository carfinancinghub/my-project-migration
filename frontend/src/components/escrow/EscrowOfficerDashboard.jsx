/**
 * File: EscrowOfficerDashboard.jsx
 * Path: frontend/src/components/escrow/EscrowOfficerDashboard.jsx
 * Purpose: Dashboard for Escrow Officers to manage active escrow transactions
 * Author: Rivers Auction Dev Team
 * Date: 2025-05-25
 * Updated: Replaced SEOHead with EscrowSEOHead, applied theme.js utilities, enhanced comments and accessibility
 * Cod2 Crown Certified: Yes
 * Features:
 * - Displays active escrow transactions with Deal ID, status, buyer, seller, and amount
 * - Actions to release funds, hold/flag a transaction, and view full details
 * - Secure token-protected API requests for transaction management
 * - Responsive card layout with hover effects and flex spacing
 * - Error and loading states with user feedback
 * - Integrated modal for detailed transaction view
 * - Navigation link to Escrow Summary Dashboard
 * Functions:
 * - fetchTransactions(): Fetches escrow transactions from /api/escrow-transactions
 * - handleAction(id, action): Performs actions (release, hold) on a transaction and refreshes the list
 * Dependencies: axios, AdminLayout, LoadingSpinner, Button, Card, EscrowTransactionDetailModal, ErrorBoundary, EscrowSEOHead, theme
 */

// Imports
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import EscrowTransactionDetailModal from '@/components/escrow/EscrowTransactionDetailModal';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import EscrowSEOHead from '@/components/escrow/EscrowSEOHead';
import { theme } from '@/styles/theme';

const EscrowOfficerDashboard = () => {
  // State Management
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEscrow, setSelectedEscrow] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch Escrow Transactions on Component Mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/escrow-transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(res.data);
      } catch (err) {
        console.error('Error loading escrow transactions:', err);
        setError('❌ Failed to load escrow data');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [token]);

  // Handle Escrow Transaction Actions (Release, Hold)
  const handleAction = async (id, action) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/escrow-transactions/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/escrow-transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error(`Failed to ${action} transaction`, err);
      alert(`❌ Failed to ${action} transaction`);
    }
  };

  // UI Rendering
  return (
    <AdminLayout>
      <EscrowSEOHead title="Escrow Officer Dashboard" description="Manage escrow transactions securely with Rivers Auction." />
      <ErrorBoundary>
        <div className={`${theme.spacingLg} space-y-6`}>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-indigo-700">🔐 Escrow Officer Dashboard</h1>
            <Link
              to="/escrow/summary"
              className={`${theme.primaryButton}`}
              aria-label="Navigate to Escrow Summary Dashboard"
            >
              View Summary Dashboard
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

          {!loading && !error && transactions.length === 0 && (
            <p className="text-center text-gray-500">No active escrow transactions.</p>
          )}

          {!loading && !error && transactions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transactions.map((tx) => (
                <Card key={tx._id} className={`flex flex-col justify-between ${theme.spacingMd} ${theme.cardShadow}`}>
                  <div className="space-y-2">
                    <p><strong>Deal ID:</strong> {tx.dealId || 'N/A'}</p>
                    <p><strong>Status:</strong> {tx.status}</p>
                    <p><strong>Buyer:</strong> {tx.buyer?.email || 'Unknown'}</p>
                    <p><strong>Seller:</strong> {tx.seller?.email || 'Unknown'}</p>
                    <p><strong>Amount:</strong> ${tx.amount?.toLocaleString() || '0.00'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                      onClick={() => handleAction(tx._id, 'release')}
                      className={`${theme.successText} bg-green-600 hover:bg-green-700`}
                      aria-label={`Release funds for transaction ${tx._id}`}
                    >
                      ✅ Release Funds
                    </Button>
                    <Button
                      onClick={() => handleAction(tx._id, 'hold')}
                      className={`${theme.errorText} bg-red-600 hover:bg-red-700`}
                      aria-label={`Hold or flag transaction ${tx._id}`}
                    >
                      ❌ Hold / Flag
                    </Button>
                    <Button
                      onClick={() => setSelectedEscrow(tx)}
                      className={`${theme.infoText} bg-blue-600 hover:bg-blue-700`}
                      aria-label={`View details for transaction ${tx._id}`}
                    >
                      🔍 View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Modal to View Escrow Details */}
          {selectedEscrow && (
            <EscrowTransactionDetailModal
              escrow={selectedEscrow}
              onClose={() => setSelectedEscrow(null)}
            />
          )}
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default EscrowOfficerDashboard;