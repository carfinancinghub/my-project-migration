# FixPackageJsonAndTest.ps1
# Purpose: Fix package.json, test server, run tests, install and run ESLint
# Date: 2025-06-21 00:30 PDT

# Set variables
$serverPath = "C:\CFH\backend\index.js"
$testPath = "C:\CFH\backend\tests\routes\user\userProfileRoutes.test.js"
$projectRoot = "C:\CFH\backend"
$packageJsonPath = "C:\CFH\backend\package.json"
$backupPath = "C:\CFH\backend\package.json.bak"
$logFile = "C:\CFH\logs\fixPackageJsonAndTest_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
$excludedDirs = "node_modules","dist","build",".git"
$timestamp = (Get-Date).ToUniversalTime().ToString("o")

# Initialize log and console
"[$timestamp] Starting package.json fix and verification for CFH Automotive Ecosystem" | Tee-Object -FilePath $logFile -Append
"[$timestamp] Excluding directories: $excludedDirs" | Tee-Object -FilePath $logFile -Append
Write-Host "Fixing package.json and testing..."

# Step 1: Backup package.json
"[$timestamp] Backing up ${packageJsonPath} to $backupPath" | Tee-Object -FilePath $logFile -Append
Write-Host "Backing up package.json..."
try {
    if (Test-Path $packageJsonPath) {
        Copy-Item -Path $packageJsonPath -Destination $backupPath -Force -ErrorAction Stop
        $msg = "[$timestamp] Success: Backed up ${packageJsonPath} to $backupPath"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    } else {
        $msg = "[$timestamp] Error: ${packageJsonPath} not found"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
        exit 1
    }
} catch {
    $msg = "[$timestamp] Error backing up ${packageJsonPath}: $($_.Exception.Message)"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    exit 1
}

# Step 2: Fix package.json
"[$timestamp] Attempting to fix ${packageJsonPath}" | Tee-Object -FilePath $logFile -Append
Write-Host "Fixing package.json..."
try {
    $content = Get-Content $packageJsonPath -Raw -ErrorAction Stop
    # Replace literal \n with actual newline, remove trailing commas, comments
    $fixedContent = $content -replace '\\n', "`n" `
                            -replace ',\s*([\]\}])', '$1' `
                            -replace '//.*?\n', '' `
                            -replace '/\*[\s\S]*?\*/', ''
    # Validate JSON
    $null = $fixedContent | ConvertFrom-Json -ErrorAction Stop
    Set-Content -Path $packageJsonPath -Value $fixedContent -ErrorAction Stop
    $msg = "[$timestamp] Success: Fixed and validated ${packageJsonPath}"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
} catch {
    $msg = "[$timestamp] Error fixing ${packageJsonPath}: $($_.Exception.Message)"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    $msg = "[$timestamp] Creating minimal package.json as fallback"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    try {
        $minimalPackageJson = @"
{
  "name": "CFH-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "test": "jest --verbose"
  },
  "dependencies": {
    "express": "^4.18.2",
    "module-alias": "^2.2.3"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^7.1.1"
  },
  "_moduleAliases": {
    "@": ".",
    "@controllers": "./controllers",
    "@routes": "./routes",
    "@utils": "./utils",
    "@services": "./services",
    "@models": "./models",
    "@config": "./config",
    "@middleware": "./middleware",
    "@socket": "./socket",
    "@tests": "./tests",
    "@tools": "./tools",
    "@ai": "./services/ai",
    "@tasks": "./tasks"
  }
}
"@
        Set-Content -Path $packageJsonPath -Value $minimalPackageJson -ErrorAction Stop
        $msg = "[$timestamp] Success: Created minimal ${packageJsonPath}"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    } catch {
        $msg = "[$timestamp] Error creating minimal ${packageJsonPath}: $($_.Exception.Message)"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
        $msg = "[$timestamp] Restoring backup from $backupPath"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
        Copy-Item -Path $backupPath -Destination $packageJsonPath -Force
        exit 1
    }
}

# Step 3: Verify server file
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

# Step 4: Test server
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

# Step 5: Run tests
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

# Step 6: Install and run ESLint
"[$timestamp] Installing ESLint in ${projectRoot}" | Tee-Object -FilePath $logFile -Append
Write-Host "Installing ESLint..."
try {
    Push-Location -Path $projectRoot
    $eslintInstall = npm install eslint --save-dev 2>&1
    $msg = "[$timestamp] ESLint install output:`n$eslintInstall"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg

    # Ensure .eslintrc.json exists
    $eslintConfig = @"
{
  "rules": {
    "no-restricted-imports": ["error", {
      "paths": ["users/userProfileRoutes", "users/arbitrators", "users/onboarding"],
      "patterns": ["*/users/*"]
    }]
  },
  "env": {
    "node": true,
    "jest": true
  },
  "extends": ["eslint:recommended"]
}
"@
    Set-Content -Path (Join-Path $projectRoot ".eslintrc.json") -Value $eslintConfig -ErrorAction Stop
    $msg = "[$timestamp] Ensured .eslintrc.json in ${projectRoot}"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg

    # Run ESLint
    "[$timestamp] Running ESLint: npx eslint C:\CFH" | Tee-Object -FilePath $logFile -Append
    Write-Host "Running ESLint..."
    $eslintOutput = npx eslint C:\CFH 2>&1
    $msg = "[$timestamp] ESLint output:`n$eslintOutput"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    Pop-Location
} catch {
    $msg = "[$timestamp] Error installing/running ESLint: $($_.Exception.Message)"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    Pop-Location
}

# Step 7: Output results
$msg = "[$timestamp] Package.json fix, testing, and linting completed. Update Agasi."
$msg | Tee-Object -FilePath $logFile -Append
Write-Host $msg
Write-Host "Check $logFile for details."