# FinalizeUserFolderFix.ps1
# Purpose: Finalize userProfileRoutes.js fix, check tests, plan users folder restructure
# Date: 2025-06-20 23:17 PDT

# Set variables
$userPath = "C:\CFH\backend\routes\user"
$usersPath = "C:\CFH\backend\routes\users"
$testBasePath = "C:\CFH\backend\tests"
$logFile = "C:\CFH\logs\userFolderFinalize_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
$excludedDirs = "node_modules","dist","build",".git"
$timestamp = (Get-Date).ToUniversalTime().ToString("o")

# Initialize log and console
"[$timestamp] Starting final verification for userProfileRoutes.js fix" | Tee-Object -FilePath $logFile -Append
"[$timestamp] Excluding directories: $excludedDirs" | Tee-Object -FilePath $logFile -Append
Write-Host "Finalizing userProfileRoutes.js fix..."

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

# Step 2: Check for tests
"[$timestamp] Checking for userProfileRoutes tests in $testBasePath" | Tee-Object -FilePath $logFile -Append
Write-Host "Checking tests..."
$testFiles = Get-ChildItem -Path $testBasePath -Recurse -Include "*.test.js" | Where-Object { $_.Name -like "*userProfile*" -and $_.FullName -notlike "*node_modules*" }
if ($testFiles) {
    $testFiles | ForEach-Object {
        $msg = "[$timestamp] Found test: $($_.FullName)"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    }
} else {
    $msg = "[$timestamp] Debug: No userProfileRoutes tests found"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
}

# Step 3: List users folder contents
"[$timestamp] Listing files in $usersPath" | Tee-Object -FilePath $logFile -Append
Write-Host "Listing users folder..."
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
$msg = "[$timestamp] Final verification completed."
$msg | Tee-Object -FilePath $logFile -Append
Write-Host $msg
Write-Host "Check $logFile for details. Next steps: Test server, update Agasi, plan users folder restructure."