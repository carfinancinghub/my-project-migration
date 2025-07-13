// File: RepairScheduler.jsx
// Path: frontend/src/components/mechanic/RepairScheduler.jsx
// Author: Cod1 (05051059)
// Purpose: Allow mechanics to view, schedule, and assign repairs
// Functions:
// - Display pending and scheduled repair jobs
// - Assign time slots and mark completion
// - Gate analytics behind mechanicPro

import React, { useState, useEffect } from 'react';
import PremiumFeature from '@components/common/PremiumFeature';
import { useLanguage } from '@components/common/MultiLanguageSupport';

const RepairScheduler = () => {
  const { getTranslation } = useLanguage();
  const [repairs, setRepairs] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setRepairs([
        {
          id: 'R001',
          vehicle: 'Toyota Camry 2021',
          issue: 'Brake Pad Replacement',
          scheduled: '2025-05-06T09:00:00',
          status: 'Scheduled'
        },
        {
          id: 'R002',
          vehicle: 'Ford F-150 2022',
          issue: 'Oil Leak',
          scheduled: '',
          status: 'Pending'
        }
      ]);
    }, 800);
  }, []);

  const markAsCompleted = (id) => {
    setRepairs((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'Completed', scheduled: new Date().toISOString() } : r
      )
    );
  };

  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="text-xl font-semibold mb-4">{getTranslation('repairSchedule')}</h2>
      <ul className="space-y-4">
        {repairs.map((job) => (
          <li key={job.id} className="border-b pb-2">
            <p className="text-sm font-medium">
              <strong>{job.vehicle}</strong>: {job.issue}
            </p>
            <p className="text-xs text-gray-500">
              {job.status === 'Pending'
                ? getTranslation('pendingRepair')
                : `${getTranslation('scheduledFor')}: ${new Date(job.scheduled).toLocaleString()}`}
            </p>
            {job.status !== 'Completed' && (
              <button
                onClick={() => markAsCompleted(job.id)}
                className="mt-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                {getTranslation('markCompleted')}
              </button>
            )}
          </li>
        ))}
      </ul>

      <PremiumFeature feature="mechanicPro">
        <div className="mt-6 border-t pt-4">
          <p className="text-sm text-gray-700">
            {getTranslation('advancedDiagnosticsAvailable')}
          </p>
        </div>
      </PremiumFeature>
    </div>
  );
};

export default RepairScheduler;
