# FixUserFolder.ps1
# Purpose: Rename users folder to user or move userProfileRoutes.js and update references
# Date: 2025-06-20 22:00 PDT

# Set variables
$usersPath = "C:\CFH\backend\routes\users"
$userPath = "C:\CFH\backend\routes\user"
$logFile = "C:\CFH\logs\userFolderFix_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
$timestamp = (Get-Date).ToUniversalTime().ToString("o")

# Initialize log
"[$timestamp] Starting user folder fix for CFH Automotive Ecosystem" | Out-File -FilePath $logFile -Append

# Step 1: Verify contents of users folder
$files = Get-ChildItem -Path $usersPath -Recurse -File
"[$timestamp] Found $($files.Count) files in $usersPath" | Out-File -FilePath $logFile -Append
$files | ForEach-Object { "[$timestamp] File: $($_.FullName)" | Out-File -FilePath $logFile -Append }

# Step 2: Decide action based on folder contents
try {
    if ($files.Count -eq 1 -and $files.Name -eq "userProfileRoutes.js") {
        # Only userProfileRoutes.js exists, rename folder
        "[$timestamp] Renaming $usersPath to $userPath" | Out-File -FilePath $logFile -Append
        Rename-Item -Path $usersPath -NewName "user" -ErrorAction Stop
    } else {
        # Multiple files or different files, move userProfileRoutes.js
        "[$timestamp] Creating $userPath and moving userProfileRoutes.js" | Out-File -FilePath $logFile -Append
        New-Item -ItemType Directory -Path $userPath -Force | Out-Null
        Move-Item -Path "$usersPath\userProfileRoutes.js" -Destination "$userPath\userProfileRoutes.js" -ErrorAction Stop
    }
} catch {
    "[$timestamp] Error: $($_.Exception.Message)" | Out-File -FilePath $logFile -Append
    throw
}

# Step 3: Update internal references
"[$timestamp] Updating references from users/userProfileRoutes to user/userProfileRoutes" | Out-File -FilePath $logFile -Append
$filesToCheck = Get-ChildItem -Path "C:\CFH" -Recurse -Include "*.js","*.ts","*.jsx","*.tsx","*.md" -Exclude "node_modules","dist","build",".git"
$updatedFiles = @()
foreach ($file in $filesToCheck) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "users/userProfileRoutes") {
        $newContent = $content -replace "users/userProfileRoutes", "user/userProfileRoutes"
        Set-Content -Path $file.FullName -Value $newContent
        $updatedFiles += $file.FullName
        "[$timestamp] Updated: $($file.FullName)" | Out-File -FilePath $logFile -Append
    }
}

# Step 4: Update documentation (FileStructureMap.md)
"[$timestamp] Updating FileStructureMap.md" | Out-File -FilePath $logFile -Append
$fileMapPath = "C:\CFH\docs\FileStructureMap.md"
if (Test-Path $fileMapPath) {
    $mapContent = Get-Content $fileMapPath -Raw
    $newMapContent = $mapContent -replace "routes/users/userProfileRoutes", "routes/user/userProfileRoutes"
    Set-Content -Path $fileMapPath -Value $newMapContent
    "[$timestamp] Updated FileStructureMap.md" | Out-File -FilePath $logFile -Append
} else {
    "[$timestamp] Warning: FileStructureMap.md not found" | Out-File -FilePath $logFile -Append
}

# Step 5: Verify
$verify = Get-ChildItem -Path $userPath -Recurse | Where-Object { $_.Name -eq "userProfileRoutes.js" }
if ($verify) {
    "[$timestamp] Success: userProfileRoutes.js found at $userPath\userProfileRoutes.js" | Out-File -FilePath $logFile -Append
} else {
    "[$timestamp] Error: userProfileRoutes.js not found at $userPath" | Out-File -FilePath $logFile -Append
    throw "Verification failed"
}

# Step 6: Output results
"[$timestamp] Completed. Updated $($updatedFiles.Count) files." | Out-File -FilePath $logFile -Append
if ($updatedFiles) {
    "[$timestamp] Files updated:" | Out-File -FilePath $logFile -Append
    $updatedFiles | ForEach-Object { "[$timestamp] $_" | Out-File -FilePath $logFile -Append }
}

Write-Host "Fix completed. Check $logFile for details."