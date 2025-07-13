# (c) 2025 CFH, All Rights Reserved
# Purpose: Scan and validate Jest aliases for the CFH Automotive Ecosystem
# Author: CFH Dev Team
# Date: 2025-06-24T22:00:00.000Z
# Version: 1.0.0
# Crown Certified: Yes
# Batch ID: Tools-062325
# Save Location: C:\CFH\backend\jest-alias-scan.ps1

$ts = Get-Date -Format 'yyyyMMdd_HHmmss'
$logDir = 'C:\CFH\Cod1Logs'
New-Item -ItemType Directory -Path $logDir -Force | Out-Null
$logFile = "$logDir\jest_alias_scan_$ts.log"

function Scan-Aliases {
    param (
        [string]$projectDir = 'C:\CFH\backend'
    )
    $aliasIssues = @()
    $tsConfig = Get-Content -Path (Join-Path $projectDir "tsconfig.json") -Raw | ConvertFrom-Json
    $paths = $tsConfig.compilerOptions.paths
    $files = Get-ChildItem -Path $projectDir -Recurse -Include *.ts,*.js,*.mjs | Where-Object { $_.FullName -notmatch 'node_modules' }
    foreach ($file in $files) {
        $lines = Get-Content -Path $file.FullName
        for ($i = 0; $i -lt $lines.Length; $i++) {
            foreach ($aliasPatternKey in $paths.PSObject.Properties.Name) {
                $regexAliasPattern = $aliasPatternKey -replace '\*', '(.+)'
                if ($lines[$i] -match "^\\s*(import|require).*['"]$regexAliasPattern['"]") {
                    $matchedDynamicPart = $Matches[1]
                    $physicalPathPattern = $paths.$aliasPatternKey[0]
                    $resolvedRelativePath = $physicalPathPattern -replace '\*', $matchedDynamicPart
                    $fullPath = Join-Path $projectDir $resolvedRelativePath
                    if (-not (Test-Path $fullPath) -and -not (Test-Path "$fullPath.ts") -and -not (Test-Path "$fullPath.js") -and -not (Test-Path "$fullPath.mjs")) {
                        $aliasIssues += "File: $($file.FullName), Line: $($i + 1), Alias: $aliasPatternKey, Resolved: $fullPath - NOT FOUND"
                    }
                }
            }
        }
    }
    if ($aliasIssues.Count -gt 0) {
        $aliasIssues | Out-File -FilePath $logFile -Append -Encoding UTF8
        Write-Host "Alias issues found. Check $logFile for details."
    } else {
        "[2025-06-25T06:23:42.4228184Z] No alias issues found" | Out-File -FilePath $logFile -Append -Encoding UTF8
        Write-Host "No alias issues found."
    }
}

"[2025-06-25T06:23:42.4228184Z] Starting Jest alias scan" | Out-File -FilePath $logFile -Append -Encoding UTF8
Scan-Aliases
"[2025-06-25T06:23:42.4228184Z] Completed Jest alias scan" | Out-File -FilePath $logFile -Append -Encoding UTF8
