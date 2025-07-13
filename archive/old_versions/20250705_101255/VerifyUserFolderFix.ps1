# VerifyUserFolderFix.ps1
# Purpose: Verify userProfileRoutes.js fix, check tests and users folder
# Date: 2025-06-20 22:45 PDT

# Set variables
$userPath = "C:\CFH\backend\routes\user"
$usersPath = "C:\CFH\backend\routes\users"
$testPath = "C:\CFH\backend\tests\routes\user"
$logFile = "C:\CFH\logs\userFolderVerify_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
$excludedDirs = "node_modules","dist","build",".git"
$timestamp = (Get-Date).ToUniversalTime().ToString("o")

# Initialize log and console
"[$timestamp] Starting verification for userProfileRoutes.js fix" | Tee-Object -FilePath $logFile -Append
"[$timestamp] Excluding directories: $excludedDirs" | Tee-Object -FilePath $logFile -Append
Write-Host "Verifying userProfileRoutes.js fix..."

# Step 1: Verify userProfileRoutes.js
$verify = Get-ChildItem -Path $userPath -Recurse -Include "*.js" | Where-Object { $_.Name -eq "userProfileRoutes.js" -and $_.FullName -notlike "*node_modules*" }
if ($verify) {
    $msg = "[$timestamp] Success: userProfileRoutes.js found at $userPath\userProfileRoutes.js"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
} else {
    $msg = "[$timestamp] Error: userProfileRoutes.js not found at $userPath"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    exit 1
}

# Step 2: Check test files
"[$timestamp] Checking test files in $testPath" | Tee-Object -FilePath $logFile -Append
Write-Host "Checking tests..."
if (Test-Path $testPath) {
    $testFiles = Get-ChildItem -Path $testPath -Recurse -Include "*.js" | Where-Object { $_.Name -like "userProfileRoutes*.test.js" -and $_.FullName -notlike "*node_modules*" }
    if ($testFiles) {
        $testFiles | ForEach-Object {
            $msg = "[$timestamp] Found test: $($_.FullName)"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        }
    } else {
        $msg = "[$timestamp] Debug: No userProfileRoutes test files in $testPath"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    }
} else {
    $msg = "[$timestamp] Debug: $testPath does not exist"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
}

# Step 3: Check users folder
"[$timestamp] Checking files in $usersPath" | Tee-Object -FilePath $logFile -Append
Write-Host "Checking users folder..."
if (Test-Path $usersPath) {
    $usersFiles = Get-ChildItem -Path $usersPath -Recurse -Include "*.js" | Where-Object { $_.FullName -notlike "*node_modules*" }
    if ($usersFiles) {
        $usersFiles | ForEach-Object {
            $msg = "[$timestamp] Found file: $($_.FullName)"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        }
    } else {
        $msg = "[$timestamp] Debug: No files in $usersPath"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    }
} else {
    $msg = "[$timestamp] Debug: $usersPath does not exist"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
}

# Step 4: Output results
$msg = "[$timestamp] Verification completed."
$msg | Tee-Object -FilePath $logFile -Append
Write-Host $msg
Write-Host "Check $logFile for details."