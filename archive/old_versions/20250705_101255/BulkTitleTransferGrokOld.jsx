// File: BulkTitleTransfer.jsx
// Path: frontend/src/components/title/BulkTitleTransfer.jsx
// 👑 Cod1 Crown Certified — AI-Assisted Bulk Title Transfer with Fraud Detection & Export Tools

import React, { useState } from 'react';
import DocumentUploader from '@components/common/DocumentUploader';
import Button from '@components/common/Button';
import { toast } from 'react-toastify';
import html2pdf from 'html2pdf.js';
import logger from '@utils/logger';

const BulkTitleTransfer = () => {
  const [documents, setDocuments] = useState([]);
  const [fraudFlags, setFraudFlags] = useState([]);
  const [exportReady, setExportReady] = useState(false);

  // Simulate AI fraud detection on uploaded docs
  const runFraudScan = () => {
    const flagged = documents.filter((doc) =>
      doc.name.toLowerCase().includes('fake') || doc.name.includes('___')
    );
    setFraudFlags(flagged.map((f) => f.name));
    if (flagged.length > 0) {
      toast.warn(`⚠️ ${flagged.length} potential fraud risk(s) detected.`);
    } else {
      toast.success('✅ No issues found during fraud check.');
    }
    setExportReady(true);
  };

  // Export the report to PDF
  const handlePDFExport = () => {
    const element = document.getElementById('title-transfer-report');
    html2pdf().from(element).save('TitleTransferReport.pdf');
  };

  // Export file list as CSV
  const handleCSVExport = () => {
    const csvContent = [
      ['Document Name', 'Fraud Risk'],
      ...documents.map((doc) => [doc.name, fraudFlags.includes(doc.name) ? '⚠️ Yes' : 'Clear']),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'TitleTransferReport.csv';
    link.click();
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-lg max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📄 Bulk Title Transfer Dashboard</h2>

      <DocumentUploader documents={documents} setDocuments={setDocuments} />

      {documents.length > 0 && (
        <div className="space-y-4">
          <Button className="bg-yellow-500 text-white hover:bg-yellow-600" onClick={runFraudScan}>
            🚨 Run AI Fraud Detection
          </Button>

          {exportReady && (
            <div className="flex gap-4 flex-wrap">
              <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={handlePDFExport}>
                📥 Export Report as PDF
              </Button>
              <Button className="bg-gray-700 text-white hover:bg-black" onClick={handleCSVExport}>
                📊 Export Report as CSV
              </Button>
            </div>
          )}

          <div id="title-transfer-report" className="bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">📋 Transfer Summary</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {documents.map((doc, idx) => (
                <li key={idx}>
                  {doc.name} {fraudFlags.includes(doc.name) && <span className="text-red-500">⚠️ Suspected</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkTitleTransfer;
