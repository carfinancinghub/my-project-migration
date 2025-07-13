// File: AuditTrail.js
// Path: frontend/src/components/chat/AuditTrail.js

import React from 'react';

const AuditTrail = () => {
  return (
    <div className="p-3 border-b bg-white text-sm">
      <div className="font-semibold text-gray-800 mb-2">🔍 Escrow Audit Trail</div>
      <ul className="space-y-1 text-gray-700">
        <li>📌 Escrow opened — <span className="text-gray-500">Apr 12, 2025 9:14 AM</span></li>
        <li>🔎 Inspection completed — <span className="text-gray-500">Apr 13, 2025 2:47 PM</span></li>
        <li>🚚 Delivery confirmed — <span className="text-gray-500">Apr 14, 2025 5:22 PM</span></li>
        <li>✅ Buyer approved — <span className="text-gray-500">Apr 15, 2025 11:03 AM</span></li>
        <li>💸 Funds released — <span className="text-gray-500">Apr 15, 2025 1:10 PM</span></li>
      </ul>
    </div>
  );
};

export default AuditTrail;
