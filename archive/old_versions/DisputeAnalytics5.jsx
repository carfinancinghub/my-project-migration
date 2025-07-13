// File: DisputeAnalytics.jsx
// Path: frontend/src/components/disputes/DisputeAnalytics.jsx
// Purpose: Premium dashboard for visualizing dispute trends, risk levels, and AI insights (multi-language supported)
// Author: Cod2
// Date: 2025-05-01
// Status: 👑 Cod2 Crown Certified

import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import PremiumFeature from '@/components/common/PremiumFeature';
import MultiLanguageSupport from '@/components/common/MultiLanguageSupport';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { exportDisputeAnalyticsPDF } from '@/utils/exportUtils/arbitrationExportTools';
import { getAISuccessRate, getToneAnalysis, getEscalationAdvice } from '@/utils/AIDisputePredictor';
import { toast } from 'react-toastify';

const DisputeAnalytics = () => {
  const [disputes, setDisputes] = useState([]);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);

  // Translations (example, dynamic if MultiLanguageSupport provides)
  const t = MultiLanguageSupport(language, {
    totalDisputes: { en: 'Total Disputes', es: 'Disputas Totales', fr: 'Litiges Totals' },
    resolved: { en: 'Resolved', es: 'Resueltas', fr: 'Résolues' },
    risk: { en: 'Risk Level', es: 'Nivel de Riesgo', fr: 'Niveau de Risque' },
    aiSuccess: { en: 'AI Success Predictor', es: 'Predicción de Éxito AI', fr: 'Prédiction de Succès IA' },
    exportPDF: { en: 'Export Analytics PDF', es: 'Exportar PDF Analítico', fr: 'Exporter le PDF Analytique' },
    escalationAdvice: { en: 'Resolution Advice', es: 'Sugerencia de Resolución', fr: 'Conseil de Résolution' }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/disputes/analytics');
        setDisputes(res.data);
      } catch (err) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  const total = disputes.length;
  const resolved = disputes.filter((d) => d.status === 'Resolved').length;

  const renderChart = (ctxId, data, label) => {
    const ctx = document.getElementById(ctxId);
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label,
          data: data.values,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      }
    });
  };

  useEffect(() => {
    const freq = disputes.reduce((acc, d) => {
      const month = new Date(d.createdAt).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
    renderChart('disputeFrequencyChart', {
      labels: Object.keys(freq),
      values: Object.values(freq)
    }, t.totalDisputes);
  }, [disputes]);

  const handleExport = async () => {
    try {
      await exportDisputeAnalyticsPDF(disputes, language);
      toast.success('📄 PDF exported');
    } catch {
      toast.error('Failed to export PDF');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">{t.totalDisputes}</h2>
      <div className="text-gray-700">✅ {total} total / ✅ {resolved} {t.resolved}</div>

      <div className="flex justify-end">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="en">🌐 English</option>
          <option value="es">🌐 Español</option>
          <option value="fr">🌐 Français</option>
        </select>
      </div>

      <canvas id="disputeFrequencyChart" height="150" className="w-full"></canvas>

      <PremiumFeature feature="aiDisputeTrends">
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold">{t.aiSuccess}</h3>
          <p>🔮 {getAISuccessRate(disputes)}% {t.aiSuccess}</p>

          <h3 className="font-semibold">{t.risk}</h3>
          <ul className="text-sm list-disc list-inside">
            {disputes.map((d) => (
              <li key={d._id}>
                {d._id.slice(-6)} - Risk: {(d.riskScore * 100).toFixed(1)}%
              </li>
            ))}
          </ul>

          <h3 className="font-semibold">{t.escalationAdvice}</h3>
          <ul className="text-sm list-disc list-inside text-indigo-600">
            {disputes.map((d) => (
              <li key={d._id}>{d._id.slice(-6)} → {getEscalationAdvice(d)}</li>
            ))}
          </ul>

          <h3 className="font-semibold text-red-500">Tone Analysis (NLP)</h3>
          <ul className="text-sm list-inside">
            {disputes.map((d) => {
              const tone = getToneAnalysis(d.description || '');
              return (
                <li key={d._id} className={`text-${tone.color}-600`}>
                  {d._id.slice(-6)} — {tone.label}
                </li>
              );
            })}
          </ul>

          <button
            onClick={handleExport}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-all"
          >
            {t.exportPDF}
          </button>
        </div>
      </PremiumFeature>
    </div>
  );
};

export default DisputeAnalytics;
