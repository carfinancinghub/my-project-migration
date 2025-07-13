# ConfirmUsersRestructure.ps1
# Purpose: Confirm users folder restructure, verify tests, update FileStructureMap.md
# Date: 2025-06-20 23:43 PDT

# Set variables
$userPath = "C:\CFH\backend\routes\user"
$arbitratorPath = "C:\CFH\backend\routes\arbitrator"
$onboardingPath = "C:\CFH\backend\routes\onboarding"
$usersPath = "C:\CFH\backend\routes\users"
$testPath = "C:\CFH\backend\tests\routes\user"
$mapPath = "C:\CFH\docs\FileStructureMap.md"
$logFile = "C:\CFH\logs\usersRestructureConfirm_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
$excludedDirs = "node_modules","dist","build",".git"
$timestamp = (Get-Date).ToUniversalTime().ToString("o")

# Initialize log and console
"[$timestamp] Starting confirmation of users folder restructure" | Tee-Object -FilePath $logFile -Append
"[$timestamp] Excluding directories: $excludedDirs" | Tee-Object -FilePath $logFile -Append
Write-Host "Confirming restructure..."

# Step 1: Verify file locations
$filesToCheck = @(
    @{ Path = $userPath; Name = "userProfileRoutes.js" },
    @{ Path = $arbitratorPath; Name = "arbitrators.js" },
    @{ Path = $onboardingPath; Name = "onboarding.js" }
)
foreach ($file in $filesToCheck) {
    $verify = Get-ChildItem -Path $file.Path -Recurse -Include "*.js" | Where-Object { $_.Name -eq $file.Name -and $_.FullName -notlike "*node_modules*" }
    if ($verify) {
        $msg = "[$timestamp] Success: $($file.Name) found at $($file.Path)\$($file.Name)"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    } else {
        $msg = "[$timestamp] Error: $($file.Name) not found at $($file.Path)"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    }
}

# Step 2: Check users folder
"[$timestamp] Checking $usersPath" | Tee-Object -FilePath $logFile -Append
Write-Host "Checking users folder..."
if (Test-Path $usersPath) {
    $usersFiles = Get-ChildItem -Path $usersPath -Recurse -Include "*.js" | Where-Object { $_.FullName -notlike "*node_modules*" }
    if ($usersFiles) {
        $usersFiles | ForEach-Object {
            $msg = "[$timestamp] Warning: Found unexpected file: $($_.FullName)"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        }
    } else {
        $msg = "[$timestamp] Success: $usersPath is empty"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    }
} else {
    $msg = "[$timestamp] Success: $usersPath does not exist"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
}

# Step 3: Verify test file
"[$timestamp] Checking test file in $testPath" | Tee-Object -FilePath $logFile -Append
Write-Host "Checking test file..."
$testFile = Get-ChildItem -Path $testPath -Recurse -Include "userProfileRoutes.test.js" | Where-Object { $_.FullName -notlike "*node_modules*" }
if ($testFile) {
    $msg = "[$timestamp] Success: userProfileRoutes.test.js found at $testPath\userProfileRoutes.test.js"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
} else {
    $msg = "[$timestamp] Error: userProfileRoutes.test.js not found at $testPath"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
}

# Step 4: Update FileStructureMap.md
"[$timestamp] Updating $mapPath" | Tee-Object -FilePath $logFile -Append
Write-Host "Updating FileStructureMap.md..."
if (Test-Path $mapPath) {
    try {
        $content = Get-Content $mapPath -Raw -ErrorAction Stop
        $updates = @(
            "- C:\CFH\backend\routes\arbitrator\arbitrators.js",
            "- C:\CFH\backend\routes\onboarding\onboarding.js"
        )
        $updated = $false
        foreach ($entry in $updates) {
            if ($content -notlike "*$entry*") {
                $content += "`n$entry"
                $updated = $true
            }
        }
        if ($updated) {
            Set-Content -Path $mapPath -Value $content -ErrorAction Stop
            $msg = "[$timestamp] Updated FileStructureMap.md with arbitrator and onboarding"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        } else {
            $msg = "[$timestamp] Debug: FileStructureMap.md already includes arbitrator and onboarding"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        }
    } catch {
        $msg = "[$timestamp] Error updating ${mapPath}: $($_.Exception.Message)"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    }
} else {
    $msg = "[$timestamp] Error: ${mapPath} not found"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
}

# Step 5: Output results
$msg = "[$timestamp] Confirmation completed. Test server and update Agasi."
$msg | Tee-Object -FilePath $logFile -Append
Write-Host $msg
Write-Host "Check $logFile for details."