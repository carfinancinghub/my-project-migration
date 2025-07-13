# Define parameters
$rootPath = "C:\CFH"
$logDir = "$rootPath\Cod1Logs"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "$logDir\FileStructure_$timestamp.log"

# Folder names to exclude anywhere in the path
$excludedFolderNames = @("node_modules", ".git", "bin", "obj", "dist", "build", "packages", "coverage")

# Absolute paths to exclude
$excludedFullPaths = @(
    "C:\CFH\logs",
    "C:\CFH\GenLogs",
    "C:\CFH\EvalLogs",
    "C:\CFH\Cod1PromptOutput",
    "C:\CFH\Cod1Logs"
)

# Ensure log directory exists
if (!(Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
}

# Function to check if file path should be excluded
function Is-ExcludedPath {
    param ([string]$filePath)

    $normalizedPath = $filePath.ToLower().Replace('/', '\')
    $parts = $normalizedPath.Split('\')

    foreach ($excludedName in $excludedFolderNames) {
        if ($parts -contains $excludedName.ToLower()) {
            return $true
        }
    }

    foreach ($excludedRoot in $excludedFullPaths) {
        $normalizedExcludedRoot = $excludedRoot.ToLower().TrimEnd('\')
        if ($normalizedPath.StartsWith($normalizedExcludedRoot)) {
            return $true
        }
    }

    return $false
}

# Collect files and apply exclusion filter
$files = Get-ChildItem -Path $rootPath -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { -not (Is-ExcludedPath $_.FullName) }

# Optional: show total file count
Write-Output "Total files after filtering: $($files.Count)"

# Exit if too many files (safety check)
if ($files.Count -gt 2000) {
    Write-Warning "Too many files found ($($files.Count)). Likely includes unwanted folders like node_modules."
    exit
}

# Prepare output lines
$outputLines = @()
$i = 1
foreach ($file in $files) {
    $line = "{0:D5}: {1} | {2} bytes | Created: {3} | Modified: {4}" -f `
        $i, $file.FullName, $file.Length, $file.CreationTime, $file.LastWriteTime
    $outputLines += $line
    $i++
}

# Write to log file
$outputLines | Set-Content -Path $logFile -Encoding UTF8

Write-Output "✅ File list saved to: $logFile"
