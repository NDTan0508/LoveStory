# PowerShell script to generate images.json from assets/img folder
# Run with: powershell -ExecutionPolicy Bypass -File generate-images-list.ps1

$imgDir = Join-Path $PSScriptRoot "assets\img"
$outputFile = Join-Path $imgDir "images.json"

# Supported image extensions
$imageExtensions = @('.jpg', '.jpeg', '.png', '.gif', '.webp', '.JPG', '.JPEG', '.PNG')

try {
    # Check if directory exists
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

    if ($imageFiles.Count -eq 0) {
        Write-Host "No images found in assets/img folder."
        # Create empty JSON array
        @() | ConvertTo-Json | Set-Content -Path $outputFile -Encoding UTF8
        Write-Host "Created empty images.json file."
    } else {
        # Write JSON file with image list
        $imageFiles | ConvertTo-Json | Set-Content -Path $outputFile -Encoding UTF8
        Write-Host "Found $($imageFiles.Count) images:"
        for ($i = 0; $i -lt $imageFiles.Count; $i++) {
            Write-Host "  $($i + 1). $($imageFiles[$i])"
        }
        Write-Host ""
        Write-Host "✅ Successfully created images.json with $($imageFiles.Count) images!"
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

