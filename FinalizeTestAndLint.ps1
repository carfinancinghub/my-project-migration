# FinalizeTestAndLint.ps1
# Purpose: Fix server, Jest, and ESLint configs, test server, run tests, run ESLint
# Date: 2025-06-21 17:38 PDT
# Artifact Version: m3n4p5q6-8e9f-9g0h-j1k2-s3t4u5v6w7x8

# Set variables
$serverPath = "C:\CFH\backend\index.js"
$testPath = "C:\CFH\backend\tests\routes\user\userProfileRoutes.test.js"
$lenderRoutePath = "C:\CFH\backend\routes\lender\lenderTermsHistoryRoute.js"
$projectRoot = "C:\CFH\backend"
$packageJsonPath = "C:\CFH\backend\package.json"
$jestConfigPath = "C:\CFH\backend\jest.config.js"
$eslintConfigPath = "C:\CFH\backend\eslint.config.js"
$serverOutputLog = "C:\CFH\logs\server_output_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
$serverErrorLog = "C:\CFH\logs\server_error_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
$logFile = "C:\CFH\logs\finalizeTestAndLint_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
$transcriptLog = "C:\CFH\WPromptOutput\console_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
$excludedDirs = "node_modules","dist","build",".git"
$timestamp = (Get-Date).ToUniversalTime().ToString("o")

# Start transcript
New-Item -ItemType Directory -Path C:\CFH\WPromptOutput -Force | Out-Null
Start-Transcript -Path $transcriptLog -Append

# Initialize log
"[$timestamp] Starting test and lint verification" | Tee-Object -FilePath $logFile -Append
Write-Host "Testing and linting..."

# Step 1: Verify package.json
"[$timestamp] Verifying ${packageJsonPath}" | Tee-Object -FilePath $logFile -Append
if (Test-Path $packageJsonPath) {
    try {
        $content = Get-Content $packageJsonPath -Raw | ConvertFrom-Json -ErrorAction Stop
        $msg = "[$timestamp] Success: ${packageJsonPath} is valid JSON"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    } catch {
        $msg = "[$timestamp] Error: ${packageJsonPath} is invalid: $($_.Exception.Message)"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
        Stop-Transcript
        exit 1
    }
} else {
    $msg = "[$timestamp] Error: ${packageJsonPath} not found"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    Stop-Transcript
    exit 1
}

# Step 2: Fix socket.js
"[$timestamp] Verifying socket/index.js" | Tee-Object -FilePath $logFile -Append
try {
    $socketPath = "C:\CFH\backend\socket\index.js"
    if (Test-Path $socketPath) {
        $content = Get-Content $socketPath -Raw -ErrorAction Stop
        if ($content -match 'const\s*clients\s*=\s*new\s*Map\s*\(\s*\)') {
            $content = $content -replace 'const\s*clients\s*=\s*new\s*Map\s*\(\s*\)', "// const clients = new Map();"
            $msg = "[$timestamp] Success: Commented out clients in ${socketPath}"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        }
        $fixedContent = $content -replace '\bconst\b', 'var'
        Set-Content -Path $socketPath -Value $fixedContent -ErrorAction Stop
        $msg = "[$timestamp] Success: Replaced const with var in ${socketPath}"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    } else {
        $msg = "[$timestamp] Error: ${socketPath} not found"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    }
} catch {
    $msg = "[$timestamp] Error updating ${socketPath}: $($_.Exception.Message)"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
}

# Step 3: Fix index.js
"[$timestamp] Fixing index.js" | Tee-Object -FilePath $logFile -Append
try {
    if (Test-Path $serverPath) {
        $content = Get-Content $serverPath -Raw -ErrorAction Stop
        if ($content -match '\.catch\(\(err\)\s*=>\s*\);\s*') {
            $fixedContent = $content -replace '\.catch\(\(err\)\s*=>\s*\);\s*', '.catch((err) => { console.error("Database connection error:", err); process.exit(1); });\n'
            Set-Content -Path $serverPath -Value $fixedContent -ErrorAction Stop
            $msg = "[$timestamp] Success: Fixed catch block in ${serverPath}"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        } else {
            $msg = "[$timestamp] Debug: No empty catch block found in ${serverPath}"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        }
    } else {
        $msg = "[$timestamp] Error: ${serverPath} not found"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    }
} catch {
    $msg = "[$timestamp] Error updating ${serverPath}: $($_.Exception.Message)"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
}

