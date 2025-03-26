@echo off
setlocal EnableDelayedExpansion

cd /d %~dp0

REM Check if virtual environment exists
if not exist .venv (
    echo Creating virtual environment for app...
    python -m venv .venv
    if %ERROR LEVEL% NEQ 0 (
        echo Failed to create virtual environment. Make sure Python is installed and in your PATH.
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo Activating virtual environment, please be patient...
call .venv\Scripts\activate
if %ERROR LEVEL% NEQ 0 (
    echo Failed to activate virtual environment.
    pause
    exit /b 1
)

REM Install dependencies
echo Installing dependencies, this may take awhile...
pip install -r requirements.txt
if %ERROR LEVEL% NEQ 0 (
    echo Failed to install dependencies.
    pause
    exit /b 1
)

REM Run server
echo Starting server, happy coding...
python app.py

REM Deactivate virtual environment on exit
deactivate

pause