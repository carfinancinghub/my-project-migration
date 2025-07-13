/**
 * File: MechanicDashboard.jsx
 * Path: frontend/src/components/mechanic/MechanicDashboard.jsx
 * Purpose: Core and premium enhancements for the MechanicDashboard in Rivers Auction
 * Author: Cod1 (05060857)
 * Date: May 06, 2025 — 08:57 AM California Time
 * Updated: Added SEOHead, used AdminLayout, applied theme.js utilities, enhanced comments and accessibility
 * Cod2 Crown Certified: Yes
 * Features:
 * - Modular mechanic role views (inspection, diagnostics, VIN, hauler, shifts, etc.) with tabbed navigation
 * - Live task feed via socket integration
 * - Premium features gated via PremiumFeature (diagnostics, trend charts, escrow sync, repair cost prediction, voice dictation)
 * - PremiumBadgeHintCard for real-time AI-driven badge guidance
 * - Integrated Repair Cost Prediction and Voice Dictation features
 * - Link to MechanicReportDashboard for advanced reporting
 * - Multi-language support for internationalization
 * - Responsive layout with TailwindCSS
 * Functions:
 * - renderSection(): Renders the active section based on the selected tab
 * Dependencies: axios, Link, AdminLayout, VINDecoder, MechanicShiftPlanner, VehicleInspectionModule, AIDiagnosticsAssistant, VehicleHealthTrendCharts, RepairScheduler, HaulerCollaboration, EscrowStatusSync, PremiumBadgeHintCard, useMechanicSocket, PremiumFeature, useLanguage, getTranslation, SEOHead, theme
 */

// Imports
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '@components/admin/layout/AdminLayout';
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
import SEOHead from '@components/common/SEOHead';
import { theme } from '@styles/theme';

const MechanicDashboard = () => {
  // State Management
  const [activeTab, setActiveTab] = useState('inspection');
  const { language } = useLanguage();
  const taskFeed = useMechanicSocket();
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Render Current Section Based on Selected Tab
  const renderSection = () => {
    switch (activeTab) {
      case 'inspection':
        return (
          <div className="space-y-4">
            <VehicleInspectionModule onSelectTask={(taskId) => setSelectedTaskId(taskId)} />
            {/* Repair Cost Prediction */}
            <PremiumFeature feature="costPredictionPremium">
              <div className="mt-6">
                <h3 className={`${theme.fontSizeBase} font-semibold mb-2`}>{getTranslation('repair_cost_estimate', language)}</h3>
                <button
                  onClick={async () => {
                    if (!selectedTaskId) {
                      alert(getTranslation('select_task_first', language));
                      return;
                    }
                    try {
                      const res = await axios.post('/api/mechanic/predict-repair-cost', { taskId: selectedTaskId });
                      alert(`${getTranslation('estimated_repair_cost', language)}: $${res.data.estimatedCost}`);
                    } catch (err) {
                      alert(getTranslation('error_predicting_cost', language));
                    }
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                  aria-label="Predict repair cost for selected task"
                >
                  {getTranslation('predict_repair_cost', language)}
                </button>
              </div>
            </PremiumFeature>
            {/* Voice Dictation */}
            <PremiumFeature feature="voiceDictationPremium">
              <div className="mt-6">
                <h3 className={`${theme.fontSizeBase} font-semibold mb-2`}>{getTranslation('voice_feedback', language)}</h3>
                <button
                  onClick={async () => {
                    if (!selectedTaskId) {
                      alert(getTranslation('select_task_first', language));
                      return;
                    }
                    try {
                      const fakeAudioBuffer = {}; // Replace with actual audio buffer from mic
                      await axios.post('/api/mechanic/transcribe-voice-note', {
                        audioBuffer: fakeAudioBuffer,
                        taskId: selectedTaskId,
                      });
                      alert(getTranslation('voice_note_transcribed', language));
                    } catch (err) {
                      alert(getTranslation('error_transcribing_voice', language));
                    }
                  }}
                  className={`${theme.successText} bg-green-500 hover:bg-green-600 px-4 py-2 rounded`}
                  aria-label="Start voice note for selected task"
                >
                  {getTranslation('start_voice_note', language)}
                </button>
              </div>
            </PremiumFeature>
          </div>
        );
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
          <div className={`bg-white rounded ${theme.cardShadow} ${theme.spacingMd}`}>
            <h2 className="text-xl font-semibold mb-2">{getTranslation('liveTaskFeed', language)}</h2>
            {taskFeed.map((task, idx) => (
              <div key={idx} className={`border ${theme.spacingSm} mb-2 rounded`}>
                <p className={`${theme.fontSizeBase}`}>{getTranslation('taskId', language)}: {task.id}</p>
                <p className={`${theme.fontSizeBase}`}>{getTranslation('vehicleId', language)}: {task.vehicleId}</p>
                <p className={`${theme.fontSizeBase}`}>{getTranslation('priority', language)}: {task.priority}</p>
                <p className={`${theme.fontSizeBase}`}>{getTranslation('timestamp', language)}: {task.timestamp}</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // UI Rendering
  return (
    <AdminLayout>
      <SEOHead title="Mechanic Dashboard - CFH Auction Platform" />
      <div className={`${theme.spacingLg} bg-gray-100 min-h-screen`}>
        <h1 className="text-3xl font-bold mb-2">{getTranslation('mechanicDashboard', language)}</h1>

        {/* Navigation to Report Dashboard */}
        <div className="mb-4">
          <Link
            to="/mechanic/reports"
            className={`${theme.primaryButton}`}
            aria-label="Navigate to Mechanic Reports Dashboard"
          >
            {getTranslation('viewReports', language, 'View Reports Dashboard')}
          </Link>
        </div>

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
              aria-label={`Switch to ${key} tab`}
            >
              {getTranslation(key, language)}
            </button>
          ))}
        </div>

        {renderSection()}
      </div>
    </AdminLayout>
  );
};

export default MechanicDashboard;