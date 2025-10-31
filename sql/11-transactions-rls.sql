-- Enable Row Level Security on transactions table
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view their own transactions"
ON transactions
FOR SELECT
USING (auth.uid() = user_id);

-- Service role can insert transactions (for webhook handling)
CREATE POLICY "Service role can insert transactions"
ON transactions
FOR INSERT
WITH CHECK (true);

-- Service role can update transactions (for webhook handling)
CREATE POLICY "Service role can update transactions"
ON transactions
FOR UPDATE
USING (true);

-- Admins can view all transactions
CREATE POLICY "Admins can view all transactions"
ON transactions
FOR SELECT
USING (is_admin());

-- Admins can insert transactions
CREATE POLICY "Admins can insert transactions"
ON transactions
FOR INSERT
WITH CHECK (is_admin());

-- Admins can update transactions
CREATE POLICY "Admins can update transactions"
ON transactions
FOR UPDATE
USING (is_admin());

-- Prevent deletion of transactions (audit trail)
CREATE POLICY "Deny delete for transactions"
ON transactions
FOR DELETE
USING (false);