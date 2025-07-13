// File: InspectionReportPanel.jsx
// Path: frontend/src/components/mechanic/InspectionReportPanel.jsx
// Author: Cod1 (05051059)
// Purpose: Display summarized inspection history in a scrollable format
// Functions:
// - Fetch and render list of past inspection reports
// - Display status, notes, and timestamp
// - Integrate AI tags and approval actions for specific roles

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PremiumFeature from '@components/common/PremiumFeature';
import { useLanguage } from '@components/common/MultiLanguageSupport';
import LoadingSpinner from '@components/common/LoadingSpinner';

const InspectionReportPanel = ({ mechanicId }) => {
  const { getTranslation } = useLanguage();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/mechanic/${mechanicId}/inspections`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(res.data);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [mechanicId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="text-lg font-bold mb-4">{getTranslation('inspectionHistory')}</h3>
      <div className="max-h-96 overflow-y-auto space-y-4">
        {reports.map((r) => (
          <div key={r.id} className="border p-3 rounded bg-gray-50">
            <p className="text-sm font-semibold">{r.vehicle?.make} {r.vehicle?.model} ({r.vehicle?.year})</p>
            <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</p>
            <p className="text-sm mt-1">{r.notes}</p>

            {r.aiTags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {r.aiTags.map((tag, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{tag}</span>
                ))}
              </div>
            )}

            <PremiumFeature feature="mechanicEnterprise">
              <div className="mt-2 text-sm text-green-600">{getTranslation('aiTagsEnhanced')}</div>
            </PremiumFeature>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InspectionReportPanel;
