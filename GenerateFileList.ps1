function Generate-FileListMarkdown {
    param (
        [Parameter(Mandatory=$true)] [string] $BasePath,
        [Parameter()] [string] $Title = "File List"
    )

    Write-Host "Scanning files in $BasePath ..."
    $files = Get-ChildItem -Path $BasePath -Recurse -File -ErrorAction SilentlyContinue
    Write-Host "Found $($files.Count) files."

    $grouped = $files | Group-Object Extension | Sort-Object Name

    $section = @()
    $section += "# $Title"
    $section += ""

    foreach ($group in $grouped) {
        $ext = if ($group.Name) { ".$($group.Name.TrimStart('.'))" } else { "(no extension)" }
        $section += "## Extension: $ext"
        $section += ('*Count*: {0}' -f $group.Count)
        $section += ""

        foreach ($file in $group.Group | Sort-Object FullName) {
            $relativePath = $file.FullName.Substring($BasePath.Length).TrimStart('\')
            $section += "- `$relativePath`"
        }
        $section += ""
    }

    $section += ('*Total files*: {0}' -f $files.Count)
    $section += "---"
    $section += ""

    return $section -join "`n"
}
