# FixedUserFolderFix.ps1
# Purpose: Update userProfileRoutes.js references, exclude node_modules, with debug output
# Date: 2025-06-20 22:22 PDT

# Check for admin privileges
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "Warning: Script requires admin privileges for file access. Relaunching as admin..."
    Start-Process powershell -Verb RunAs -ArgumentList "-File `"$PSCommandPath`""
    exit
}

# Set variables
$userPath = "C:\CFH\backend\routes\user"
$logFile = "C:\CFH\logs\userFolderFix_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
$fileMapPath = "C:\CFH\docs\FileStructureMap.md"
$excludedDirs = "node_modules","dist","build",".git"
$timestamp = (Get-Date).ToUniversalTime().ToString("o")

# Initialize log and console
"[$timestamp] Starting user folder fix for CFH Automotive Ecosystem" | Tee-Object -FilePath $logFile -Append
"[$timestamp] Excluding directories: $excludedDirs" | Tee-Object -FilePath $logFile -Append
Write-Host "Debug: Checking paths and references..."

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

# Step 2: Check for userProfileRoutes.js
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

# Step 3: Update internal references
"[$timestamp] Searching for users/userProfileRoutes references" | Tee-Object -FilePath $logFile -Append
Write-Host "Debug: Scanning files..."
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
        if ($content -match "users/userProfileRoutes") {
            $newContent = $content -replace "users/userProfileRoutes", "user/userProfileRoutes"
            Set-Content -Path $file.FullName -Value $newContent -ErrorAction Stop
            $updatedFiles += $file.FullName
            $msg = "[$timestamp] Updated: $($file.FullName)"
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

# Step 4: Update documentation (FileStructureMap.md)
"[$timestamp] Updating FileStructureMap.md" | Tee-Object -FilePath $logFile -Append
Write-Host "Debug: Updating documentation..."
if (Test-Path $fileMapPath) {
    try {
        $mapContent = Get-Content $fileMapPath -Raw -ErrorAction Stop
        if ($mapContent -match "routes/users/userProfileRoutes") {
            $newMapContent = $mapContent -replace "routes/users/userProfileRoutes", "routes/user/userProfileRoutes"
            Set-Content -Path $fileMapPath -Value $newMapContent -ErrorAction Stop
            $msg = "[$timestamp] Updated FileStructureMap.md"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        } else {
            $msg = "[$timestamp] Debug: No users/userProfileRoutes in FileStructureMap.md"
            $msg | Tee-Object -FilePath $logFile -Append
            Write-Host $msg
        }
    } catch {
        $msg = "[$timestamp] Error updating FileStructureMap.md: $($_.Exception.Message)"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    }
} else {
    $msg = "[$timestamp] Warning: FileStructureMap.md not found"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
}

# Step 5: Output results
$msg = "[$timestamp] Completed. Updated $($updatedFiles.Count) files."
$msg | Tee-Object -FilePath $logFile -Append
Write-Host $msg
if ($updatedFiles) {
    $msg = "[$timestamp] Files updated:"
    $msg | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
    $updatedFiles | ForEach-Object { 
        $msg = "[$timestamp] $_"
        $msg | Tee-Object -FilePath $logFile -Append
        Write-Host $msg
    }
}

Write-Host "Fix completed. Check $logFile for details."