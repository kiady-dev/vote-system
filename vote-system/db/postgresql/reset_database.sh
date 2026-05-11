#!/bin/bash
# Reset Database Script for Vote System
# Usage: ./reset_database.sh

set -e

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-vote_system}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-onlyK}"

echo "🔄 Resetting Vote System Database..."
echo "Database: $DB_NAME on $DB_HOST:$DB_PORT"
echo ""

# Export password to avoid prompt
export PGPASSWORD="$DB_PASSWORD"

# Run the reset script
psql \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  -f "$(dirname "$0")/reset_database.sql"

echo ""
echo "✅ Database reset completed successfully!"
echo ""
echo "Next steps:"
echo "1. Restart the backend: mvn spring-boot:run"
echo "2. Open http://localhost:5173/vote"
echo "3. Login with test credentials and vote"
