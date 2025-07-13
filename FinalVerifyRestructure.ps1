# FinalVerifyRestructure.ps1
# Purpose: Final verification of users folder restructure, check aliases
# Date: 2025-06-20 23:52 PDT

# Set variables
$userPath = "C:\CFH\backend\routes\user"
$arbitratorPath = "C:\CFH\backend\routes\arbitrator"
$onboardingPath = "C:\CFH\backend\routes\onboarding"
$usersPath = "C:\CFH\backend\routes\users"
$testPath = "C:\CFH\backend\tests\routes\user"
$logFile = "C:\CFH\logs\finalVerifyRestructure_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
$excludedDirs = "node_modules","dist","build",".git"
$timestamp = (Get-Date).ToUniversalTime().ToString("o")

# Initialize log and console
"[$timestamp] Starting final verification of users folder restructure" | Tee-Object -FilePath $logFile -Append
"[$timestamp] Excluding directories: $excludedDirs" | Tee-Object -FilePath $logFile -Append
Write-Host "Final verification..."

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

# Step 4: Check aliases in index.js and indexold.js
"[$timestamp] Checking aliases in index.js and indexold.js" | Tee-Object -FilePath $logFile -Append
Write-Host "Checking aliases..."
$indexFiles = @("C:\CFH\backend\index.js", "C:\CFH\backend\indexold.js")
foreach ($file in $indexFiles) {
    if (Test-Path $file) {
        try {
            $content = Get-Content $file -Raw -ErrorAction Stop
            $aliases = @("@routes/arbitrator/arbitrators", "@routes/onboarding/onboarding")
            foreach ($alias in $aliases) {
                if ($content -match $alias) {
                    $msg = "[$timestamp] Success: Found $alias in $file"
                    $msg | Tee-Object -FilePath $logFile -Append
                    Write-Host $msg
                } else {
                    $msg = "[$timestamp] Warning: $alias not found in $file"
                    $msg | Tee-Object -FilePath $logFile -Append
                    Write-Host $msg
                }
            }
        } catch {
            $msg = "[$timestamp] Error reading ${file}: $($_.Exception.Message)"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        }
    } else {
        $msg = "[$timestamp] Warning: $file not found"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    }
}

# Step 5: Output results
$msg = "[$timestamp] Final verification completed. Test server, run tests, update Agasi."
$msg | Tee-Object -FilePath $logFile -Append
Write-Host $msg
Write-Host "Check $logFile for details."