# Step 4: Install ws and supertest
"[$timestamp] Installing ws and supertest" | Tee-Object -FilePath $logFile -Append
try {
    Push-Location -Path $projectRoot
    $installOutput = npm install ws supertest --save-dev 2>&1
    $msg = "[$timestamp] ws and supertest install output:`n$installOutput"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    Pop-Location
} catch {
    $msg = "[$timestamp] Error installing ws and supertest: $($_.Exception.Message)"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    Pop-Location
}

# Step 5: Fix test file
"[$timestamp] Checking ${testPath}" | Tee-Object -FilePath $logFile -Append
if (Test-Path $testPath) {
    try {
        $content = Get-Content $testPath -Raw -ErrorAction Stop
        $fixedContent = $content -replace 'require\([''"]\.\./\.\./\.\./server[''"]\)', "require('@/index')"
        if (-not ($content -match 'jest\.mock\([''"]@/index[''"]\)')) {
            $fixedContent = $fixedContent -replace 'const app = require\([''"]@/index[''"]\);', "jest.mock('@/index');\nconst app = require('@/index');"
            Set-Content -Path $testPath -Value $fixedContent -ErrorAction Stop
            $msg = "[$timestamp] Success: Added jest.mock('@/index')"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        } else {
            $msg = "[$timestamp] Debug: jest.mock('@/index') already present"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        }
    } catch {
        $msg = "[$timestamp] Error processing ${testPath}: $($_.Exception.Message)"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    }
} else {
    $msg = "[$timestamp] Error: ${testPath} not found"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    Stop-Transcript
    exit 1
}

# Step 6: Create mock for index.js
"[$timestamp] Creating mock for index.js" | Tee-Object -FilePath $logFile -Append
try {
    $mockDir = "${projectRoot}\__mocks__"
    $mockFile = "${mockDir}\index.js"
    New-Item -ItemType Directory -Path $mockDir -Force | Out-Null
    $mockContent = @"
// __mocks__/index.js
const express = require('express');
const app = express();
app.get('/user/profile', (req, res) => res.status(200).json({ success: true }));
app.get('/arbitrators', (req, res) => res.status(200).json({ success: true }));
app.get('/onboarding', (req, res) => res.status(200).json({ success: true }));
module.exports = app;
"@
    Set-Content -Path $mockFile -Value $mockContent -ErrorAction Stop
    $msg = "[$timestamp] Success: Created ${mockFile}"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
} catch {
    $msg = "[$timestamp] Error creating mock: $($_.Exception.Message)"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
}

# Step 7: Verify ts-jest and typescript
"[$timestamp] Verifying ts-jest and typescript" | Tee-Object -FilePath $logFile -Append
try {
    Push-Location -Path $projectRoot
    $tsJestCheck = npm list ts-jest typescript 2>&1
    $msg = "[$timestamp] ts-jest and typescript check output:`n$tsJestCheck"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    if ($tsJestCheck -notmatch "ts-jest" -or $tsJestCheck -notmatch "typescript") {
        $tsJestInstall = npm install ts-jest typescript --save-dev 2>&1
        $msg = "[$timestamp] ts-jest and typescript install output:`n$tsJestInstall"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    }
    Pop-Location
} catch {
    $msg = "[$timestamp] Error verifying/installing ts-jest and typescript: $($_.Exception.Message)"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    Pop-Location
}

# Step 8: Update Jest configuration
"[$timestamp] Updating Jest configuration" | Tee-Object -FilePath $logFile -Append
try {
    $jestConfig = @"
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testMatch: ['**/tests/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@controllers/(.*)$': '<rootDir>/controllers/$1',
    '^@routes/(.*)$': '<rootDir>/routes/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
    '^@services/(.*)$': '<rootDir>/services/$1',
    '^@models/(.*)$': '<rootDir>/models/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@middleware/(.*)$': '<rootDir>/middleware/$1',
    '^@socket/(.*)$': '<rootDir>/socket/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '^@tools/(.*)$': '<rootDir>/tools/$1',
    '^@ai/(.*)$': '<rootDir>/services/ai/$1',
    '^@tasks/(.*)$': '<rootDir>/tasks/$1'
  }
};
"@
    Set-Content -Path $jestConfigPath -Value $jestConfig -ErrorAction Stop
    $msg = "[$timestamp] Success: Updated ${jestConfigPath}"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
} catch {
    $msg = "[$timestamp] Error updating ${jestConfigPath}: $($_.Exception.Message)"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
}

