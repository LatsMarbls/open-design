@echo off
title Open Design
set ROOT=%~dp0
set DAEMON_DIR=%ROOT%apps\daemon
set DAEMON_CLI=%DAEMON_DIR%\dist\cli.js
set PORT=7456

echo === Open Design ===
echo.

node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found in PATH
    pause
    exit /b 1
)

if not exist "%DAEMON_CLI%" (
    echo Building daemon...
    cd /d "%ROOT%"
    call pnpm --filter @open-design/daemon build
    if errorlevel 1 (
        echo FAILED: daemon build
        pause
        exit /b 1
    )
)

:: Kill old instances
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT%"') do (
    if not "%%a"=="0" taskkill /F /PID %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul

echo Starting daemon on port %PORT%...
cd /d "%DAEMON_DIR%"
type NUL | node "%DAEMON_CLI%" --port %PORT% --no-open

if errorlevel 1 (
    echo Daemon exited with error code %errorlevel%
    pause
)
