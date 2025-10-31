-- Drop existing table if it exists
DROP TABLE IF EXISTS transactions CASCADE;

-- Create transactions table for token purchase and usage tracking
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'usage')),
    token_amount INTEGER NOT NULL,
    stripe_payment_intent_id TEXT,
    stripe_event_id TEXT UNIQUE,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,

    FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);

-- Create indexes for efficient querying
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_stripe_payment ON transactions(stripe_payment_intent_id);
CREATE INDEX idx_transactions_stripe_event ON transactions(stripe_event_id);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);

-- Create function for atomic token deduction (optional but recommended)
CREATE OR REPLACE FUNCTION deduct_token(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_tokens INTEGER;
BEGIN
    -- Get current token balance with row lock
    SELECT tokens INTO v_current_tokens
    FROM user_profiles
    WHERE id = p_user_id
    FOR UPDATE;

    -- Check if user has tokens
    IF v_current_tokens IS NULL OR v_current_tokens <= 0 THEN
        RETURN FALSE;
    END IF;

    -- Deduct one token
    UPDATE user_profiles
    SET tokens = tokens - 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_user_id;

    -- Record the usage transaction
    INSERT INTO transactions (user_id, transaction_type, token_amount, details)
    VALUES (p_user_id, 'usage', -1, jsonb_build_object('reason', 'agent_interaction'));

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;