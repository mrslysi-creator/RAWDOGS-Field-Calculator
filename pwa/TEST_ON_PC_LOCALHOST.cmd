@echo off
cd /d "%~dp0"
where py >nul 2>&1 && (start "" http://localhost:8765/ & py -m http.server 8765 & exit /b)
where python >nul 2>&1 && (start "" http://localhost:8765/ & python -m http.server 8765 & exit /b)
echo Python was not found. You can still open index.html for layout/calculator testing.
pause
