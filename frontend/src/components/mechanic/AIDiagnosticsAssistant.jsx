// File: AIDiagnosticsAssistant.jsx
// Path: frontend/src/components/mechanic/AIDiagnosticsAssistant.jsx
// Author: Cod1 (05051115)
// Purpose: AI assistant that analyzes uploaded photos to detect likely issues
// Functions:
// - Analyze photo metadata (mocked) to return diagnostics
// - Gate entire section behind mechanicEnterprise
// - Display results in card layout (issue type, severity, recommendation)

import React, { useState } from 'react';
import PremiumFeature from '@components/common/PremiumFeature';
import Card from '@components/common/Card';
import ImageUploader from '@components/common/ImageUploader';

const MOCK_ANALYSIS = [
  { type: 'Tire Wear', severity: 'High', recommendation: 'Replace all tires' },
  { type: 'Oil Leak', severity: 'Medium', recommendation: 'Inspect and reseal oil pan' }
];

const AIDiagnosticsAssistant = () => {
  const [uploaded, setUploaded] = useState(null);
  const [results, setResults] = useState([]);

  const handleUpload = (photo) => {
    setUploaded(photo);
    setTimeout(() => {
      setResults(MOCK_ANALYSIS);
    }, 1500);
  };

  return (
    <PremiumFeature feature="mechanicEnterprise">
      <Card>
        <h2 className="text-lg font-bold mb-3">🧠 AI Diagnostics Assistant</h2>
        <ImageUploader onUpload={handleUpload} />
        {results.length > 0 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((r, idx) => (
              <div key={idx} className="bg-gray-100 p-4 rounded shadow">
                <h3 className="font-semibold">{r.type}</h3>
                <p className="text-sm">Severity: <strong>{r.severity}</strong></p>
                <p className="text-sm">Recommendation: {r.recommendation}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </PremiumFeature>
  );
};

export default AIDiagnosticsAssistant;
