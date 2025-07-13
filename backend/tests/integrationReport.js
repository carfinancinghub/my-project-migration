// File: integrationReport.js
// Path: backend/tests/integrationReport.js
// Purpose: Summarize integration test results
// Author: Cod2
// Date: 2025-04-28
// 👑 Cod2 Crown Certified

// ----------------- Imports -----------------
const fs = require('fs');
const path = require('path');

// ----------------- Files to Include -----------------
const testFiles = [
  path.join(__dirname, 'dashboardTests.js'),
  path.join(__dirname, 'storageApiTests.js'),
  path.join(__dirname, 'judgeApiTests.js'),
  path.join(__dirname, 'healthCheck.js')
];

const reportPath = path.join(__dirname, 'integration_report.json');

// ----------------- Aggregation Logic -----------------
const extractTestSummary = (fileContent) => {
  const passed = (fileContent.match(/expect\(.*\)\.toEqual\(/g) || []).length;
  const failed = (fileContent.match(/expect\(.*\)\.not\.toEqual\(/g) || []).length;
  const errors = (fileContent.match(/throw new Error|console\.error/g) || []).length;

  return { passed, failed, errors };
};

const generateReport = () => {
  const results = {};
  let totalPassed = 0;
  let totalFailed = 0;
  let totalErrors = 0;

  testFiles.forEach((filePath) => {
    try {
      const fileName = path.basename(filePath);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { passed, failed, errors } = extractTestSummary(fileContent);

      results[fileName] = { passed, failed, errors };
      totalPassed += passed;
      totalFailed += failed;
      totalErrors += errors;
    } catch (err) {
      results[path.basename(filePath)] = { error: err.message };
    }
  });

  const finalReport = {
    summary: {
      totalPassed,
      totalFailed,
      totalErrors,
    },
    details: results,
    generatedAt: new Date().toISOString()
  };

  fs.writeFileSync(reportPath, JSON.stringify(finalReport, null, 2));
  console.log(`✅ Integration report saved to ${reportPath}`);
};

// ----------------- Run -----------------
generateReport();


