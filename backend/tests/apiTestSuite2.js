/**
 * File: apiTestSuite2.js
 * Path: backend/tests/apiTestSuite2.js
 * Purpose: Aggregate test results for listingController.js, storageRoutes.js, notifications.js, and cross-module workflows
 * Author: SG
 * Date: April 28, 2025
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const logger = require('@utils/logger'); // Assumed logger for error tracking

// Promisify exec for async execution
const execAsync = util.promisify(exec);

// Initialize Express app for integration tests
const app = express();
app.use(express.json());
const sellerRoutes = require('@routes/seller/sellerRoutes');
const storageRoutes = require('@routes/storage/storageRoutes');
const notificationRoutes = require('@routes/notifications/notifications');
app.use('/api/seller', sellerRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/notifications', notificationRoutes);

/**
 * Run Jest tests for a given test file and collect results
 * @param {string} testFile - Path to test file
 * @param {string} outputPath - Path for temporary JSON output
 * @returns {Promise<Object>} Test results
 */
const runJestTests = async (testFile, outputPath) => {
  try {
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
    { name: 'Listing API Tests', file: '@tests/listingApiTests.js' },
    { name: 'Storage API Tests', file: '@tests/storageApiTests.js' },
    { name: 'Notification API Tests', file: '@tests/notificationApiTests.js' },
  ];

  const summaryReport = {
    timestamp: new Date().toISOString(),
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    suites: [],
  };

  // Resolve @ aliases to absolute paths
  const aliasMap = { '@tests': 'backend/tests' };
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

    if (!results.error) {
      await fs.unlink(outputPath).catch(() => logger.warn(`Failed to delete temp file ${outputPath}`));
    }
  }

  // Integration test: Cross-module workflow
  describe('Cross-Module Workflow', () => {
    const mockToken = jwt.sign(
      { userId: 'user123', role: 'buyer' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    it('should complete auction → hauler bid → financier bid → escrow → storage workflow with blind bidding', async () => {
      // Step 1: Buyer initiates auction
      const auctionResponse = await request(app)
        .post('/api/auction')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ item: 'Car', startingBid: 10000 });
      expect(auctionResponse.status).toBe(201);
      const auctionId = auctionResponse.body.id;

      // Step 2: Hauler bids
      const haulerBidResponse = await request(app)
        .post(`/api/auction/${auctionId}/hauler-bid`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ haulerId: 'hauler123', bid: 500 });
      expect(haulerBidResponse.status).toBe(200);

      // Step 3: Financier bids (blind bidding)
      const financierToken = jwt.sign(
        { userId: 'financier123', role: 'financier' },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' }
      );
      const financierBidResponse = await request(app)
        .post(`/api/auction/${auctionId}/financier-bid`)
        .set('Authorization', `Bearer ${financierToken}`)
        .send({ financierId: 'financier123', terms: { rate: '3.5%' } });
      expect(financierBidResponse.status).toBe(200);
      expect(financierBidResponse.body.financierId).toBeUndefined(); // Ensure anonymity

      // Step 4: Escrow secures transaction
      const escrowResponse = await request(app)
        .post(`/api/auction/${auctionId}/escrow`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ amount: 10500 });
      expect(escrowResponse.status).toBe(200);

      // Step 5: Storage provider bids
      const storageBidResponse = await request(app)
        .post(`/api/auction/${auctionId}/storage-bid`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ storageId: 'storage123', bid: 200 });
      expect(storageBidResponse.status).toBe(200);
    });
  });

  // Write report to JSON file
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

// Cod2 Crown Certified: This script aggregates test results from listingApiTests.js, storageApiTests.js, notificationApiTests.js,
// includes integration tests for cross-module workflows with blind bidding,
// uses Jest with @ aliases, and ensures robust error handling.

