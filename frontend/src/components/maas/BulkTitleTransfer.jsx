// File: BulkTitleTransfer.jsx
// Path: frontend/src/components/title/BulkTitleTransfer.jsx
// 👑 Cod1 Crown Certified — AI-Assisted Title Transfer System with Fraud Detection, Export, Compliance Warnings, and Badge Progression

/**
 * 🚀 Features:
 * - 📑 Multi-file upload via @components/common/DocumentUploader.jsx
 * - 🧠 AI fraud detection (pattern-based anomaly flags)
 * - 📋 Compliance alerts based on predefined rule violations
 * - 📤 PDF/CSV export via @utils/analyticsExportUtils.js
 * - 🏅 Gamified progress tracker for batch completions
 * - 🧩 Modular design for easy integration with AdminTitleDashboard
 * - 🎨 Styled with TailwindCSS and responsive layout
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DocumentUploader from '@components/common/DocumentUploader';
import Button from '@components/common/Button';
import { exportToPDF, exportToCSV } from '@utils/analyticsExportUtils';

const BulkTitleTransfer = ({ userId }) => {
  const [documents, setDocuments] = useState([]);
  const [aiFlags, setAiFlags] = useState([]);
  const [complianceWarnings, setComplianceWarnings] = useState([]);
  const [transferProgress, setTransferProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // 🔍 AI fraud check (mocked logic for demo)
  const runFraudDetection = () => {
    const flagged = documents.filter(doc =>
      doc.name.toLowerCase().includes('temp') ||
      doc.name.length < 5
    );
    setAiFlags(flagged.map(f => f.name));
  };

  // ⚖️ Compliance checker (mock rules)
  const checkCompliance = () => {
    const nonCompliant = documents.filter(doc =>
      !doc.name.toLowerCase().includes('title')
    );
    setComplianceWarnings(nonCompliant.map(f => `Missing 'title' in ${f.name}`));
  };

  const simulateSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setTransferProgress(documents.length * 10); // 10 points per doc
      setSubmitting(false);
    }, 1500);
  };

  const handleExport = (type) => {
    const exportData = documents.map(doc => ({
      fileName: doc.name,
      status: aiFlags.includes(doc.name) ? '⚠️ Flagged' : '✅ Clean',
    }));

    if (type === 'pdf') exportToPDF(exportData, 'Title_Transfer_Report');
    else exportToCSV(exportData, 'Title_Transfer_Report');
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📁 Bulk Title Transfer Processor</h2>

      {/* Document Uploader */}
      <DocumentUploader documents={documents} setDocuments={setDocuments} />

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 mt-4">
        <Button onClick={runFraudDetection} className="bg-red-500 text-white hover:bg-red-600">
          🧠 Run AI Fraud Scan
        </Button>
        <Button onClick={checkCompliance} className="bg-yellow-500 text-white hover:bg-yellow-600">
          ⚖️ Check Compliance
        </Button>
        <Button onClick={simulateSubmit} disabled={submitting} className="bg-blue-600 text-white hover:bg-blue-700">
          {submitting ? 'Processing...' : '📤 Submit for Title Transfer'}
        </Button>
        <Button onClick={() => handleExport('pdf')} className="bg-indigo-600 text-white hover:bg-indigo-700">
          📄 Export PDF
        </Button>
        <Button onClick={() => handleExport('csv')} className="bg-gray-700 text-white hover:bg-black">
          📊 Export CSV
        </Button>
      </div>

      {/* AI Flags */}
      {aiFlags.length > 0 && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <h3 className="text-red-700 font-semibold mb-2">🚨 AI Fraud Flags</h3>
          <ul className="list-disc ml-5 text-sm text-red-600">
            {aiFlags.map((name, i) => (
              <li key={i}>{name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Compliance Alerts */}
      {complianceWarnings.length > 0 && (
        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <h3 className="text-yellow-700 font-semibold mb-2">⚠️ Compliance Warnings</h3>
          <ul className="list-disc ml-5 text-sm text-yellow-700">
            {complianceWarnings.map((warning, i) => (
              <li key={i}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Badge Progress */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">🏅 Transfer Completion Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-green-500 h-full transition-all duration-700"
            style={{ width: `${Math.min(transferProgress, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">{transferProgress}% complete</p>
        {transferProgress >= 100 && (
          <p className="text-green-600 font-medium mt-2">🎉 Congrats! All titles submitted. Badge awarded.</p>
        )}
      </div>
    </div>
  );
};

BulkTitleTransfer.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default BulkTitleTransfer;
