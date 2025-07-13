/**
 * File: testRunner.js
 * Path: scripts/testRunner.js
 * Purpose: Node CLI test orchestrator for frontend and backend tests across the Rivers Auction platform
 * Author: Cod3 (05090104)
 * Date: May 09, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
const { execSync } = require('child_process');
const chalk = require('chalk');
const logger = require('../backend/utils/logger'); // Crown Certified logger

// --- Test Runner Functions ---

/**
 * runFrontendTests
 * Purpose: Executes Jest tests in frontend test directory
 */
const runFrontendTests = () => {
  console.log(chalk.blueBright('\n🔍 Running Frontend Tests (Jest)...'));
  try {
    const output = execSync('npx jest frontend/src/tests', { stdio: 'inherit' });
    console.log(chalk.green('✅ Frontend Tests Passed'));
  } catch (error) {
    logger.error(`[TestRunner] ❌ Frontend Tests Failed: ${error.message}`);
    console.log(chalk.red('❌ Frontend Tests Failed'));
  }
};

/**
 * runBackendTests
 * Purpose: Executes backend tests using Mocha or Jest in backend test directory
 */
const runBackendTests = () => {
  console.log(chalk.blueBright('\n🔧 Running Backend Tests (Mocha or Jest)...'));
  try {
    const output = execSync('npx mocha backend/tests --recursive', { stdio: 'inherit' });
    console.log(chalk.green('✅ Backend Tests Passed'));
  } catch (error) {
    logger.error(`[TestRunner] ❌ Backend Tests Failed: ${error.message}`);
    console.log(chalk.red('❌ Backend Tests Failed'));
  }
};

/**
 * summarizeResults
 * Purpose: Outputs final test status banner
 */
const summarizeResults = () => {
  console.log(chalk.yellow('\n🎯 Test Run Completed – Check logs for detailed failure outputs (if any).\n'));
};

// --- Execution ---
console.log(chalk.magentaBright('🧪 Starting Full Platform Test Run @ ' + new Date().toLocaleString()));
runFrontendTests();
runBackendTests();
summarizeResults();
