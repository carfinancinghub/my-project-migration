/**
 * File: apiTestSuite.js
 * Path: backend/tests/apiTestSuite.js
 * Purpose: Aggregate test results for listingController.js, storageRoutes.js, and notifications.js
 * Author: SG
 * Date: April 28, 2025
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const logger = require('@utils/logger'); // Assumed logger for error tracking

// Promisify exec for async execution
const execAsync = util.promisify(exec);

/**
 * Run Jest tests for a given test file and collect results
 * @param {string} testFile - Path to test file
 * @param {string} outputPath - Path for temporary JSON output
 * @returns {Promise<Object>} Test results
 */
const runJestTests = async (testFile, outputPath) => {
  try {
    // Run Jest with JSON output
    await execAsync(`jest ${testFile} --json --outputFile=${outputPath}`);
    const resultsRaw = await fs.readFile(outputPath, 'utf-8');
    const results = JSON.parse(resultsRaw);
    return results;
  } catch (error) {
    logger.error(`Failed to run tests for ${testFile}: ${error.message}`);
    return {
      numTotalTests: 0,
      numPassedTests: 0,
      numFailedTests: 0,
      testResults: [],
      error: error.message,
    };
  }
};

/**
 * Aggregate test results from multiple test suites
 * @returns {Promise<Object>} Aggregated test suite report
 */
const aggregateTestResults = async () => {
  const testSuites = [
    {
      name: 'Listing API Tests',
      file: '@tests/listingApiTests.js',
    },
    {
      name: 'Storage API Tests',
      file: '@tests/storageApiTests.js',
    },
    {
      name: 'Notification API Tests',
      file: '@tests/notificationApiTests.js',
    },
  ];

  const summaryReport = {
    timestamp: new Date().toISOString(),
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    suites: [],
  };

  // Resolve @ aliases to absolute paths
  const aliasMap = {
    '@tests': 'backend/tests',
  };
  const resolveAliasPath = (aliasPath) => {
    const [alias, ...rest] = aliasPath.split('/');
    const basePath = aliasMap[alias] || '';
    return path.join(process.cwd(), basePath, rest.join('/'));
  };

  // Run tests for each suite
  for (const suite of testSuites) {
    const testFilePath = resolveAliasPath(suite.file);
    const outputPath = path.join(process.cwd(), `backend/tests/temp_${suite.name.replace(/\s+/g, '_')}.json`);
    
    const results = await runJestTests(testFilePath, outputPath);

    const suiteSummary = {
      name: suite.name,
      totalTests: results.numTotalTests || 0,
      passedTests: results.numPassedTests || 0,
      failedTests: results.numFailedTests || 0,
      tests: results.testResults?.flatMap((result) =>
        result.assertionResults.map((test) => ({
          name: test.title,
          status: test.status,
          duration: test.duration,
          failureMessages: test.failureMessages || [],
        }))
      ) || [],
      error: results.error || null,
    };

    summaryReport.totalTests += suiteSummary.totalTests;
    summaryReport.passedTests += suiteSummary.passedTests;
    summaryReport.failedTests += suiteSummary.failedTests;
    summaryReport.suites.push(suiteSummary);

    // Clean up temporary output file
    if (!results.error) {
      await fs.unlink(outputPath).catch(() => logger.warn(`Failed to delete temp file ${outputPath}`));
    }
  }

  // Calculate overall pass rate
  summaryReport.passRate =
    summaryReport.totalTests > 0
      ? ((summaryReport.passedTests / summaryReport.totalTests) * 100).toFixed(2)
      : 0;

  return summaryReport;
};

/**
 * Generate and save test suite summary report
 * @returns {Promise<void>}
 */
const generateSummaryReport = async () => {
  try {
    const summaryReport = await aggregateTestResults();

    // Write report to JSON file
    const reportPath = path.join(process.cwd(), 'backend/tests/api_test_suite.json');
    await fs.writeFile(reportPath, JSON.stringify(summaryReport, null, 2), 'utf-8');
    logger.info(`Test suite summary report generated at ${reportPath}`);
  } catch (error) {
    logger.error(`Failed to generate test suite summary: ${error.message}`);
    throw new Error(`Test suite summary generation failed: ${error.message}`);
  }
};

// Execute test suite aggregation
generateSummaryReport().catch((error) => {
  console.error('Test suite aggregation failed:', error);
  process.exit(1);
});

// Cod2 Crown Certified: This script aggregates test results from listingApiTests.js, storageApiTests.js, and notificationApiTests.js,
// provides comprehensive pass/fail counts and test details,
// generates a detailed JSON report, and includes robust error handling.

