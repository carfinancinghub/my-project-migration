// File: healthCheck.js
// Path: backend/tests/healthCheck.js
// Purpose: Dynamically ping all registered API routes and generate a health report JSON
// Author: Cod2
// Date: 2025-04-29
// 👑 Cod2 Crown Certified

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Base URL for pings (you can set this dynamically if needed)
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

// Define all endpoints to test
const endpoints = [
  '/api/auth',
  '/api/users',
  '/api/users/arbitrators',
  '/api/lender/export',
  '/api/loan-match',
  '/api/contracts',
  '/api/fraud/alerts',
  '/api/auctions',
  '/api/disputes',
  '/api/onboarding',
  '/api/messages',
  '/api/notifications',
  '/api/ai/listing-suggestions',
  '/api/ai/insight',
  '/api/ai/recommendation',
  '/api/ar',
  '/api/storage',   // Newly added Storage API
  '/api/judge'      // Newly added Judge API
];

// Health check logic
const runHealthCheck = async () => {
  const report = [];

  console.log('🏥 Starting API health check...\n');

  for (const endpoint of endpoints) {
    const fullUrl = `${BASE_URL}${endpoint}`;
    try {
      const response = await axios.get(fullUrl);
      console.log(`✅ [${response.status}] ${endpoint}`);
      report.push({
        endpoint,
        status: response.status,
        message: 'OK',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      const status = error.response ? error.response.status : 'No Response';
      console.log(`❌ [${status}] ${endpoint}`);
      report.push({
        endpoint,
        status,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Save report as JSON
  const outputPath = path.join(__dirname, 'health_report.json');
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

  console.log(`\n📄 Health report saved to: ${outputPath}`);
};

// Run health check immediately
runHealthCheck();


