// File: MechanicReportDashboard.jsx
// Path: frontend/src/components/mechanic/MechanicReportDashboard.jsx
// Author: Cod1 (05061619)
// Description: Mechanic report dashboard with leaderboard, AI explainer, and sharing panel

import React, { useState, useEffect } from 'react';
import PremiumFeature from '@/components/common/PremiumFeature';
import LeaderboardPanel from './MechanicLeaderboardPanel';
import AIExplainerChat from './MechanicAIExplainerChat';
import ReportSharingPanel from './MechanicReportSharingPanel';
import { fetchInspectionReports } from '@/utils/inspectionReportService';

const MechanicReportDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const res = await fetchInspectionReports();
        setReports(res.data);
      } catch (err) {
        console.error('Error loading reports:', err);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mechanic Report Dashboard</h1>

      {loading ? (
        <p>Loading reports...</p>
      ) : (
        <div className="space-y-4">
          {reports.map((report, index) => (
            <div key={index} className="border p-3 shadow rounded">
              <h2 className="font-semibold text-lg">Vehicle: {report.vin}</h2>
              <p>Condition: {report.condition}</p>
              <p>Damage Tags: {report.tags?.join(', ')}</p>
            </div>
          ))}
        </div>
      )}

      <PremiumFeature flag="leaderboardPremium">
        <LeaderboardPanel />
      </PremiumFeature>

      <PremiumFeature flag="aiExplainerPremium">
        <AIExplainerChat />
      </PremiumFeature>

      <PremiumFeature flag="reportSharingPremium">
        <ReportSharingPanel reports={reports} />
      </PremiumFeature>
    </div>
  );
};

export default MechanicReportDashboard;
