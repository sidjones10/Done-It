@echo off
REM Batch script to clean Expo cache on Windows
REM Run this if you encounter the node:sea error

echo Cleaning Expo cache...
echo.

if exist .expo (
    rmdir /s /q .expo
    echo .expo directory removed
) else (
    echo .expo directory not found (already clean)
)

if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo node_modules\.cache removed
)

echo.
echo Cache cleaned successfully!
echo You can now run: npm start
echo.
pause
