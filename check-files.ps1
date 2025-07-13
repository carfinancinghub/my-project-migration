$files = @(
    @{ Name = "PartsOrderService.test.ts"; Path = "C:\CFH\backend\tests\services\ai\PartsOrderService.test.ts" },
    @{ Name = "aiJobPredictorService.test.ts"; Path = "C:\CFH\backend\tests\services\ai\aiJobPredictorService.test.ts" },
    @{ Name = "partsOrderingService.ts"; Path = "C:\CFH\backend\services\ai\partsOrderingService.ts" },
    @{ Name = "aiBodyShopMatchingService.test.ts"; Path = "C:\CFH\backend\services\ai\aiBodyShopMatchingService.test.ts" },
    @{ Name = "AIDamageSummary.test.tsx"; Path = "C:\CFH\frontend\tests\components\body-shop\AIDamageSummary.test.tsx" },
    @{ Name = "AIDamageSummary.tsx"; Path = "C:\CFH\frontend\src\components\body-shop\AIDamageSummary.tsx" }
)

Write-Output "({[]}) start"
Write-Output ""
Write-Output "Agasi, please confirm the saves of the following files:"

foreach ($file in $files) {
    if (Test-Path $file.Path) {
        $info = Get-Item $file.Path
        $content = Get-Content $file.Path -Raw

        $artifactId = if ($content -match 'Artifact ID:\s*([a-zA-Z0-9\-]+)') { $matches[1] } else { "[Not found]" }
        $versionId  = if ($content -match 'Version ID:\s*([a-zA-Z0-9\-\.]+)') { $matches[1] } else { "[Not found]" }

        $timestamp = $info.LastWriteTime.ToString("yyyy-MM-dd hh:mm tt") + " PDT"

        Write-Output "- `$($file.Name)` generated on $timestamp at `$($file.Path)` (artifact_id: `"$artifactId`", version_id: `"$versionId`")"
    } else {
        Write-Output "- `$($file.Name)` is missing at path: `$($file.Path)`"
    }
}

Write-Output "({[]}) end"
