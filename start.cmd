@echo off
cd /d "%~dp0"
echo [1/2] Installing packages from the public npm registry...
set NPM_CONFIG_REGISTRY=https://registry.npmjs.org/
call npm install --registry=https://registry.npmjs.org/ --fetch-retries=5 --fetch-timeout=120000
if errorlevel 1 (
  echo.
  echo Package installation failed. Check the network and run start.cmd again.
  pause
  exit /b 1
)
echo [2/2] Starting the Genoray demo...
call npm run dev
pause
