/**
 * © 2025 CFH, All Rights Reserved
 * File: PathFixValidator.ts
 * Path: backend/tests/PathFixValidator.ts
 * Purpose: Validate alias path cleanup by reporting any remaining relative imports
 * Author: Cod1 Team
 * Date: 2025-07-18 [0815]
 * Version: 1.0.1
 * Version ID: 1q2w3e4r5t6y7u8i9o0p1a2s3d4f5g6h
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: 1q2w3e4r5t6y7u8i9o0p1a2s3d4f5g6h
 * Save Location: backend/tests/PathFixValidator.ts
 */

/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Converted to TypeScript with typed fileList and results
 * - Added async file reading for large projects
 * - Integrated with CI/CD for automated checks - suggest in pipeline
 * - Suggest unit tests in __tests__/tests/PathFixValidator.test.ts
 * - Suggest: Add CLI option to scan only changed files (performance)
 * - Improved: Used promises for fs, typed regex matches
 * - Further: Suggest ignoring certain files via .gitignore-like pattern
 */

import fs from 'fs/promises';
import path from 'path';
import logger from '@utils/logger'; // Assumed

const reportPath = path.resolve(__dirname, 'path_fix_report.json');
const outputPath = path.resolve(__dirname, 'path_fix_validation.json');

interface FileEntry {
  path: string;
}

interface Result {
  file: string;
  unresolvedImports: string[];
}

(async () => {
  let fileList: FileEntry[] = [];
  try {
    const data = await fs.readFile(reportPath, 'utf8');
    fileList = JSON.parse(data);
  } catch (err) {
    logger.error('❌ Error reading path_fix_report.json:', err);
    process.exit(1);
  }

  // Looks for any relative import (../ or ./)
  const suspiciousPattern = /import\s+.*['"](.*\.\.\/.*|\.\/.*)['"]/g;
  const results: Result[] = [];

  for (const file of fileList) {
    const filePath = path.resolve('C:/CFH', file.path);
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const matches = Array.from(content.matchAll(suspiciousPattern)).map(m => m[0]);
      if (matches.length > 0) {
        results.push({ file: file.path, unresolvedImports: matches });
      }
    } catch (err) {
      logger.error(`❌ Could not read file ${file.path}:`, err.message);
    }
  }

  await fs.writeFile(outputPath, JSON.stringify(results, null, 2), 'utf8');
  logger.info('🔍 Validation complete. Results saved to path_fix_validation.json');
})();
