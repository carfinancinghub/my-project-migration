#!/bin/bash
# Date: 062625 [1000], © 2025 CFH
#
# Description:
# This script provides a reliable deployment and testing process.
# It ensures dependencies are installed, the application is built,
# the server is running, and then executes all tests.

# --- Step 1: Install Dependencies ---
echo "INFO: Installing all npm dependencies..."
npm install > /c/CFH/Cod1Logs/npm_install_$(date +%Y%m%d_%H%M%S).log 2>&1
if [ $? -ne 0 ]; then
  echo "ERROR: npm install failed. Aborting deployment."
  exit 1
fi

# --- Step 2: Build the Application ---
echo "INFO: Building the application..."
npm run build > /c/CFH/Cod1Logs/build_$(date +%Y%m%d_%H%M%S).log 2>&1
if [ $? -ne 0 ]; then
  echo "ERROR: Build failed. Aborting deployment."
  exit 1
fi

# --- Step 3: Start or Restart the Server with PM2 ---
echo "INFO: Starting/Restarting the application server with PM2..."
taskkill /IM node.exe /F > /dev/null 2>&1
pm2 restart dist/index.js --name cfh-backend > /c/CFH/Cod1Logs/pm2_start_$(date +%Y%m%d_%H%M%S).log 2>&1
sleep 5

# --- Step 4: Run Unit & Integration Tests ---
echo "INFO: Running Jest tests..."
npx jest --config jest.config.cjs --runInBand --passWithNoTests > /c/CFH/Cod1Logs/jest_$(date +%Y%m%d_%H%M%S).log 2>&1
if [ $? -ne 0 ]; then
  echo "ERROR: Jest tests failed. Aborting deployment."
  exit 1
fi

# --- Step 5: Run End-to-End Tests ---
echo "INFO: Running Cypress end-to-end tests..."
npx cypress run > /c/CFH/Cod1Logs/cypress_$(date +%Y%m%d_%H%M%S).log 2>&1
if [ $? -ne 0 ]; then
  echo "WARNING: Cypress tests failed. Continuing deployment but requires review."
fi

# --- Step 6: Save the PM2 Process List ---
echo "INFO: Saving PM2 process list..."
pm2 save > /c/CFH/Cod1Logs/pm2_save_$(date +%Y%m%d_%H%M%S).log 2>&1

echo "-------------------------------------"
echo "Deployment and testing completed."
pm2 status > /c/CFH/Cod1Logs/pm2_status_$(date +%Y%m%d_%H%M%S).log 2>&1
echo "-------------------------------------"

exit 0
