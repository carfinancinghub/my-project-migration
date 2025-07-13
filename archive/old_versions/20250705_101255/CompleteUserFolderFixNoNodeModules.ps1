# CompleteUserFolderFixNoNodeModules.ps1
# Purpose: Update references and documentation for userProfileRoutes.js, excluding node_modules
# Date: 2025-06-20 22:08 PDT

# Set variables
$userPath = "C:\CFH\backend\routes\user"
$logFile = "C:\CFH\logs\userFolderFix_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
$timestamp = (Get-Date).ToUniversalTime().ToString("o")
$excludedDirs = "node_modules","dist","build",".git"

# Initialize log
"[$timestamp] Starting user folder fix for CFH Automotive Ecosystem" | Out-File -FilePath $logFile -Append
"[$timestamp] Excluding directories: $excludedDirs" | Out-File -FilePath $logFile -Append

# Step 1: Update internal references
"[$timestamp] Updating references from users/userProfileRoutes to user/userProfileRoutes" | Out-File -FilePath $logFile -Append
$filesToCheck = Get-ChildItem -Path "C:\CFH" -Recurse -Include "*.js","*.ts","*.jsx","*.tsx","*.md" -Exclude $excludedDirs
$updatedFiles = @()
foreach ($file in $filesToCheck) {
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction Stop
        if ($content -match "users/userProfileRoutes") {
            $newContent = $content -replace "users/userProfileRoutes", "user/userProfileRoutes"
            Set-Content -Path $file.FullName -Value $newContent -ErrorAction Stop
            $updatedFiles += $file.FullName
            "[$timestamp] Updated: $($file.FullName)" | Out-File -FilePath $logFile -Append
        }
    } catch {
        "[$timestamp] Error updating $($file.FullName): $($_.Exception.Message)" | Out-File -FilePath $logFile -Append
    }
}

# Step 2: Update documentation (FileStructureMap.md)
"[$timestamp] Updating FileStructureMap.md" | Out-File -FilePath $logFile -Append
$fileMapPath = "C:\CFH\docs\FileStructureMap.md"
if (Test-Path $fileMapPath) {
    try {
        $mapContent = Get-Content $fileMapPath -Raw -ErrorAction Stop
        $newMapContent = $mapContent -replace "routes/users/userProfileRoutes", "routes/user/userProfileRoutes"
        Set-Content -Path $fileMapPath -Value $newMapContent -ErrorAction Stop
        "[$timestamp] Updated FileStructureMap.md" | Out-File -FilePath $logFile -Append
    } catch {
        "[$timestamp] Error updating FileStructureMap.md: $($_.Exception.Message)" | Out-File -FilePath $logFile -Append
    }
} else {
    "[$timestamp] Warning: FileStructureMap.md not found at $fileMapPath" | Out-File -FilePath $logFile -Append
}

# Step 3: Verify
"[$timestamp] Verifying userProfileRoutes.js at $userPath" | Out-File -FilePath $logFile -Append
$verify = Get-ChildItem -Path $userPath -Recurse -Include "*.js" -Exclude $excludedDirs | Where-Object { $_.Name -eq "userProfileRoutes.js" }
if ($verify) {
    "[$timestamp] Success: userProfileRoutes.js found at $userPath\userProfileRoutes.js" | Out-File -FilePath $logFile -Append
} else {
    "[$timestamp] Error: userProfileRoutes.js not found at $userPath" | Out-File -FilePath $logFile -Append
    throw "Verification failed"
}

# Step 4: Output results
"[$timestamp] Completed. Updated $($updatedFiles.Count) files." | Out-File -FilePath $logFile -Append
if ($updatedFiles) {
    "[$timestamp] Files updated:" | Out-File -FilePath $logFile -Append
    $updatedFiles | ForEach-Object { "[$timestamp] $_" | Out-File -FilePath $logFile -Append }
}

Write-Host "Fix completed. Check $logFile for details."