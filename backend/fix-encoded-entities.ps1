$root = "C:\CFH\backend"
$ts = Get-Date -Format 'yyyyMMdd_HHmmss'
$log = "C:\CFH\Cod1Logs\entity_fix_$ts.log"

New-Item -ItemType Directory -Path "C:\CFH\Cod1Logs" -Force | Out-Null

"[{0}] Starting HTML entity cleanup in $root" -f ([DateTime]::UtcNow.ToString('o')) | Out-File -FilePath $log -Append

# Define replacements
$entities = @{
    '&#x3C;' = '<'
    '&#x3E;' = '>'
    '&lt;'   = '<'
    '&gt;'   = '>'
    '&amp;'  = '&'
}

# Traverse and fix
Get-ChildItem -Path $root -Recurse -Include *.ts, *.tsx -File | ForEach-Object {
    $file = $_.FullName
    $original = Get-Content -Path $file -Raw
    $fixed = $original

    foreach ($entity in $entities.Keys) {
        $fixed = $fixed -replace [Regex]::Escape($entity), $entities[$entity]
    }

    if ($original -ne $fixed) {
        $backup = "$file.bak_$ts"
        Copy-Item -Path $file -Destination $backup
        Set-Content -Path $file -Value $fixed
        "[{0}] FIXED: $file (backup -> $backup)" -f ([DateTime]::UtcNow.ToString('o')) | Out-File -FilePath $log -Append
    } else {
        "[{0}] OK: $file (no changes)" -f ([DateTime]::UtcNow.ToString('o')) | Out-File -FilePath $log -Append
    }
}

"[{0}] Cleanup complete. Log saved to $log" -f ([DateTime]::UtcNow.ToString('o')) | Out-File -FilePath $log -Append
Write-Host "Cleanup complete. See log: $log"
