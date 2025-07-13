// File: apiHealthCheckFast.js
// Path: backend/tests/apiHealthCheckFast.js
// Purpose: Fast health check to log only API endpoint failures
// Author: Cod2
// Date: 2025-04-29
// 👑 Cod2 Crown Certified

// ----------------- Imports -----------------
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// ----------------- Config -----------------
const BASE_URL = 'http://localhost:5000/api';
const endpoints = [
  '/auth/login',
  '/auth/register',
  '/storage/123456',
  '/notifications/123456',
  '/judge/available',
  '/users',
  '/auctions',
];

const reportPath = path.join(__dirname, 'api_health_fast_report.json');

// ----------------- Helper Function -----------------
async function checkEndpoint(endpoint) {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`);
    if (response.status !== 200) {
      return { endpoint, status: response.status, message: 'Non-200 response' };
    }
    return null; // No failure
  } catch (err) {
    return {
      endpoint,
      status: err.response?.status || 'N/A',
      message: err.message || 'Unknown error',
    };
  }
}

// ----------------- Main Execution -----------------
(async () => {
  const failures = [];

  for (const endpoint of endpoints) {
    console.log(`⏳ Checking ${endpoint}`);
    const result = await checkEndpoint(endpoint);
    if (result) failures.push(result);
  }

  fs.writeFileSync(reportPath, JSON.stringify({ failures }, null, 2));
  console.log(`✅ Fast API failure report written to ${reportPath}`);
})();


