// File: BuyerLenderResults.jsx
// Path: frontend/src/components/buyer/BuyerLenderResults.jsx
// 👑 Cod1 + Cod2 Crown Certified

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { Tabs, Tab } from '@/components/ui/tabs';
import { toast } from 'react-toastify';
import logger from '@/utils/logger';
import PremiumFeature from '@/components/common/PremiumFeature';
import LenderExportPanel from '@/components/lender/LenderExportPanel';

const BuyerLenderResults = ({ userId }) => {
  const [lenderMatches, setLenderMatches] = useState([]);
  const [termsHistory, setTermsHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLenderMatches();
    fetchTermsHistory(userId);
  }, [userId]);

  const fetchLenderMatches = async () => {
    try {
      const res = await axios.get(`/api/lenders/matches/${userId}`);
      setLenderMatches(res.data);
    } catch (err) {
      logger.error('Failed to fetch lender matches:', err);
      toast.error('Error loading lender matches.');
    }
  };

  const fetchTermsHistory = async (userId) => {
    try {
      const res = await axios.get(`/api/lenders/terms-history/${userId}`);
      setTermsHistory(res.data || []);
    } catch (err) {
      logger.error('Failed to fetch terms history:', err);
    }
  };

  const renderTermsHistoryChart = (data) => {
    const ctx = document.getElementById('termsHistoryChart');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(item => item.date),
        datasets: [{
          label: 'Interest Rate Over Time',
          data: data.map(item => item.rate),
          borderWidth: 2,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        animation: {
          duration: 800,
          easing: 'easeInOutQuart'
        },
        plugins: {
          legend: { display: true }
        }
      }
    });
  };

  useEffect(() => {
    if (termsHistory.length > 0) renderTermsHistoryChart(termsHistory);
  }, [termsHistory]);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Matched Lenders</h2>
      <div className="space-y-2">
        {lenderMatches.map((lender) => (
          <div key={lender.id} className="border p-3 rounded-lg shadow-sm">
            <div className="font-semibold">{lender.name}</div>
            <div className="text-sm text-gray-600">Rate: {lender.rate}% | Term: {lender.term} months</div>
          </div>
        ))}
      </div>

      <PremiumFeature feature="lenderExportAnalytics">
        <Tabs>
          <Tab title="Export Lender Terms">
            <div className="mt-4">
              <LenderExportPanel userId={userId} />
            </div>
          </Tab>
          <Tab title="Terms History Analytics">
            <div className="mt-4">
              <canvas id="termsHistoryChart" className="w-full h-64 transition-all duration-500 ease-in-out" />
            </div>
          </Tab>
        </Tabs>
      </PremiumFeature>
    </div>
  );
};

export default BuyerLenderResults;
