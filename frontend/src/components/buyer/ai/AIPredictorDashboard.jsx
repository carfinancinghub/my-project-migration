/**
 * File: AIPredictorDashboard.jsx
 * Path: frontend/src/components/buyer/ai/AIPredictorDashboard.jsx
 * Purpose: Buyer-specific UI for viewing AI-powered results (bid success predictions, purchase recommendations)
 * Author: Cod2
 * Date: 2025-04-29
 * Updated: Adapted for buyer role, added SEOHead, used AdminLayout, applied theme.js utilities, enhanced comments and accessibility
 * Cod2 Crown Certified: Yes
 * Features:
 * - Displays AI-generated bid success predictions with confidence scores
 * - Shows AI-driven purchase recommendations for the buyer
 * - Export functionality for AI report in PDF format
 * - Responsive layout with TailwindCSS and toast notifications
 * Functions:
 * - fetchAIResults(): Fetches bid success predictions and purchase recommendations from /api/ai/buyer endpoints
 * - handleExportPDF(): Exports AI report as a PDF via /api/ai/export-report
 * Dependencies: axios, toast, LoadingSpinner, ErrorBoundary, Button, AdminLayout, SEOHead, theme
 */

// Imports
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorBoundary from '@components/common/ErrorBoundary';
import { Button } from '@components/common/Button';
import AdminLayout from '@components/admin/layout/AdminLayout';
import SEOHead from '@components/common/SEOHead';
import { theme } from '@styles/theme';

const AIPredictorDashboard = () => {
  // State Management
  const [bidPredictions, setBidPredictions] = useState([]);
  const [purchaseRecommendations, setPurchaseRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch AI Reports for Buyer from Backend
  useEffect(() => {
    const fetchAIResults = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Auth token missing');

        const [bidsRes, recommendationsRes] = await Promise.all([
          axios.get('/api/ai/buyer/bid-predictions', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/ai/buyer/purchase-recommendations', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setBidPredictions(bidsRes.data || []);
        setPurchaseRecommendations(recommendationsRes.data || []);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load AI results');
      } finally {
        setLoading(false);
      }
    };

    fetchAIResults();
  }, []);

  // Export AI Report as PDF
  const handleExportPDF = async () => {
    try {
      const res = await axios.get('/api/ai/export-report', {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Buyer_AI_Report.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      toast.error('PDF export failed.');
    }
  };

  // Render Loading State
  if (loading) return <LoadingSpinner />;

  // UI Rendering
  return (
    <AdminLayout>
      <SEOHead title="Buyer AI Predictor Dashboard - CFH Auction Platform" />
      <ErrorBoundary>
        <div className={`${theme.spacingLg}`}>
          <h2 className="text-2xl font-bold mb-4 text-center">Buyer AI Predictor Dashboard</h2>

          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-blue-600">Bid Success Predictions</h3>
            </div>
            <ul className="space-y-3 mt-3">
              {bidPredictions.map((pred, idx) => (
                <li key={idx} className={`bg-blue-50 ${theme.spacingMd} ${theme.borderRadius} ${theme.cardShadow}`}>
                  <p className={`${theme.fontSizeSm} text-gray-700`}>
                    <strong>Auction ID:</strong> {pred.auctionId} | <strong>Confidence:</strong> {pred.confidence}% | <strong>Success Likelihood:</strong> {pred.likelihood}%
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-green-600">Purchase Recommendations</h3>
            <ul className="space-y-3 mt-3">
              {purchaseRecommendations.map((rec, idx) => (
                <li key={idx} className={`bg-green-50 ${theme.spacingMd} ${theme.borderRadius} ${theme.cardShadow}`}>
                  <p className={`${theme.fontSizeSm} text-gray-700`}>
                    <strong>Vehicle:</strong> {rec.make} {rec.model} | <strong>Year:</strong> {rec.year} | <strong>Reason:</strong> {rec.reason}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <Button
              onClick={handleExportPDF}
              className={`${theme.successText} bg-green-600 hover:bg-green-700`}
              aria-label="Export full AI report as PDF"
            >
              Export Full AI Report (PDF)
            </Button>
          </div>
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default AIPredictorDashboard;