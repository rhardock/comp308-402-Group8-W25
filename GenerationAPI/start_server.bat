@echo off
setlocal EnableDelayedExpansion
echo === GenerationAPI Server Setup ===
cd /d %~dp0

REM Check if Poetry is available
where poetry >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Poetry detected! You can use the following commands:
    echo.
    echo   poetry install    - Install dependencies
    echo   poetry run python app.py - Run the server
    echo.
    echo Would you like to use Poetry instead?
    set /p use_poetry=Enter your choice (Y/N): 
    if /i "!use_poetry!"=="Y" (
        poetry install
        poetry run python app.py
        exit /b 0
    )
)

REM Check if virtual environment exists
if not exist .venv (
    echo Creating virtual environment...
    python -m venv .venv
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to create virtual environment. Make sure Python is installed and in your PATH.
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo Activating virtual environment...
call .venv\Scripts\activate
if %ERRORLEVEL% NEQ 0 (
    echo Failed to activate virtual environment.
    pause
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install dependencies.
    pause
    exit /b 1
)

REM Run server
echo Starting server...
python app.py

REM Deactivate virtual environment on exit
call deactivate
endlocal
