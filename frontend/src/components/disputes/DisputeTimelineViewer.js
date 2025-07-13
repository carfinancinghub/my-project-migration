// File: DisputeTimelineViewer.js
// Path: frontend/src/components/disputes/DisputeTimelineViewer.js

import React from 'react';

const DisputeTimelineViewer = ({ timeline = [] }) => {
  if (timeline.length === 0) {
    return <p className="text-gray-400 text-sm">No timeline data available.</p>;
  }

  return (
    <div className="border-t pt-4 mt-4">
      <h3 className="text-lg font-semibold mb-2">📜 Timeline</h3>
      <ul className="space-y-2 text-sm">
        {timeline.map((entry, index) => (
          <li key={index} className="border-l-2 border-blue-500 pl-4">
            <span className="text-gray-600">
              [{new Date(entry.timestamp).toLocaleString()}] <strong>{entry.event}</strong>{' '}
              {entry.value && <span className="text-gray-800">→ {entry.value}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisputeTimelineViewer;
