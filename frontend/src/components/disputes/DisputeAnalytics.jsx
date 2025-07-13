// File: DisputeAnalytics.jsx
// Path: frontend/src/components/disputes/DisputeAnalytics.jsx
// Purpose: Premium dashboard for visualizing dispute trends, risk levels, resolution predictors, and multilingual analytics
// Author: Cod2
// Date: 2025-05-01
// Status: 👑 Cod2 Crown Certified

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Chart from 'chart.js/auto';
import { toast } from 'react-toastify';
import PremiumFeature from '@/components/common/PremiumFeature';
import MultiLanguageSupport from '@/components/common/MultiLanguageSupport';
import { fetchDisputeAnalytics, fetchAIPrediction } from '@/utils/AIDisputePredictor';
import { exportDisputeAnalyticsPDF } from '@/utils/exportUtils/arbitrationExportTools';
import logger from '@/utils/logger';

const DisputeAnalytics = () => {
  const [stats, setStats] = useState({ total: 0, resolved: 0 });
  const [riskData, setRiskData] = useState({ low: 0, medium: 0, high: 0 });
  const [timelineData, setTimelineData] = useState([]);
  const [successPrediction, setSuccessPrediction] = useState(null);
  const [toneAnalysis, setToneAnalysis] = useState(null);
  const [language, setLanguage] = useState('en');
  const [escalationAdvice, setEscalationAdvice] = useState('');
  const [socket, setSocket] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // i18n helper
  const t = MultiLanguageSupport(language);

  // Initialize WebSocket for real-time updates
  useEffect(() => {
    const socketInstance = io();
    socketInstance.on('dispute-stats-update', (data) => {
      setStats(data.stats);
      setRiskData(data.riskData);
      toast.info('📈 Live dispute analytics updated!');
    });
    setSocket(socketInstance);
    return () => socketInstance.disconnect();
  }, []);

  // Fetch all analytics
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const { stats, riskLevels, timeline, prediction, tone, escalation } = await fetchDisputeAnalytics();
        setStats(stats);
        setRiskData(riskLevels);
        setTimelineData(timeline);
        setSuccessPrediction(prediction);
        setToneAnalysis(tone);
        setEscalationAdvice(escalation);
      } catch (err) {
        logger.error(err);
        toast.error('Failed to load dispute analytics');
      }
    };
    loadAnalytics();
  }, []);

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      await exportDisputeAnalyticsPDF({ stats, riskData, timelineData, successPrediction, toneAnalysis, language });
      toast.success('PDF exported successfully');
    } catch (err) {
      logger.error(err);
      toast.error('PDF export failed');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('Dispute Analytics')}</h2>
        <select
          className="border rounded px-2 py-1"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          aria-label="Language Selector"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">{t('Total Disputes')}</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">{t('Resolved Disputes')}</h3>
          <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
        </div>
      </div>

      <PremiumFeature feature="aiDisputeTrends">
        <div className="bg-white p-4 rounded shadow animate-fadeIn">
          <h3 className="font-semibold mb-2">{t('Risk Breakdown')}</h3>
          <ul>
            <li>🟢 {t('Low')}: {riskData.low}</li>
            <li>🟠 {t('Medium')}: {riskData.medium}</li>
            <li>🔴 {t('High')}: {riskData.high}</li>
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow animate-fadeIn">
          <h3 className="font-semibold mb-2">{t('Success Prediction')}</h3>
          <p className="text-lg font-bold">{successPrediction}%</p>
        </div>

        <div className="bg-white p-4 rounded shadow animate-fadeIn">
          <h3 className="font-semibold mb-2">{t('Tone Analysis')}</h3>
          <p>{toneAnalysis}</p>
        </div>

        <div className="bg-white p-4 rounded shadow animate-fadeIn">
          <h3 className="font-semibold mb-2">{t('Escalation Suggestion')}</h3>
          <p>{escalationAdvice}</p>
        </div>

        <button
          onClick={handleExportPDF}
          className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded mt-4 hover:bg-indigo-700 disabled:opacity-50"
          disabled={isExporting}
        >
          {isExporting ? t('Exporting...') : t('Export Analytics PDF')}
        </button>
      </PremiumFeature>

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default DisputeAnalytics;
