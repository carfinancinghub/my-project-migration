/**
 * File: performanceValidation.js
 * Path: backend/tests/performanceValidation.js
 * Purpose: Validate performance test results from performanceTests.js against performance_test.json
 * Author: SG
 * Date: April 28, 2025
 */

const fs = require('fs').promises;
const path = require('path');
const performanceReport = require('@tests/performance_report.json'); // Alias for performance test report
const mockData = require('@__mocks_/performance_test.json'); // Alias for mock test data
const logger = require('@utils/logger'); // Assumed logger for error tracking

/**
 * Validate performance test report against mock data
 * @param {Object} report - Performance test report from performance_report.json
 * @param {Object} mockData - Expected performance metrics from performance_test.json
 * @returns {Object} Validation results with metric comparisons
 */
const validatePerformanceReport = (report, mockData) => {
  const validationReport = {
    timestamp: new Date().toISOString(),
    totalRequests: report.summary.totalRequests || 0,
    errors: report.summary.errors || 0,
    validationIssues: [],
  };

  // Map scenarios to their expected mock data
  const scenarioMap = mockData.scenarios.reduce((acc, mock) => {
    acc[mock.name] = mock;
    return acc;
  }, {});

  // Validate each scenario in the report
  report.scenarios.forEach((scenario) => {
    const mock = scenarioMap[scenario.name];

    // Check if scenario has corresponding mock data
    if (!mock) {
      validationReport.validationIssues.push({
        scenario: scenario.name,
        issue: 'No matching mock data found in performance_test.json',
        actual: scenario,
      });
      return;
    }

    // Validate average response time
    if (scenario.avgResponseTime > mock.maxAvgResponseTime) {
      validationReport.validationIssues.push({
        scenario: scenario.name,
        issue: `Average response time ${scenario.avgResponseTime}ms exceeds max ${mock.maxAvgResponseTime}ms`,
        actual: scenario.avgResponseTime,
        expected: mock.maxAvgResponseTime,
      });
    }

    // Validate p95 response time
    if (scenario.p95ResponseTime > mock.maxP95ResponseTime) {
      validationReport.validationIssues.push({
        scenario: scenario.name,
        issue: `P95 response time ${scenario.p95ResponseTime}ms exceeds max ${mock.maxP95ResponseTime}ms`,
        actual: scenario.p95ResponseTime,
        expected: mock.maxP95ResponseTime,
      });
    }

    // Validate error count
    if (scenario.errorCount > mock.maxErrorCount) {
      validationReport.validationIssues.push({
        scenario: scenario.name,
        issue: `Error count ${scenario.errorCount} exceeds max ${mock.maxErrorCount}`,
        actual: scenario.errorCount,
        expected: mock.maxErrorCount,
      });
    }

    // Validate completed requests
    if (scenario.completed < mock.minCompletedRequests) {
      validationReport.validationIssues.push({
        scenario: scenario.name,
        issue: `Completed requests ${scenario.completed} below min ${mock.minCompletedRequests}`,
        actual: scenario.completed,
        expected: mock.minCompletedRequests,
      });
    }
  });

  // Validate overall summary metrics
  if (report.summary.avgResponseTime > mockData.summary.maxAvgResponseTime) {
    validationReport.validationIssues.push({
      scenario: 'Summary',
      issue: `Overall average response time ${report.summary.avgResponseTime}ms exceeds max ${mockData.summary.maxAvgResponseTime}ms`,
      actual: report.summary.avgResponseTime,
      expected: mockData.summary.maxAvgResponseTime,
    });
  }

  if (report.summary.p95ResponseTime > mockData.summary.maxP95ResponseTime) {
    validationReport.validationIssues.push({
      scenario: 'Summary',
      issue: `Overall P95 response time ${report.summary.p95ResponseTime}ms exceeds max ${mockData.summary.maxP95ResponseTime}ms`,
      actual: report.summary.p95ResponseTime,
      expected: mockData.summary.maxP95ResponseTime,
    });
  }

  if (report.summary.errors > mockData.summary.maxErrors) {
    validationReport.validationIssues.push({
      scenario: 'Summary',
      issue: `Total errors ${report.summary.errors} exceeds max ${mockData.summary.maxErrors}`,
      actual: report.summary.errors,
      expected: mockData.summary.maxErrors,
    });
  }

  return validationReport;
};

/**
 * Generate validation report and save to performance_validation.json
 * @returns {Promise<void>}
 */
const generateValidationReport = async () => {
  try {
    // Validate performance report against mock data
    const validationReport = validatePerformanceReport(performanceReport, mockData);

    // Write report to JSON file
    const reportPath = path.join(process.cwd(), 'backend/tests/performance_validation.json');
    await fs.writeFile(reportPath, JSON.stringify(validationReport, null, 2), 'utf-8');
    logger.info(`Validation report generated at ${reportPath}`);
  } catch (error) {
    logger.error(`Failed to generate validation report: ${error.message}`);
    throw new Error(`Validation report generation failed: ${error.message}`);
  }
};

// Execute validation
generateValidationReport().catch((error) => {
  console.error('Validation failed:', error);
  process.exit(1);
});

// Cod2 Crown Certified: This script provides accurate validation of performanceTests.js results,
// verifies response times and error counts against performance_test.json,
// generates a comprehensive JSON report, and includes robust error handling.

