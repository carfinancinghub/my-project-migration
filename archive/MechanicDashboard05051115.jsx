// File: MechanicDashboard.jsx
// Path: frontend/src/components/mechanic/MechanicDashboard.jsx
// Author: Cod1 (05051115)
// Purpose: Mechanic hub for inspections, repairs, history, AI tools, and hauler alerts
// Functions:
// - Show task history (inspections + repairs)
// - Integrate AI tools and repair schedule
// - Drag/drop photo preview for inspections
// - Real-time alert panel for new jobs

import React, { useEffect, useState } from 'react';
import InspectionForm from '@components/mechanic/InspectionForm';
import RepairScheduler from '@components/mechanic/RepairScheduler';
import AIDiagnosticsAssistant from '@components/mechanic/AIDiagnosticsAssistant';
import VehicleHealthTrendCharts from '@components/mechanic/VehicleHealthTrendCharts';
import HaulerCollaboration from '@components/mechanic/HaulerCollaboration';
import PremiumFeature from '@components/common/PremiumFeature';
import InspectionReportViewer from '@components/mechanic/InspectionReportViewer';
import ImageUploader from '@components/common/ImageUploader';
import { useLanguage } from '@components/common/MultiLanguageSupport';

const MechanicDashboard = () => {
  const { getTranslation } = useLanguage();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Mocked real-time job alerts
    setTimeout(() => {
      setAlerts([
        { id: 'A001', vehicle: 'Nissan Altima 2023', task: 'New Inspection Assigned' },
        { id: 'A002', vehicle: 'Honda Civic 2022', task: 'Brake Check' }
      ]);
    }, 1000);
  }, []);

  const mockCompletedTasks = [
    {
      id: 'C001',
      type: 'Inspection',
      vehicle: 'Chevy Malibu 2020',
      date: '2025-04-21',
      status: 'Completed'
    },
    {
      id: 'C002',
      type: 'Repair',
      vehicle: 'Ford F-150 2022',
      date: '2025-04-28',
      status: 'Completed'
    }
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">🔧 {getTranslation('mechanicHub')}</h1>

      {/* Real-Time Alerts Dashboard */}
      <div className="bg-yellow-50 p-4 border-l-4 border-yellow-400">
        <h2 className="font-semibold text-yellow-800 mb-2">{getTranslation('realTimeAlerts')}</h2>
        <ul className="list-disc pl-5">
          {alerts.map(alert => (
            <li key={alert.id} className="text-sm">{alert.vehicle}: {alert.task}</li>
          ))}
        </ul>
      </div>

      {/* Inspection Form with photo drag/drop */}
      <div>
        <h2 className="text-xl font-semibold mb-2">{getTranslation('newInspection')}</h2>
        <ImageUploader label={getTranslation('uploadDamagePhotos')} />
        <InspectionForm jobId="J123" />
      </div>

      {/* Repair Scheduler */}
      <RepairScheduler />

      {/* Task History */}
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold mb-3">{getTranslation('taskHistory')}</h2>
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-1">{getTranslation('taskType')}</th>
              <th className="px-2 py-1">{getTranslation('vehicle')}</th>
              <th className="px-2 py-1">{getTranslation('date')}</th>
              <th className="px-2 py-1">{getTranslation('status')}</th>
            </tr>
          </thead>
          <tbody>
            {mockCompletedTasks.map(task => (
              <tr key={task.id} className="border-t">
                <td className="px-2 py-1">{task.type}</td>
                <td className="px-2 py-1">{task.vehicle}</td>
                <td className="px-2 py-1">{task.date}</td>
                <td className="px-2 py-1 text-green-600">{task.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Premium AI Diagnostics */}
      <PremiumFeature feature="mechanicEnterprise">
        <AIDiagnosticsAssistant />
      </PremiumFeature>

      {/* Premium Vehicle Health Trends */}
      <PremiumFeature feature="mechanicPro">
        <VehicleHealthTrendCharts />
      </PremiumFeature>

      {/* Notify Haulers */}
      <HaulerCollaboration />
    </div>
  );
};

export default MechanicDashboard;
