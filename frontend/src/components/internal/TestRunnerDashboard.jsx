/**
 * File: TestRunnerDashboard.jsx
 * Path: frontend/src/components/internal/TestRunnerDashboard.jsx
 * Purpose: Internal QA dashboard to view and execute frontend/backend tests with filters and polling
 * Author: Cod3 (05082247)
 * Date: May 08, 2025
 * Updated: Added SEOHead, used AdminLayout, applied theme.js utilities, enhanced comments and accessibility, refactored TestCard for consistency
 * Cod2 Crown Certified: Yes
 * Features:
 * - Displays test results with status (passed, failed, skipped) and summary counts
 * - Filters tests by type (all, frontend, backend)
 * - Auto-polling every 30 seconds to refresh test results
 * - Manual test execution with a "Run Tests" button
 * - Responsive layout with TailwindCSS and premium feature gating
 * Functions:
 * - fetchTestResults(): Fetches test results from /api/tests/run (mocked)
 * - runTests(): Triggers a manual test run
 * Dependencies: axios, logger, PremiumFeature, AdminLayout, SEOHead, theme
 */

// Imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logger from '@utils/logger';
import PremiumFeature from '@components/common/PremiumFeature';
import AdminLayout from '@components/admin/layout/AdminLayout';
import SEOHead from '@components/common/SEOHead';
import { theme } from '@styles/theme';

// TestCard Component for Displaying Individual Test Results
const TestCard = ({ name, status }) => {
  const colorMap = {
    passed: 'green-500',
    failed: 'red-500',
    skipped: 'yellow-500',
  };

  return (
    <div className={`border-l-4 border-${colorMap[status]} bg-white ${theme.cardShadow} ${theme.spacingSm}`} role="listitem">
      <div className="font-bold text-gray-800">{name}</div>
      <div className={`${theme.fontSizeSm} text-gray-600 capitalize`}>{status}</div>
    </div>
  );
};

// Main Component
const TestRunnerDashboard = () => {
  // State Management
  const [tests, setTests] = useState([]);
  const [filter, setFilter] = useState('all');

  // Fetch Test Results from API (Mocked)
  const fetchTestResults = async () => {
    try {
      const mockResponse = {
        data: [
          { name: 'Equity Intelligence Hub Test', type: 'frontend', status: 'passed' },
          { name: 'Escrow Controller Test', type: 'backend', status: 'failed' },
          { name: 'Partner API Test', type: 'backend', status: 'skipped' },
        ],
      };
      setTests(mockResponse.data);
    } catch (err) {
      logger.error(`[TestRunnerDashboard] Failed to fetch test results: ${err.message}`);
    }
  };

  // Trigger Manual Test Run
  const runTests = () => {
    fetchTestResults();
  };

  // Auto-Polling Every 30 Seconds When Document is Visible
  useEffect(() => {
    fetchTestResults();
    const interval = setInterval(() => {
      if (!document.hidden) fetchTestResults();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter Tests Based on Selected Filter
  const filteredTests = tests.filter((test) =>
    filter === 'all' ? true : test.type === filter
  );

  // Summary Counts
  const total = filteredTests.length;
  const passed = filteredTests.filter(t => t.status === 'passed').length;
  const failed = filteredTests.filter(t => t.status === 'failed').length;
  const skipped = filteredTests.filter(t => t.status === 'skipped').length;

  // UI Rendering
  return (
    <AdminLayout>
      <SEOHead title="Test Runner Dashboard - CFH Auction Platform" />
      <PremiumFeature feature="testDashboard">
        <div className={`max-w-3xl mx-auto bg-gray-50 ${theme.borderRadius} ${theme.spacingLg} ${theme.cardShadow}`} role="region" aria-label="Test Runner Dashboard">
          <h2 className="text-2xl font-semibold mb-4">Test Runner Dashboard</h2>

          {/* Summary Panel */}
          <div className="flex justify-between mb-4">
            <span>✅ Passed: {passed}</span>
            <span>❌ Failed: {failed}</span>
            <span>⚠️ Skipped: {skipped}</span>
          </div>

          {/* Filter Buttons */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setFilter('all')}
              className={`${theme.primaryButton} px-4 py-2`}
              aria-label="Show all tests"
            >
              All
            </button>
            <button
              onClick={() => setFilter('frontend')}
              className={`${theme.primaryButton} px-4 py-2`}
              aria-label="Show frontend tests"
            >
              Frontend
            </button>
            <button
              onClick={() => setFilter('backend')}
              className={`${theme.primaryButton} px-4 py-2`}
              aria-label="Show backend tests"
            >
              Backend
            </button>
          </div>

          {/* Run Tests Button */}
          <div className="mb-4">
            <button
              onClick={runTests}
              className={`${theme.primaryButton} hover:bg-blue-700 transition`}
              aria-label="Run tests"
            >
              Run Tests
            </button>
          </div>

          {/* Render Test Cards */}
          <div role="list">
            {filteredTests.map((test, idx) => (
              <TestCard key={idx} name={test.name} status={test.status} />
            ))}
          </div>
        </div>
      </PremiumFeature>
    </AdminLayout>
  );
};

export default TestRunnerDashboard;