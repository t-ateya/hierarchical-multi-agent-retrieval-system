-- Migration script to add initial tokens to existing users
-- This script is safe to run multiple times (idempotent)

-- Give all existing users 10 test tokens if they have 0 tokens
UPDATE user_profiles
SET tokens = 10,
    updated_at = CURRENT_TIMESTAMP
WHERE tokens = 0 OR tokens IS NULL;

-- Create initial token grant transaction records for tracking
INSERT INTO transactions (user_id, transaction_type, token_amount, details)
SELECT
    id as user_id,
    'purchase' as transaction_type,
    10 as token_amount,
    jsonb_build_object(
        'reason', 'initial_test_grant',
        'note', 'Test tokens for development'
    ) as details
FROM user_profiles
WHERE NOT EXISTS (
    -- Only create if no initial grant exists
    SELECT 1 FROM transactions t
    WHERE t.user_id = user_profiles.id
    AND t.details->>'reason' = 'initial_test_grant'
);

-- Verify migration results
DO $$
DECLARE
    v_users_with_tokens INTEGER;
    v_total_users INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_total_users FROM user_profiles;
    SELECT COUNT(*) INTO v_users_with_tokens FROM user_profiles WHERE tokens > 0;

    RAISE NOTICE 'Migration complete: % of % users have tokens', v_users_with_tokens, v_total_users;
END $$;