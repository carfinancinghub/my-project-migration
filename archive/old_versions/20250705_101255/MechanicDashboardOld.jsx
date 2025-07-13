/**
 * File: MechanicDashboard.jsx
 * Path: frontend/src/components/mechanic/MechanicDashboard.jsx
 * Purpose: Core and premium enhancements for the MechanicDashboard in Rivers Auction
 * Author: Cod1 (05060857)
 * Date: May 06, 2025 — 08:57 AM California Time
 * Cod2 Crown Certified
 *
 * Features:
 * - Modular mechanic role views (inspection, diagnostics, VIN, hauler, shifts, etc.)
 * - Live task socket integration
 * - Premium features gated via PremiumFeature (diagnostics, trend charts, escrow sync)
 * - NEW: PremiumBadgeHintCard added for real-time AI-driven badge guidance
 */

import React, { useState } from 'react';
import VINDecoder from '@components/mechanic/VINDecoder';
import MechanicShiftPlanner from '@components/mechanic/MechanicShiftPlanner';
import VehicleInspectionModule from '@components/mechanic/VehicleInspectionModule';
import AIDiagnosticsAssistant from '@components/mechanic/AIDiagnosticsAssistant';
import VehicleHealthTrendCharts from '@components/mechanic/VehicleHealthTrendCharts';
import RepairScheduler from '@components/mechanic/RepairScheduler';
import HaulerCollaboration from '@components/mechanic/HaulerCollaboration';
import EscrowStatusSync from '@components/mechanic/EscrowStatusSync';
import PremiumBadgeHintCard from '@components/mechanic/PremiumBadgeHintCard';

import useMechanicSocket from '@hooks/useMechanicSocket';
import { PremiumFeature } from '@components/common/PremiumFeature';
import { useLanguage, getTranslation } from '@components/common/MultiLanguageSupport';

const MechanicDashboard = () => {
  const [activeTab, setActiveTab] = useState('inspection');
  const { language } = useLanguage();
  const taskFeed = useMechanicSocket();

  // --- Render current section based on selected tab ---
  const renderSection = () => {
    switch (activeTab) {
      case 'inspection':
        return <VehicleInspectionModule />;
      case 'diagnostics':
        return (
          <PremiumFeature feature="mechanicEnterprise">
            <AIDiagnosticsAssistant />
          </PremiumFeature>
        );
      case 'trends':
        return (
          <PremiumFeature feature="mechanicPro">
            <VehicleHealthTrendCharts />
          </PremiumFeature>
        );
      case 'repairs':
        return <RepairScheduler />;
      case 'vin':
        return <VINDecoder />;
      case 'shifts':
        return <MechanicShiftPlanner />;
      case 'hauler':
        return <HaulerCollaboration />;
      case 'escrow':
        return (
          <PremiumFeature feature="mechanicEnterprise">
            <EscrowStatusSync />
          </PremiumFeature>
        );
      case 'live':
        return (
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold mb-2">{getTranslation('liveTaskFeed', language)}</h2>
            {taskFeed.map((task, idx) => (
              <div key={idx} className="border p-2 mb-2 rounded">
                <p>{getTranslation('taskId', language)}: {task.id}</p>
                <p>{getTranslation('vehicleId', language)}: {task.vehicleId}</p>
                <p>{getTranslation('priority', language)}: {task.priority}</p>
                <p>{getTranslation('timestamp', language)}: {task.timestamp}</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-2">{getTranslation('mechanicDashboard', language)}</h1>

      {/* Premium Badge Hint for Enterprise Mechanics */}
      <PremiumFeature feature="mechanicEnterprise">
        <PremiumBadgeHintCard mechanicId="mechanic123" isPremium={true} />
      </PremiumFeature>

      <div className="flex flex-wrap gap-2 mb-4">
        {['inspection', 'diagnostics', 'trends', 'repairs', 'vin', 'shifts', 'hauler', 'escrow', 'live'].map(key => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded ${activeTab === key ? 'bg-blue-600 text-white' : 'bg-white border text-gray-800'}`}
          >
            {getTranslation(key, language)}
          </button>
        ))}
      </div>

      {renderSection()}
    </div>
  );
};

export default MechanicDashboard;
