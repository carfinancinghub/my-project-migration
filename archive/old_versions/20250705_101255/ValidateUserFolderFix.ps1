# ValidateUserFolderFix.ps1
# Purpose: Validate userProfileRoutes.js fix, update aliases/tests, exclude node_modules
# Date: 2025-06-20 22:42 PDT

# Set variables
$userPath = "C:\CFH\backend\routes\user"
$testPath = "C:\CFH\backend\tests\routes\user"
$usersTestPath = "C:\CFH\backend\tests\routes\users"
$logFile = "C:\CFH\logs\userFolderFix_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
$fileMapPath = "C:\CFH\docs\FileStructureMap.md"
$excludedDirs = "node_modules","dist","build",".git"
$timestamp = (Get-Date).ToUniversalTime().ToString("o")

# Initialize log and console
"[$timestamp] Starting validation for userProfileRoutes.js fix" | Tee-Object -FilePath $logFile -Append
"[$timestamp] Excluding directories: $excludedDirs" | Tee-Object -FilePath $logFile -Append
Write-Host "Debug: Validating paths, aliases, and tests..."

# Step 1: Verify paths
if (-not (Test-Path "C:\CFH")) {
    $msg = "[$timestamp] Error: C:\CFH does not exist"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    exit 1
}
if (-not (Test-Path $userPath)) {
    $msg = "[$timestamp] Error: $userPath does not exist"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    exit 1
}
if (-not (Test-Path $fileMapPath)) {
    $msg = "[$timestamp] Warning: $fileMapPath not found"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
}
"[$timestamp] Debug: Paths verified" | Tee-Object -FilePath $logFile -Append
Write-Host "Debug: Paths exist"

# Step 2: Verify userProfileRoutes.js
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

# Step 3: Update alias references (@routes/users to @routes/user)
"[$timestamp] Searching for @routes/users/userProfileRoutes references" | Tee-Object -FilePath $logFile -Append
Write-Host "Debug: Scanning for alias references..."
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
        if ($content -match "@routes/users/userProfileRoutes") {
            $newContent = $content -replace "@routes/users/userProfileRoutes", "@routes/user/userProfileRoutes"
            Set-Content -Path $file.FullName -Value $newContent -ErrorAction Stop
            $updatedFiles += $file.FullName
            $msg = "[$timestamp] Updated alias in: $($file.FullName)"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        }
    } catch {
        $msg = "[$timestamp] Error updating $($file.FullName): $($_.Exception.Message)"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    }
}
$msg = "[$timestamp] Debug: Checked $filesChecked files for aliases, updated $($updatedFiles.Count)"
$msg | Tee-Object -FilePath $logFile -Append
Write-Host $msg

# Step 4: Move test files
"[$timestamp] Checking for test files in $usersTestPath" | Tee-Object -FilePath $logFile -Append
Write-Host "Debug: Checking tests..."
if (Test-Path $usersTestPath) {
    $testFiles = Get-ChildItem -Path $usersTestPath -Recurse -Include "*.js" | Where-Object { $_.Name -like "userProfileRoutes*.test.js" -and $_.FullName -notlike "*node_modules*" }
    if ($testFiles) {
        New-Item -ItemType Directory -Path $testPath -Force | Out-Null
        foreach ($testFile in $testFiles) {
            try {
                $dest = Join-Path $testPath $testFile.Name
                Move-Item -Path $testFile.FullName -Destination $dest -ErrorAction Stop
                $msg = "[$timestamp] Moved test: $($testFile.FullName) to $dest"
                $msg | Tee-Object -FilePath $logFile -Append
                Write-Host $msg
            } catch {
                $msg = "[$timestamp] Error moving $($testFile.FullName): $($_.Exception.Message)"
                $msg | Tee-Object -FilePath $logFile -Append
                Write-Host $msg
            }
        }
    } else {
        $msg = "[$timestamp] Debug: No userProfileRoutes test files in $usersTestPath"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    }
} else {
    $msg = "[$timestamp] Debug: $usersTestPath does not exist"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
}

# Step 5: Verify FileStructureMap.md
"[$timestamp] Verifying FileStructureMap.md" | Tee-Object -FilePath $logFile -Append
Write-Host "Debug: Checking documentation..."
if (Test-Path $fileMapPath) {
    try {
        $mapContent = Get-Content $fileMapPath -Raw -ErrorAction Stop
        if ($mapContent -match "routes/user/userProfileRoutes") {
            $msg = "[$timestamp] Success: FileStructureMap.md correctly lists routes/user/userProfileRoutes"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        } else {
            $msg = "[$timestamp] Warning: FileStructureMap.md does not list routes/user/userProfileRoutes"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        }
    } catch {
        $msg = "[$timestamp] Error reading FileStructureMap.md: $($_.Exception.Message)"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    }
} else {
    $msg = "[$timestamp] Warning: FileStructureMap.md not found"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
}

# Step 6: Output results
$msg = "[$timestamp] Completed. Updated $($updatedFiles.Count) alias files, moved $($testFiles.Count) test files."
$msg | Tee-Object -FilePath $logFile -Append
Write-Host $msg
if ($updatedFiles) {
    $msg = "[$timestamp] Alias files updated:"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    $updatedFiles | ForEach-Object { 
        $msg = "[$timestamp] $_"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    }
}

Write-Host "Validation completed. Check $logFile for details."