// File: MechanicDashboard.jsx
// Path: frontend/src/components/mechanic/MechanicDashboard.jsx
// Author: Cod1 (05051047)
// Purpose: Mechanic portal to track inspections, repair schedules, and vehicle diagnostics
// Functions:
// - Show inspection queue
// - Render repair schedule section
// - Gate premium AI insights

import React, { useEffect, useState } from 'react';
import PremiumFeature from '@components/common/PremiumFeature';
import VehicleInspectionModule from '@components/mechanic/VehicleInspectionModule';
import RepairScheduler from '@components/mechanic/RepairScheduler';
import MechanicReviewPanel from '@components/mechanic/MechanicReviewPanel';
import { useLanguage } from '@components/common/MultiLanguageSupport';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { logger } from '@utils/logger';

const MechanicDashboard = ({ mechanicId = 'default123' }) => {
  const { getTranslation } = useLanguage();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await axios.get(`/api/mechanic/${mechanicId}/tasks`);
        setTasks(res.data);
      } catch (err) {
        logger.error('Error loading mechanic tasks', err);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, [mechanicId]);

  return (
    <div className="p-6 bg-gray-100 space-y-6">
      <h1 className="text-3xl font-bold">{getTranslation('mechanicDashboard')}</h1>

      {/* Recent Inspections */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-2">{getTranslation('recentInspections')}</h2>
        {loading ? (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">{getTranslation('noInspections')}</p>
        ) : (
          tasks.map((task, idx) => (
            <MechanicReviewPanel key={idx} inspection={task} />
          ))
        )}
      </div>

      {/* Inspection Form Module */}
      <VehicleInspectionModule />

      {/* Repair Schedule */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-2">{getTranslation('repairSchedule')}</h2>
        <RepairScheduler />
      </div>

      {/* AI Diagnostic Insights */}
      <PremiumFeature feature="mechanicPro">
        <div className="bg-indigo-50 border border-indigo-200 rounded shadow p-4">
          <h2 className="text-lg font-medium text-indigo-700">{getTranslation('aiDiagnostics')}</h2>
          <p className="text-sm text-indigo-600 mt-2">{getTranslation('aiDiagnosticInsightsPlaceholder')}</p>
        </div>
      </PremiumFeature>
    </div>
  );
};

export default MechanicDashboard;
