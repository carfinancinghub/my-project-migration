// File: pathFixValidator.js
// Path: backend/tests/pathFixValidator.js
// Purpose: Validate alias path cleanup by reporting any remaining relative imports
// Author: Cod1 — Crown Certified
// Date: 2025-04-29

const fs = require('fs');
const path = require('path');

const reportPath = path.resolve(__dirname, 'path_fix_report.json');
const outputPath = path.resolve(__dirname, 'path_fix_validation.json');
let fileList = [];

try {
  fileList = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
} catch (err) {
  console.error('❌ Error reading path_fix_report.json:', err);
  process.exit(1);
}

const suspiciousPattern = /import\s+.*?['"](\.\.\/)+.*?['"]/g;
const results = [];

fileList.forEach(file => {
  const filePath = path.resolve('C:/CFH', file.path);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = content.match(suspiciousPattern);

    if (matches && matches.length > 0) {
      results.push({
        file: file.path,
        unresolvedImports: matches
      });
    }
  } catch (err) {
    console.error(`❌ Could not read file ${file.path}:`, err.message);
  }
});

fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');
console.log(`🔍 Validation complete. Results saved to path_fix_validation.json`);


