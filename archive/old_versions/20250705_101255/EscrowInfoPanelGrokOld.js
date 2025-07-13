// File: EscrowInfoPanel.js
// Path: frontend/src/components/escrow/EscrowInfoPanel.js
// Purpose: Display escrow info with premium analytics, risk insights, and export
// Author: Cod2
// Date: 2025-05-01
// 👑 Cod2 Crown Certified

// Features:
// - showBasicEscrowDetails()
// - fetchAndRenderRiskInsights()
// - exportEscrowAnalyticsPDF()

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js/auto';
import { toast } from 'react-toastify';
import axios from 'axios';
import PremiumFeature from '@/components/common/PremiumFeature';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { exportEscrowAnalyticsPDF } from '@utils/analyticsExportUtils';

const EscrowInfoPanel = ({ escrowId }) => {
  const [escrow, setEscrow] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEscrow = async () => {
      try {
        const res = await axios.get(`/api/escrow/${escrowId}`);
        setEscrow(res.data);
        setLoading(false);
      } catch (err) {
        toast.error('Failed to load escrow details');
      }
    };

    const fetchRisk = async () => {
      try {
        const res = await axios.get(`/api/escrow/${escrowId}/risk`);
        setRiskData(res.data);
      } catch (err) {
        toast.warning('Risk insights unavailable');
      }
    };

    fetchEscrow();
    fetchRisk();
  }, [escrowId]);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportEscrowAnalyticsPDF(escrowId);
      toast.success('PDF Exported!');
    } catch (err) {
      toast.error('PDF export failed');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Escrow Details</h2>
      <p><strong>Amount:</strong> ${escrow.amount}</p>
      <p><strong>Status:</strong> {escrow.status}</p>
      <p><strong>Buyer:</strong> {escrow.buyerId}</p>
      <p><strong>Seller:</strong> {escrow.sellerId}</p>

      <PremiumFeature feature="escrowAnalytics">
        {riskData && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-700">AI Risk Insight:</h3>
            <p className={`text-sm ${riskData.level === 'high' ? 'text-red-600' : 'text-green-600'}`}>
              {riskData.message}
            </p>
          </div>
        )}
        <div className="mt-6">
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export PDF Report'}
          </button>
        </div>
      </PremiumFeature>
    </div>
  );
};

EscrowInfoPanel.propTypes = {
  escrowId: PropTypes.string.isRequired,
};

export default EscrowInfoPanel;
