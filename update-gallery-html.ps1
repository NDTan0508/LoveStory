# PowerShell script to update gallery.html with images list
# Run with: powershell -ExecutionPolicy Bypass -File update-gallery-html.ps1

$imgDir = Join-Path $PSScriptRoot "assets\img"
$galleryFile = Join-Path $PSScriptRoot "gallery.html"
$jsonFile = Join-Path $imgDir "images.json"

# Supported image extensions
$imageExtensions = @('.jpg', '.jpeg', '.png', '.gif', '.webp', '.JPG', '.JPEG', '.PNG')

try {
    # First, generate/update images.json
    if (-not (Test-Path $imgDir)) {
        Write-Host "Creating assets/img directory..."
        New-Item -ItemType Directory -Path $imgDir -Force | Out-Null
        Write-Host "Directory created. Please add images and run this script again."
        exit 0
    }

    # Read all files in directory
    $files = Get-ChildItem -Path $imgDir -File
    
    # Filter only image files
    $imageFiles = $files | Where-Object { 
        $imageExtensions -contains $_.Extension 
    } | Sort-Object Name | ForEach-Object { $_.Name }

    # Update images.json
    $imageFiles | ConvertTo-Json | Set-Content -Path $jsonFile -Encoding UTF8
    Write-Host "Found $($imageFiles.Count) images"

    # Read gallery.html
    $html = Get-Content -Path $galleryFile -Raw -Encoding UTF8
    
    # Create JavaScript array string
    $quotedFiles = $imageFiles | ForEach-Object { "`"$_`"" }
    $jsArray = "[" + ($quotedFiles -join ", ") + "]"
    
    # Replace the script tag content - use simpler approach
    $commentLine = '        <!-- Images list will be injected here -->'
    $newContent = "        $jsArray"
    
    if ($html -match [regex]::Escape($commentLine)) {
        $html = $html -replace [regex]::Escape($commentLine), $newContent
    } else {
        # Try to replace entire script tag (multiline pattern)
        $scriptPattern = '(?s)<script type="application/json" id="images-data">.*?</script>'
        $newScript = "<script type=`"application/json`" id=`"images-data`">`n        $jsArray`n      </script>"
        if ($html -match $scriptPattern) {
            $html = $html -replace $scriptPattern, $newScript
        } else {
            Write-Host "Warning: Could not find images-data script tag. Adding it manually..." -ForegroundColor Yellow
            # If pattern not found, try to insert before closing script tag or before </body>
            if ($html -match '</body>') {
                $insertPoint = $html.IndexOf('</body>')
                $newScriptWithIndent = "`n      <script type=`"application/json`" id=`"images-data`">`n        $jsArray`n      </script>`n"
                $html = $html.Insert($insertPoint, $newScriptWithIndent)
            }
        }
    }
    
    # Write back to gallery.html
    Set-Content -Path $galleryFile -Value $html -Encoding UTF8 -NoNewline
    
    Write-Host "✅ Successfully updated gallery.html with $($imageFiles.Count) images!"
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

