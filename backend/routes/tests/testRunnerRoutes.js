/**
 * File: testRunnerRoutes.js
 * Path: backend/routes/tests/testRunnerRoutes.js
 * Purpose: Provides API access to run and retrieve test suite results across frontend and backend
 * Author: Cod3 (05092209)
 * Date: May 09, 2025 (Updated)
 * Cod2 Crown Certified
 */

const express = require('express');
const router = express.Router();
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const logger = require('@utils/logger');

const resultsDir = path.join(__dirname, '../../../testResults');

// --- GET /api/tests/run ---
// Triggers test suites and saves results to the testResults archive
router.get('/run', async (req, res) => {
  const type = req.query.type || 'all';
  const results = [];

  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  try {
    if (type === 'all' || type === 'frontend') {
      try {
        execSync(`npx jest frontend/src/tests --json --outputFile=${resultsDir}/jest-results.json`, { stdio: 'ignore' });
        results.push({ name: 'Frontend Tests', type: 'frontend', status: 'passed' });
      } catch (err) {
        logger.error(`[TestRunnerRoutes] ❌ Frontend test error: ${err.message}`);
        results.push({ name: 'Frontend Tests', type: 'frontend', status: 'failed' });
      }
    }

    if (type === 'all' || type === 'backend') {
      try {
        execSync(`npx mocha backend/tests/**/*.test.js --reporter json > ${resultsDir}/mocha-results.json`, { shell: true });
        results.push({ name: 'Backend Tests', type: 'backend', status: 'passed' });
      } catch (err) {
        logger.error(`[TestRunnerRoutes] ❌ Backend test error: ${err.message}`);
        results.push({ name: 'Backend Tests', type: 'backend', status: 'failed' });
      }
    }

    return res.status(200).json({ success: true, results });
  } catch (err) {
    logger.error(`[TestRunnerRoutes] ❌ Unexpected test execution error: ${err.message}, Stack: ${err.stack}`);
    return res.status(500).json({ success: false, error: 'Unexpected test execution failure', details: err.message });
  }
});

// --- GET /api/tests/results/:type ---
// Returns summarized test results from stored JSON files
router.get('/results/:type', (req, res) => {
  const type = req.params.type;
  let filePath;

  if (type === 'frontend') {
    filePath = path.join(resultsDir, 'jest-results.json');
  } else if (type === 'backend') {
    filePath = path.join(resultsDir, 'mocha-results.json');
  } else {
    return res.status(400).json({ success: false, error: 'Invalid test type. Use "frontend" or "backend".' });
  }

  try {
    if (!fs.existsSync(filePath)) {
      logger.error(`[TestResults] ❌ File not found: ${filePath}`);
      return res.status(404).json({ success: false, error: 'Test results file not found.' });
    }

    let data;
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      data = JSON.parse(fileContent);
    } catch (err) {
      logger.error(`[TestResults] ❌ Error reading/parsing ${filePath}: ${err.message}`);
      return res.status(500).json({ success: false, error: 'Failed to parse test results file.', details: err.message });
    }

    let totalTests = 0;
    let passed = 0;
    let failed = 0;
    let skipped = 0;
    const specificFailures = [];

    if (type === 'frontend') {
      totalTests = data.numTotalTests;
      passed = data.numPassedTests;
      failed = data.numFailedTests;
      skipped = data.numPendingTests;

      if (data.testResults) {
        data.testResults.forEach((testFile) => {
          testFile.assertionResults.forEach((assertion) => {
            if (assertion.status === 'failed') {
              specificFailures.push({
                title: assertion.title,
                file: testFile.name,
                failureMessages: assertion.failureMessages
              });
            }
          });
        });
      }
    } else if (type === 'backend') {
      totalTests = data.stats.tests;
      passed = data.stats.passes;
      failed = data.stats.failures;
      skipped = data.stats.pending;

      if (data.failures) {
        data.failures.forEach((failure) => {
          specificFailures.push({
            title: failure.fullTitle,
            file: failure.file,
            error: failure.err.message
          });
        });
      }
    }

    return res.status(200).json({
      success: true,
      summary: {
        type,
        totalTests,
        passed,
        failed,
        skipped,
        specificFailures
      }
    });
  } catch (err) {
    logger.error(`[TestRunnerRoutes] ❌ Failed to load test results for ${type}: ${err.message}`);
    return res.status(500).json({ success: false, error: `Failed to read ${type} results`, details: err.message });
  }
});

module.exports = router;

/**
 * Functions Summary:
 * 
 * - **router.get('/run')**
 *   - **Purpose**: Executes test suites and returns mock test results.
 *   - **Inputs**: req.query.type (String, optional: 'frontend', 'backend', 'all')
 *   - **Outputs**: JSON response with test results or error details
 *   - **Dependencies**: express, child_process.execSync, @utils/logger, fs, path
 * - **router.get('/results/:type')**
 *   - **Purpose**: Retrieves and summarizes test results from stored JSON files.
 *   - **Inputs**: req.params.type (String: 'frontend' or 'backend')
 *   - **Outputs**: JSON response with summarized test results or error details
 *   - **Dependencies**: express, fs, path, @utils/logger
 */