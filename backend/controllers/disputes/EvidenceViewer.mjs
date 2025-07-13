// File: EvidenceViewer.js
// Path: frontend/src/components/disputes/EvidenceViewer.js

import React from 'react';

const EvidenceViewer = ({ evidence = [] }) => {
  if (!evidence.length) return null;

  return (
    <div className="mt-4">
      <h4 className="text-sm font-bold mb-2">📎 Uploaded Evidence</h4>
      <ul className="space-y-1 text-sm">
        {evidence.map((file, index) => (
          <li key={index} className="flex items-center gap-2">
            <a
              href={`/${file.path.replace('uploads/', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {file.filename}
            </a>
            <span className="text-gray-400">({file.mimetype})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EvidenceViewer;
