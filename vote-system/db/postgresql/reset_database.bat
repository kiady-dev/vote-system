@echo off
setlocal EnableExtensions EnableDelayedExpansion

rem Reset Database Script for Vote System
rem Usage: reset_database.bat

if not defined DB_HOST set "DB_HOST=localhost"
if not defined DB_PORT set "DB_PORT=5432"
if not defined DB_NAME set "DB_NAME=vote_system"
if not defined DB_USER set "DB_USER=postgres"
if not defined DB_PASSWORD set "DB_PASSWORD=onlyK"

set "SCRIPT_DIR=%~dp0"
set "RESET_SQL=%SCRIPT_DIR%reset_database.sql"
set "PSQL_CMD=psql.exe"

if not exist "%RESET_SQL%" (
    echo Error: reset_database.sql not found at "%RESET_SQL%"
    exit /b 1
)

echo Resetting Vote System Database...
echo Database: %DB_NAME% on %DB_HOST%:%DB_PORT%
echo.

where %PSQL_CMD% >nul 2>&1
if errorlevel 1 (
    set "PSQL_CMD="
    for %%P in ("%ProgramFiles%\PostgreSQL" "%ProgramFiles(x86)%\PostgreSQL") do (
        if exist "%%~P" (
            for /d %%D in ("%%~P\*") do (
                if exist "%%~D\bin\psql.exe" set "PSQL_CMD=%%~D\bin\psql.exe"
            )
        )
    )
)

if not defined PSQL_CMD (
    echo Error: psql.exe not found. Install PostgreSQL or add psql to PATH.
    exit /b 1
)

set "PGPASSWORD=%DB_PASSWORD%"
"%PSQL_CMD%" -h "%DB_HOST%" -p "%DB_PORT%" -U "%DB_USER%" -d "%DB_NAME%" -f "%RESET_SQL%"
set "EXIT_CODE=%ERRORLEVEL%"
set "PGPASSWORD="

if not "%EXIT_CODE%"=="0" (
    echo.
    echo Error: database reset failed with exit code %EXIT_CODE%.
    exit /b %EXIT_CODE%
)

echo.
echo Database reset completed successfully!
echo.
echo Next steps:
echo 1. Restart the backend: mvn spring-boot:run
echo 2. Open http://localhost:5173/vote
echo 3. Login with test credentials and vote

endlocal
exit /b 0
