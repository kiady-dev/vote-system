-- Reset Database Script for Vote System
-- This script resets the database to an initial state:
-- 1. Clears all votes
-- 2. Resets all electors to not voted
-- 3. Clears audit logs
-- 4. Sets election status to CLOSED

BEGIN;

-- Clear votes
DELETE FROM votes;

-- Reset electors
UPDATE electors 
SET 
  has_voted = false,
  voted_at = NULL,
  voting_channel = NULL;

-- Clear audit logs
DELETE FROM audit_logs;

-- Reset election status to CLOSED
UPDATE elections 
SET status = 'CLOSED'
WHERE code = 'election-president-tresorier-2026';

-- Verify the state
SELECT 
  'Elections' as table_name,
  COUNT(*) as count,
  MAX(status) as status
FROM elections
UNION ALL
SELECT 
  'Electors',
  COUNT(*),
  COUNT(CASE WHEN has_voted THEN 1 END)::text
FROM electors
UNION ALL
SELECT 
  'Votes',
  COUNT(*),
  NULL
FROM votes
UNION ALL
SELECT 
  'Audit Logs',
  COUNT(*),
  NULL
FROM audit_logs;

COMMIT;

-- Print summary
\echo 'Database reset completed!'
\echo 'Election status: CLOSED'
\echo 'All votes cleared'
\echo 'All electors reset to not voted'
\echo 'Audit logs cleared'
