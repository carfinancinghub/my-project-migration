// File: testRunner.js
// Path: backend/tests/testRunner.js
// Purpose: Automate execution of integration test suites
// Author: Cod2
// Date: 2025-04-28
// 👑 Cod2 Crown Certified

// ----------------- Imports -----------------
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// ----------------- Test Files to Run -----------------
const testFiles = [
  'backend/tests/dashboardTests.js',
  'backend/tests/storageApiTests.js',
  'backend/tests/judgeApiTests.js'
];

const reportFile = path.join(__dirname, 'test_runner_report.json');
const results = [];

// ----------------- Execution Logic -----------------
const runTest = (file, callback) => {
  console.log(`\n🚀 Running: ${file}`);
  exec(`npx jest ${file}`, (error, stdout, stderr) => {
    const output = {
      file,
      success: !error,
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      error: error ? error.message : null
    };
    results.push(output);
    callback();
  });
};

// ----------------- Recursive Runner -----------------
const runAllTests = (index = 0) => {
  if (index >= testFiles.length) {
    // All tests completed, save report
    fs.writeFileSync(reportFile, JSON.stringify(results, null, 2));
    console.log(`\n✅ All tests completed. Report saved to: ${reportFile}`);
    return;
  }

  runTest(testFiles[index], () => runAllTests(index + 1));
};

// ----------------- Start Runner -----------------
console.log('\n🧪 Starting test runner for all integration suites...');
runAllTests();


