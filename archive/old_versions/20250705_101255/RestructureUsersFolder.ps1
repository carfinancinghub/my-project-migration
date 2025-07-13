# RestructureUsersFolder.ps1
# Purpose: Restructure users folder, verify userProfileRoutes.js, handle tests
# Date: 2025-06-20 23:20 PDT

# Set variables
$userPath = "C:\CFH\backend\routes\user"
$usersPath = "C:\CFH\backend\routes\users"
$testBasePath = "C:\CFH\backend\tests"
$testUserPath = "C:\CFH\backend\tests\user"
$testRoutesUserPath = "C:\CFH\backend\tests\routes\user"
$logFile = "C:\CFH\logs\usersFolderRestructure_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
$excludedDirs = "node_modules","dist","build",".git"
$timestamp = (Get-Date).ToUniversalTime().ToString("o")

# Initialize log and console
"[$timestamp] Starting users folder restructure for CFH Automotive Ecosystem" | Tee-Object -FilePath $logFile -Append
"[$timestamp] Excluding directories: $excludedDirs" | Tee-Object -FilePath $logFile -Append
Write-Host "Restructuring users folder..."

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

# Step 2: Handle UserProfile.test.js
"[$timestamp] Checking UserProfile.test.js in $testUserPath" | Tee-Object -FilePath $logFile -Append
Write-Host "Checking test file..."
if (Test-Path $testUserPath) {
    $testFile = Get-ChildItem -Path $testUserPath -Recurse -Include "UserProfile.test.js" | Where-Object { $_.FullName -notlike "*node_modules*" }
    if ($testFile) {
        try {
            $content = Get-Content $testFile.FullName -Raw -ErrorAction Stop
            if ($content -match "userProfileRoutes") {
                New-Item -ItemType Directory -Path $testRoutesUserPath -Force | Out-Null
                Move-Item -Path $testFile.FullName -Destination "$testRoutesUserPath\userProfileRoutes.test.js" -ErrorAction Stop
                $msg = "[$timestamp] Moved: $($testFile.FullName) to $testRoutesUserPath\userProfileRoutes.test.js"
                $msg | Tee-Object -FilePath $logFile -Append
                Write-Host $msg
            } else {
                $msg = "[$timestamp] Debug: UserProfile.test.js does not test userProfileRoutes.js, leaving in place"
                $msg | Tee-Object -FilePath $logFile -Append
                Write-Host $msg
            }
        } catch {
            $msg = "[$timestamp] Error handling $($testFile.FullName): $($_.Exception.Message)"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        }
    } else {
        $msg = "[$timestamp] Debug: No UserProfile.test.js in $testUserPath"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    }
} else {
    $msg = "[$timestamp] Debug: $testUserPath does not exist"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
}

# Step 3: Create placeholder userProfileRoutes.test.js if needed
"[$timestamp] Checking for userProfileRoutes.test.js" | Tee-Object -FilePath $logFile -Append
Write-Host "Creating test placeholder if needed..."
if (-not (Test-Path "$testRoutesUserPath\userProfileRoutes.test.js")) {
    try {
        New-Item -ItemType Directory -Path $testRoutesUserPath -Force | Out-Null
        $testContent = @"
// userProfileRoutes.test.js
const request = require('supertest');
const app = require('../../../server'); // Adjust path as needed
describe('User Profile Routes', () => {
  test('GET /user/profile should return 200', async () => {
    const response = await request(app).get('/user/profile');
    expect(response.status).toBe(200);
  });
});
"@
        Set-Content -Path "$testRoutesUserPath\userProfileRoutes.test.js" -Value $testContent -ErrorAction Stop
        $msg = "[$timestamp] Created: $testRoutesUserPath\userProfileRoutes.test.js"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    } catch {
        $msg = "[$timestamp] Error creating $testRoutesUserPath\userProfileRoutes.test.js: $($_.Exception.Message)"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    }
} else {
    $msg = "[$timestamp] Debug: userProfileRoutes.test.js already exists"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
}

# Step 4: Move arbitrators.js and onboarding.js
"[$timestamp] Restructuring $usersPath" | Tee-Object -FilePath $logFile -Append
Write-Host "Moving files from users..."
if (Test-Path $usersPath) {
    $usersFiles = Get-ChildItem -Path $usersPath -Recurse -Include "*.js" | Where-Object { $_.FullName -notlike "*node_modules*" }
    foreach ($file in $usersFiles) {
        $moduleName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
        $newPath = "C:\CFH\backend\routes\$moduleName"
        try {
            New-Item -ItemType Directory -Path $newPath -Force | Out-Null
            Move-Item -Path $file.FullName -Destination "$newPath\$($file.Name)" -ErrorAction Stop
            $msg = "[$timestamp] Moved: $($file.FullName) to $newPath\$($file.Name)"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        } catch {
            $msg = "[$timestamp] Error moving $($file.FullName): $($_.Exception.Message)"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        }
    }
} else {
    $msg = "[$timestamp] Debug: $usersPath does not exist"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
}

# Step 5: Update alias references
"[$timestamp] Updating aliases for arbitrators.js and onboarding.js" | Tee-Object -FilePath $logFile -Append
Write-Host "Updating aliases..."
$filesToCheck = Get-ChildItem -Path "C:\CFH" -Recurse -Include "*.js","*.ts","*.jsx","*.tsx","*.md" -Exclude $excludedDirs | Where-Object { $_.FullName -notlike "*node_modules*" }
$updatedFiles = @()
$filesChecked = 0
foreach ($file in $filesToCheck) {
    $filesChecked++
    if ($file.FullName -like "*node_modules*") {
        $msg = "[$timestamp] Warning: node_modules detected in $($file.FullName), skipping"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
        continue
    }
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction Stop
        $updated = $false
        if ($content -match "@routes/users/arbitrators") {
            $content = $content -replace "@routes/users/arbitrators", "@routes/arbitrator/arbitrators"
            $updated = $true
        }
        if ($content -match "@routes/users/onboarding") {
            $content = $content -replace "@routes/users/onboarding", "@routes/onboarding/onboarding"
            $updated = $true
        }
        if ($updated) {
            Set-Content -Path $file.FullName -Value $content -ErrorAction Stop
            $updatedFiles += $file.FullName
            $msg = "[$timestamp] Updated aliases in: $($file.FullName)"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        }
    } catch {
        $msg = "[$timestamp] Error updating $($file.FullName): $($_.Exception.Message)"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    }
}
$msg = "[$timestamp] Debug: Checked $filesChecked files, updated $($updatedFiles.Count)"
$msg | Tee-Object -FilePath $logFile -Append
Write-Host $msg

# Step 6: Output results
$msg = "[$timestamp] Completed. Updated $($updatedFiles.Count) files, handled tests."
$msg | Tee-Object -FilePath $logFile -Append
Write-Host $msg
if ($updatedFiles) {
    $msg = "[$timestamp] Updated files:"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    $updatedFiles | ForEach-Object {
        $msg = "[$timestamp] $_"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    }
}
Write-Host "Check $logFile for details. Test server and update Agasi."