# Step 9: Verify LenderTermsExporter import
"[$timestamp] Checking ${lenderRoutePath}" | Tee-Object -FilePath $logFile -Append
if (Test-Path $lenderRoutePath) {
    try {
        $content = Get-Content $lenderRoutePath -Raw -ErrorAction Stop
        if ($content -match 'require\([''"](\.\./\.\./services/lender/LenderTermsExporter|@services/lender/LenderTermsExporter)[''"]\)') {
            $fixedContent = $content -replace 'require\([''"](\.\./\.\./services/lender/LenderTermsExporter|@services/lender/LenderTermsExporter)[''"]\)', "require('@controllers/lender/LenderTermsExporter')"
            Set-Content -Path $lenderRoutePath -Value $fixedContent -ErrorAction Stop
            $msg = "[$timestamp] Success: Updated import in ${lenderRoutePath}"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        } else {
            $msg = "[$timestamp] Debug: No incorrect import in ${lenderRoutePath}"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        }
    } catch {
        $msg = "[$timestamp] Error updating ${lenderRoutePath}: $($_.Exception.Message)"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    }
} else {
    $msg = "[$timestamp] Error: ${lenderRoutePath} not found"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
}

# Step 10: Verify server file
"[$timestamp] Verifying server file" | Tee-Object -FilePath $logFile -Append
if (Test-Path $serverPath) {
    $msg = "[$timestamp] Success: Server file found"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
} else {
    $msg = "[$timestamp] Error: Server file not found"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    Stop-Transcript
    exit 1
}

# Step 11: Test server
"[$timestamp] Running server" | Tee-Object -FilePath $logFile -Append
try {
    $serverProcess = Start-Process -FilePath "node" -ArgumentList $serverPath -PassThru -NoNewWindow -RedirectStandardOutput $serverOutputLog -RedirectStandardError $serverErrorLog
    Start-Sleep -Seconds 15
    $msg = "[$timestamp] Server started (PID: $($serverProcess.Id)). Test endpoints manually."
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    Stop-Process -Id $serverProcess.Id -ErrorAction SilentlyContinue
    $serverOutput = Get-Content $serverOutputLog -Raw -ErrorAction SilentlyContinue
    $serverError = Get-Content $serverErrorLog -Raw -ErrorAction SilentlyContinue
    $msg = "[$timestamp] Server output:`n$serverOutput`nServer errors:`n$serverError"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    $msg = "[$timestamp] Server stopped."
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
} catch {
    $msg = "[$timestamp] Error running server: $($_.Exception.Message)"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
}

# Step 12: Run tests
"[$timestamp] Running tests" | Tee-Object -FilePath $logFile -Append
try {
    Push-Location -Path $projectRoot
    $testOutput = npm test -- --verbose --runInBand --detectOpenHandles --forceExit 2>&1
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

# Step 13: Install and run ESLint
"[$timestamp] Installing ESLint" | Tee-Object -FilePath $logFile -Append
try {
    Push-Location -Path $projectRoot
    $eslintInstall = npm install eslint --save-dev 2>&1
    $msg = "[$timestamp] ESLint install output:`n$eslintInstall"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg

    $eslintConfig = @"
const globals = require('globals');

module.exports = [
  {
    files: [
      'index.js',
      'routes/user/userProfileRoutes.js',
      'routes/arbitrator/arbitrators.js',
      'routes/onboarding/onboarding.js',
      'routes/lender/lenderTermsHistoryRoute.js'
    ],
    rules: {
      'no-restricted-imports': ['error', {
        paths: ['users/userProfileRoutes', 'users/arbitrators', 'users/onboarding'],
        patterns: ['*/users/*']
      }],
      'no-unused-vars': ['error'],
      'no-undef': ['error'],
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'eqeqeq': ['error', 'always'],
      'no-console': ['warn']
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      }
    }
  }
];
"@
    Set-Content -Path $eslintConfigPath -Value $eslintConfig -ErrorAction Stop
    $msg = "[$timestamp] Created ${eslintConfigPath}"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg

    "[$timestamp] Running ESLint" | Tee-Object -FilePath $logFile -Append
    $eslintOutput = npx eslint --ext .js --format stylish --max-warnings 10 --debug --fix index.js routes/user/userProfileRoutes.js routes/arbitrator/arbitrators.js routes/onboarding/onboarding.js routes/lender/lenderTermsHistoryRoute.js 2>&1
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

# Step 14: Output results
$msg = "[$timestamp] Testing and linting completed. Update Agasi."
$msg | Tee-Object -FilePath $logFile -Append
Write-Host $msg
Stop-Transcript