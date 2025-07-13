# FixArbitratorsAndConfirm.ps1
# Purpose: Fix missing arbitrators.js, confirm users folder restructure, verify tests
# Date: 2025-06-20 23:44 PDT

# Set variables
$userPath = "C:\CFH\backend\routes\user"
$arbitratorPath = "C:\CFH\backend\routes\arbitrator"
$onboardingPath = "C:\CFH\backend\routes\onboarding"
$usersPath = "C:\CFH\backend\routes\users"
$testPath = "C:\CFH\backend\tests\routes\user"
$mapPath = "C:\CFH\docs\FileStructureMap.md"
$logFile = "C:\CFH\logs\fixArbitratorsConfirm_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
$excludedDirs = "node_modules","dist","build",".git"
$timestamp = (Get-Date).ToUniversalTime().ToString("o")

# Initialize log and console
"[$timestamp] Starting fix for arbitrators.js and confirmation of users folder restructure" | Tee-Object -FilePath $logFile -Append
"[$timestamp] Excluding directories: $excludedDirs" | Tee-Object -FilePath $logFile -Append
Write-Host "Fixing arbitrators.js and confirming restructure..."

# Step 1: Search for arbitrators.js
"[$timestamp] Searching for arbitrators.js in C:\CFH" | Tee-Object -FilePath $logFile -Append
Write-Host "Searching for arbitrators.js..."
$foundFiles = Get-ChildItem -Path "C:\CFH" -Recurse -Include "arbitrators.js" -Exclude $excludedDirs | Where-Object { $_.FullName -notlike "*node_modules*" }
if ($foundFiles) {
    $foundFiles | ForEach-Object {
        $msg = "[$timestamp] Found arbitrators.js at $($_.FullName)"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
        try {
            New-Item -ItemType Directory -Path $arbitratorPath -Force | Out-Null
            Move-Item -Path $_.FullName -Destination "$arbitratorPath\arbitrators.js" -ErrorAction Stop
            $msg = "[$timestamp] Moved arbitrators.js to $arbitratorPath\arbitrators.js"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        } catch {
            $msg = "[$timestamp] Error moving $($_.FullName): $($_.Exception.Message)"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        }
    }
} else {
    $msg = "[$timestamp] Warning: arbitrators.js not found in C:\CFH. Creating placeholder."
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    try {
        New-Item -ItemType Directory -Path $arbitratorPath -Force | Out-Null
        $placeholderContent = @"
// arbitrators.js (Placeholder)
// Purpose: API routes for arbitrators
// Note: Original file missing, recreate as needed
const express = require('express');
const router = express.Router();
router.get('/arbitrators', (req, res) => {
    res.status(200).json({ message: 'Arbitrators endpoint placeholder' });
});
module.exports = router;
"@
        Set-Content -Path "$arbitratorPath\arbitrators.js" -Value $placeholderContent -ErrorAction Stop
        $msg = "[$timestamp] Created placeholder: $arbitratorPath\arbitrators.js"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    } catch {
        $msg = "[$timestamp] Error creating placeholder: $($_.Exception.Message)"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    }
}

# Step 2: Verify file locations
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

# Step 3: Check users folder
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

# Step 4: Verify test file
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

# Step 5: Update FileStructureMap.md
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

# Step 6: Output results
$msg = "[$timestamp] Fix and confirmation completed. Test server and update Agasi."
$msg | Tee-Object -FilePath $logFile -Append
Write-Host $msg
Write-Host "Check $logFile for details."