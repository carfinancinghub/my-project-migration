// File: healthCheckFast.js
// Path: backend/tests/healthCheckFast.js
// Purpose: Ping all API routes and report only failures
// Author: Cod2
// Date: 2025-04-28
// 👑 Cod2 Crown Certified

// Import dependencies
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Base API URL
const BASE_URL = 'http://localhost:5000/api';

// Define API endpoints to ping
const routes = [
  '/auth/login',
  '/auth/register',
  '/users',
  '/users/arbitrators',
  '/lender/export',
  '/loan-match',
  '/contracts',
  '/fraud/alerts',
  '/auctions',
  '/disputes',
  '/onboarding',
  '/messages',
  '/notifications',
  '/ai/listing-suggestions',
  '/ai/insight',
  '/ai/recommendation',
  '/ar',
  '/storage/test', // Sample storage endpoint
  '/judge/test'     // Sample judge endpoint
];

// Ping each route and collect only failures
const healthCheckFast = async () => {
  const failures = [];

  for (const route of routes) {
    try {
      const response = await axios.get(`${BASE_URL}${route}`);
      if (response.status !== 200) {
        failures.push({ route, status: response.status });
      }
    } catch (err) {
      failures.push({
        route,
        status: err.response ? err.response.status : 'No Response',
        message: err.message
      });
    }
  }

  // Save failures to a JSON file
  const reportPath = path.join(__dirname, 'health_report_fast.json');
  fs.writeFileSync(reportPath, JSON.stringify(failures, null, 2));

  // Log results to console
  if (failures.length === 0) {
    console.log('✅ All routes responded successfully. No failures detected.');
  } else {
    console.error('❌ Failures detected:');
    failures.forEach(failure => {
      console.error(`Route: ${failure.route}, Status: ${failure.status}, Message: ${failure.message || 'N/A'}`);
    });
  }
};

// Execute the health check
healthCheckFast();


