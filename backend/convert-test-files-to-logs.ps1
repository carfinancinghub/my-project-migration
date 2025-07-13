# (c) 2025 CFH, All Rights Reserved
# Purpose: Convert specific test files to logs for error analysis in the CFH Automotive Ecosystem
# Author: CFH Dev Team
# Date: 2025-06-24T23:00:00.000Z
# Version: 1.0.0
# Crown Certified: Yes
# Batch ID: Tools-062325
# Save Location: C:\CFH\backend\convert-test-files-to-logs.ps1

$ts = Get-Date -Format 'yyyyMMdd_HHmmss'
$logDir = "C:\CFH\Cod1Logs"
New-Item -ItemType Directory -Path $logDir -Force | Out-Null
$cod1Log = "$logDir\cod1_log_$ts.log"

function Write-Cod1Log {
    param([string]$Message)
    "[$((Get-Date).ToUniversalTime().ToString('o'))] $Message" | Out-File -FilePath $cod1Log -Append -Encoding UTF8
}

Write-Cod1Log "Starting conversion of test files to logs."

$testFiles = @(
    "C:\CFH\backend\tests\integration\CrossModuleIntegration.test.js",
    "C:\CFH\backend\tests\regression\WowRegression.test.js",
    "C:\CFH\backend\tests\services\ai\TrustScoreEngine.test.js"
)

foreach ($file in $testFiles) {
    if (Test-Path $file) {
        $logFile = "$logDir\$(Split-Path $file -Leaf)_converted_$ts.log"
        Get-Content -Path $file -Raw | Out-File -FilePath $logFile -Encoding UTF8
        Write-Cod1Log "Converted $file to $logFile"
        Write-Host "Converted $file to $logFile"
    } else {
        Write-Cod1Log "File not found: $file"
        Write-Host "File not found: $file"
    }
}

Write-Cod1Log "Test file conversion completed."
Write-Host "Test file conversion completed. Logs saved to $logDir"