// File: apiHealthCheck.js
// Path: backend/tests/apiHealthCheck.js
// Purpose: Enhanced health check for API endpoints
// Author: Cod2
// Date: 2025-04-29
// 👑 Cod2 Crown Certified

// ----------------- Imports -----------------
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// ----------------- API Endpoints to Verify -----------------
const baseUrl = 'http://localhost:5000/api';
const endpoints = [
  '/auth/login',
  '/users',
  '/notifications/test-user-id',
  '/storage/test-host-id',
  '/judge/test-id'
];

// ----------------- Report Output Path -----------------
const reportPath = path.join(__dirname, 'api_health_report.json');

// ----------------- Main Execution -----------------
(async () => {
  const results = [];

  for (const endpoint of endpoints) {
    const fullUrl = `${baseUrl}${endpoint}`;
    try {
      const response = await axios.get(fullUrl);
      results.push({
        endpoint,
        status: response.status,
        message: 'OK'
      });
    } catch (error) {
      results.push({
        endpoint,
        status: error.response?.status || 'N/A',
        message: error.message || 'Failed'
      });
    }
  }

  fs.writeFileSync(reportPath, JSON.stringify({ checkedAt: new Date().toISOString(), endpoints: results }, null, 2));
  console.log('✅ API health report saved to:', reportPath);
})();


