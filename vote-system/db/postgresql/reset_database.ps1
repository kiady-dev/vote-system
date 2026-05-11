# Reset Database Script for Vote System
# Usage: .\reset_database.ps1

param(
    [string]$DbHost = "localhost",
    [int]$DbPort = 5432,
    [string]$DbName = "vote_system",
    [string]$DbUser = "postgres",
    [string]$DbPassword = "onlyK"
)

Write-Host "🔄 Resetting Vote System Database..." -ForegroundColor Cyan
Write-Host "Database: $DbName on $DbHost`:$DbPort" -ForegroundColor Gray
Write-Host ""

# Build connection string
$ConnectionString = "Server=$DbHost;Port=$DbPort;Database=$DbName;User Id=$DbUser;Password=$DbPassword;"

# Get the script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ResetScript = Join-Path $ScriptDir "reset_database.sql"

if (-not (Test-Path $ResetScript)) {
    Write-Host "❌ Error: reset_database.sql not found at $ResetScript" -ForegroundColor Red
    exit 1
}

try {
    # Create PostgreSQL connection and run script
    $psqlPath = (Get-Command psql.exe -ErrorAction SilentlyContinue).Source
    
    if (-not $psqlPath) {
        Write-Host "❌ Error: psql not found. Please install PostgreSQL or add it to PATH" -ForegroundColor Red
        exit 1
    }

    # Execute reset script via psql
    $env:PGPASSWORD = $DbPassword
    & $psqlPath -h $DbHost -p $DbPort -U $DbUser -d $DbName -f $ResetScript
    
    Write-Host ""
    Write-Host "✅ Database reset completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Restart the backend: mvn spring-boot:run"
    Write-Host "2. Open http://localhost:5173/vote"
    Write-Host "3. Login with test credentials and vote"
}
catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
finally {
    $env:PGPASSWORD = ""
}
