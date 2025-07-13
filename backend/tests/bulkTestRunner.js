// File: bulkTestRunner.js
// Path: backend/tests/bulkTestRunner.js
// Purpose: Run all test suites and generate a summary report
// Author: Cod2
// Date: 2025-04-29
// 👑 Cod2 Crown Certified

// ----------------- Imports -----------------
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// ----------------- Test Files -----------------
const testSuites = [
  '@tests/dashboardTests.js',
  '@tests/storageApiTests.js',
  '@tests/arTests.js'
];

// ----------------- Paths -----------------
const reportPath = path.join(__dirname, 'bulk_test_report.json');

// ----------------- Helper Function -----------------
function runTest(file) {
  return new Promise((resolve) => {
    exec(`npx jest ${file} --json`, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error running ${file}:`, stderr);
        return resolve({
          testSuite: file,
          passCount: 0,
          failCount: 1,
          errors: [stderr.trim() || err.message]
        });
      }

      try {
        const jsonOutput = JSON.parse(stdout);
        resolve({
          testSuite: file,
          passCount: jsonOutput.numPassedTests,
          failCount: jsonOutput.numFailedTests,
          errors: jsonOutput.testResults
            .filter(t => t.status === 'failed')
            .map(t => t.failureMessage || 'Unknown error')
        });
      } catch (parseError) {
        resolve({
          testSuite: file,
          passCount: 0,
          failCount: 1,
          errors: [`Failed to parse JSON output: ${parseError.message}`]
        });
      }
    });
  });
}

// ----------------- Main Execution -----------------
(async () => {
  const results = [];

  for (const suite of testSuites) {
    console.log(`⏳ Running: ${suite}`);
    const result = await runTest(suite);
    results.push(result);
  }

  fs.writeFileSync(reportPath, JSON.stringify({ testSuites: results }, null, 2));
  console.log('\u2705 Bulk test report written to:', reportPath);
})();


