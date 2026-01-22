# PowerShell script to clean Expo cache on Windows
# Run this if you encounter the node:sea error

Write-Host "Cleaning Expo cache..." -ForegroundColor Yellow

# Remove .expo directory
if (Test-Path ".expo") {
    Remove-Item -Recurse -Force .expo
    Write-Host ".expo directory removed" -ForegroundColor Green
} else {
    Write-Host ".expo directory not found (already clean)" -ForegroundColor Cyan
}

# Remove node_modules/.cache if it exists
if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force node_modules\.cache
    Write-Host "node_modules\.cache removed" -ForegroundColor Green
}

Write-Host ""
Write-Host "Cache cleaned successfully!" -ForegroundColor Green
Write-Host "You can now run: npm start" -ForegroundColor Cyan
