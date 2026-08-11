$piniaFile = Join-Path $PSScriptRoot '..\node_modules\@pinia\nuxt\node_modules\pinia\dist\pinia.mjs'
$piniaFile = Resolve-Path $piniaFile -ErrorAction SilentlyContinue

if (-not $piniaFile) {
    Write-Host "Pinia file not found, skipping patch."
    exit 0
}

$content = Get-Content $piniaFile -Raw

# Check if already patched
if ($content.Contains('Object.prototype.hasOwnProperty.call(obj, skipHydrateSymbol)')) {
    Write-Host "Pinia already patched, skipping."
    exit 0
}

# Apply patches
$content = $content -replace 'obj\.hasOwnProperty\(skipHydrateSymbol\)', 'Object.prototype.hasOwnProperty.call(obj, skipHydrateSymbol)'
$content = $content -replace 'target\.hasOwnProperty\(key\)', 'Object.prototype.hasOwnProperty.call(target, key)'
$content = $content -replace 'patchToApply\.hasOwnProperty\(key\)', 'Object.prototype.hasOwnProperty.call(patchToApply, key)'

Set-Content $piniaFile $content -NoNewline
Write-Host "Pinia patched successfully."
