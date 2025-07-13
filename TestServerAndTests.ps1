# TestServerAndTests.ps1
# Purpose: Test server with index.js, run tests from C:\CFH\backend
# Date: 2025-06-21 00:03 PDT

# Set variables
$serverPath = "C:\CFH\backend\index.js"
$testPath = "C:\CFH\backend\tests\routes\user\userProfileRoutes.test.js"
$projectRoot = "C:\CFH\backend"
$logFile = "C:\CFH\logs\testServerAndTests_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
$excludedDirs = "node_modules","dist","build",".git"
$timestamp = (Get-Date).ToUniversalTime().ToString("o")

# Initialize log and console
"[$timestamp] Starting server and test verification for CFH Automotive Ecosystem" | Tee-Object -FilePath $logFile -Append
"[$timestamp] Excluding directories: $excludedDirs" | Tee-Object -FilePath $logFile -Append
Write-Host "Testing server and tests..."

# Step 1: Verify server file
"[$timestamp] Verifying server file: $serverPath" | Tee-Object -FilePath $logFile -Append
Write-Host "Verifying server file..."
if (Test-Path $serverPath) {
    $msg = "[$timestamp] Success: Server file found at $serverPath"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
} else {
    $msg = "[$timestamp] Error: Server file not found at $serverPath"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    exit 1
}

# Step 2: Verify package.json
"[$timestamp] Verifying package.json in ${projectRoot}" | Tee-Object -FilePath $logFile -Append
Write-Host "Verifying package.json..."
$packageJson = Join-Path $projectRoot "package.json"
if (Test-Path $packageJson) {
    $msg = "[$timestamp] Success: Found package.json at $packageJson"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
} else {
    $msg = "[$timestamp] Error: package.json not found at $packageJson"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    exit 1
}

# Step 3: Test server
"[$timestamp] Running server: node $serverPath" | Tee-Object -FilePath $logFile -Append
Write-Host "Running server..."
try {
    $serverProcess = Start-Process -FilePath "node" -ArgumentList $serverPath -PassThru -NoNewWindow
    Start-Sleep -Seconds 5 # Wait for server to start
    $msg = "[$timestamp] Server started (PID: $($serverProcess.Id)). Test endpoints manually (e.g., GET /user/profile, /arbitrators, /onboarding)."
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    Stop-Process -Id $serverProcess.Id -ErrorAction SilentlyContinue
    $msg = "[$timestamp] Server stopped."
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
} catch {
    $msg = "[$timestamp] Error running server: $($_.Exception.Message)"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
}

# Step 4: Run tests
"[$timestamp] Running tests from ${projectRoot}: npm test -- $testPath" | Tee-Object -FilePath $logFile -Append
Write-Host "Running tests..."
try {
    Push-Location -Path $projectRoot
    $testOutput = npm test -- $testPath 2>&1
    $msg = "[$timestamp] Test output:`n$testOutput"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    Pop-Location
} catch {
    $msg = "[$timestamp] Error running tests: $($_.Exception.Message)"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    Pop-Location
}

# Step 5: Output results
$msg = "[$timestamp] Testing completed. Update Agasi and run eslint."
$msg | Tee-Object -FilePath $logFile -Append
Write-Host $msg
Write-Host "Check $logFile for details."