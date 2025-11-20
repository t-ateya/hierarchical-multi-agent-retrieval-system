name: "Stripe Payment Integration for Agent Tokens"
description: |

## Purpose
Implementation of Stripe-based payment integration for a token-based billing system in an AI agent application. Users will purchase tokens through Stripe, and the system will deduct tokens for each agent interaction.

## Core Principles
1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance
5. **Global rules**: Be sure to follow all rules in CLAUDE.md

---

## Goal
Build a complete Stripe payment integration system enabling users to purchase tokens for AI agent interactions, with comprehensive tracking and audit trails.

## Why
- **Business value**: Enable monetization of the AI agent platform through token-based billing
- **User impact**: Users can purchase tokens seamlessly and track their usage transparently
- **Integration**: Extends existing Supabase authentication with payment capabilities
- **Problems solved**: Currently no monetization system exists, preventing sustainable platform operation

## What
Users will purchase token packages (100/$5, 250/$10, 600/$20) through Stripe checkout. Each agent interaction deducts one token. System includes purchase flows, webhook handling, balance tracking, and usage history.

### Success Criteria
- [ ] Users can purchase tokens via Stripe payment flow
- [ ] Tokens are automatically credited after successful payment
- [ ] Agent API checks and deducts tokens before processing requests
- [ ] Users can view token balance and transaction history
- [ ] Webhook handling is idempotent and secure

## All Needed Context

For Archon use the "Stripe Payment Integration" project - ID: 05e88ca9-bb37-4dc2-85f9-4eb306ace5b7

### Documentation & References (list all context needed to implement the feature)
```yaml
- IMPORTANT: use the Archon MCP server for Supabase and Stripe documentation searching

# MUST READ - Include these in your context window
- url: https://docs.stripe.com/payments/payment-intents/quickstart
  why: Core Stripe payment intent creation and handling flow
  
- url: https://docs.stripe.com/webhooks/quickstart
  why: Webhook signature verification and event handling patterns
  
- file: /workspace/backend_agent_api/agent_api.py
  why: Lines 120-260 show authentication pattern and where to add token checking
  
- file: /workspace/backend_agent_api/db_utils.py 
  why: Lines 18-50 show Supabase interaction patterns for new token functions
  
- file: /workspace/sql/3-conversations_messages.sql
  why: Template for creating transactions table with proper foreign keys
  
- file: /workspace/sql/4-conversations_messages_rls.sql
  why: Template for RLS policies on transactions table
  
- doc: https://supabase.com/docs/guides/database/postgres/row-level-security
  section: Creating policies
  critical: Users must only see their own transactions
  
- file: /workspace/frontend/src/components/auth/AuthForm.tsx
  why: Pattern for form handling, loading states, error management
  
- file: /workspace/PRPs/planning/stripe-payment-integration.md
  why: Comprehensive codebase analysis with all integration points identified
```

### Current Codebase tree (run `tree` in the root of the project) to get an overview of the codebase
```bash
/workspace/
├── backend_agent_api/
│   ├── agent_api.py        # Main FastAPI server - add Stripe endpoints
│   ├── clients.py           # Client configurations - add Stripe client
│   ├── db_utils.py          # Database utilities - add token functions
│   └── .env.example         # Add Stripe environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/        # Reference for patterns
│   │   │   ├── chat/        # Integrate token display
│   │   │   └── profile/     # Add token components
│   │   └── hooks/           # Add useTokens hook
│   └── .env.example         # Add Stripe publishable key
└── sql/
    ├── 1-user_profiles_requests.sql  # Update with tokens column
    └── [other schema files]          # Templates for new tables
```

### Desired Codebase tree with files to be added and responsibility of file
```bash
/workspace/
├── backend_agent_api/
│   ├── agent_api.py        # MODIFY: Add Stripe endpoints, token checking
│   ├── clients.py          # MODIFY: Add Stripe client configuration
│   ├── db_utils.py         # MODIFY: Add token management functions
│   └── .env.example        # MODIFY: Add STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── purchase/
│   │   │   │   ├── PurchasePage.tsx      # NEW: Token purchase options
│   │   │   │   ├── PaymentSuccess.tsx    # NEW: Success redirect page
│   │   │   │   └── PaymentFailure.tsx    # NEW: Failure handling page
│   │   │   ├── profile/
│   │   │   │   ├── TokenBalance.tsx      # NEW: Balance display component
│   │   │   │   └── TokenHistory.tsx      # NEW: Transaction history table
│   │   │   └── chat/
│   │   │       └── ChatLayout.tsx        # MODIFY: Integrate token display
│   │   └── hooks/
│   │       └── useTokens.ts              # NEW: Token management hook
│   └── .env.example                       # MODIFY: Add VITE_STRIPE_PUBLISHABLE_KEY
└── sql/
    ├── 1-user_profiles_requests.sql      # MODIFY: Add tokens column
    ├── 10-transactions-table.sql         # NEW: Create transactions table
    ├── 11-transactions-rls.sql           # NEW: Add RLS policies
    └── 12-token-migration.sql            # NEW: Migration for existing users
```

### Known Gotchas of our codebase & Library Quirks
```python
# CRITICAL: Supabase service key needed for backend, anon key for frontend
# Example: Backend uses SUPABASE_SERVICE_KEY, frontend uses VITE_SUPABASE_ANON_KEY

# CRITICAL: Stripe webhooks require raw body for signature verification
# Example: FastAPI needs Request object, not parsed JSON for webhook endpoint

# CRITICAL: Token check must happen AFTER auth but BEFORE rate limit deduction
# Example: Line 201 in agent_api.py checks rate limit - add token check at line 202

# CRITICAL: Supabase RLS policies require auth.uid() for user isolation
# Example: All policies use (auth.uid() = user_id) pattern

# CRITICAL: Frontend uses Vite env vars starting with VITE_
# Example: VITE_STRIPE_PUBLISHABLE_KEY not STRIPE_PUBLISHABLE_KEY

# CRITICAL: Use pydantic v2 validators and Field definitions
# Example: from pydantic import BaseModel, Field, field_validator
```

## Implementation Blueprint

### Data models and structure

Create the core data models, we ensure type safety and consistency.
```python
# Backend Pydantic models (agent_api.py)
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

class PaymentIntentRequest(BaseModel):
    token_package: Literal["basic", "standard", "premium"]  # 100, 250, 600 tokens
    
class PaymentIntentResponse(BaseModel):
    client_secret: str
    payment_intent_id: str

class TokenBalance(BaseModel):
    user_id: str
    balance: int = Field(ge=0)
    last_updated: datetime

class Transaction(BaseModel):
    id: str
    user_id: str
    transaction_type: Literal["purchase", "usage"]
    token_amount: int
    stripe_payment_intent_id: Optional[str] = None
    details: dict
    created_at: datetime
```

### list of tasks to be completed to fullfill the PRP in the order they should be completed

```yaml
Task 1 - Database Schema Updates:
MODIFY sql/1-user_profiles_requests.sql:
  - FIND pattern: "CREATE TABLE user_profiles"
  - ADD column: "tokens INTEGER DEFAULT 0 CHECK (tokens >= 0)"
  - PRESERVE existing columns and constraints

CREATE sql/10-transactions-table.sql:
  - MIRROR pattern from: sql/3-conversations_messages.sql
  - CREATE TABLE transactions with columns:
    - id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    - user_id UUID REFERENCES user_profiles(id)
    - transaction_type TEXT CHECK (transaction_type IN ('purchase', 'usage'))
    - token_amount INTEGER NOT NULL
    - stripe_payment_intent_id TEXT
    - stripe_event_id TEXT UNIQUE (for idempotency)
    - details JSONB
    - created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  - ADD indexes on user_id, stripe_payment_intent_id, stripe_event_id

CREATE sql/11-transactions-rls.sql:
  - MIRROR pattern from: sql/4-conversations_messages_rls.sql
  - POLICY: Users can only SELECT their own transactions
  - POLICY: Service role can INSERT/UPDATE transactions

CREATE sql/12-token-migration.sql:
  - Migration script for existing users
  - SET initial token balance to 10 for testing

Task 2 - Backend Stripe Client Setup:
MODIFY backend_agent_api/clients.py:
  - FIND pattern: "def get_agent_clients"
  - ADD Stripe initialization after line with other client setups:
    import stripe
    stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
  - FOLLOW pattern of existing client configurations

MODIFY backend_agent_api/.env.example:
  - ADD at end of file:
    # Stripe Configuration
    STRIPE_SECRET_KEY=sk_test_...
    STRIPE_WEBHOOK_SECRET=whsec_...

Task 3 - Backend Token Management Functions:
MODIFY backend_agent_api/db_utils.py:
  - ADD after existing database functions (around line 250):
    
    async def check_user_token_balance(supabase: Client, user_id: str) -> int:
        """Check user's current token balance"""
        # PATTERN: Follow fetch_conversation_history error handling
        
    async def deduct_user_token(supabase: Client, user_id: str) -> bool:
        """Deduct one token from user, return success status"""
        # Use atomic UPDATE with CHECK constraint
        
    async def add_user_tokens(supabase: Client, user_id: str, amount: int, payment_intent_id: str, event_id: str) -> bool:
        """Add tokens after successful payment"""
        # Check idempotency with event_id first
        # Use database transaction for atomicity
        
    async def create_transaction_record(supabase: Client, transaction_data: dict) -> dict:
        """Create audit trail record"""
        # PATTERN: Follow store_message structure

Task 4 - Backend Stripe Endpoints:
MODIFY backend_agent_api/agent_api.py:
  - ADD after line 100 (after middleware setup):
    import stripe
    from fastapi import Request
    import hmac
    import hashlib
    
  - ADD new endpoints after existing endpoints (around line 500):
    
    @app.post("/api/create-payment-intent")
    async def create_payment_intent(
        request: PaymentIntentRequest,
        user: Dict[str, Any] = Depends(verify_token)
    ):
        # Map package to amount: basic=500, standard=1000, premium=2000 (cents)
        # Create Stripe PaymentIntent with metadata
        
    @app.post("/api/webhook/stripe")
    async def stripe_webhook(request: Request):
        # Get raw body for signature verification
        # Verify webhook signature with STRIPE_WEBHOOK_SECRET
        # Handle payment_intent.succeeded event
        # Add tokens using add_user_tokens (idempotent)
        # Return 200 to acknowledge

Task 5 - Backend Token Checking in Agent Endpoint:
MODIFY backend_agent_api/agent_api.py:
  - FIND line 201: "rate_limit_ok = await check_rate_limit"
  - INSERT after rate limit check (line 207):
    # Check token balance
    token_balance = await check_user_token_balance(supabase, request.user_id)
    if token_balance <= 0:
        return StreamingResponse(
            stream_error_response("Insufficient tokens. Please purchase more tokens to continue.", request.session_id),
            media_type='text/plain'
        )
    
    # Deduct token for this request
    token_deducted = await deduct_user_token(supabase, request.user_id)
    if not token_deducted:
        return StreamingResponse(
            stream_error_response("Failed to process token payment. Please try again.", request.session_id),
            media_type='text/plain'
        )

Task 6 - Frontend Token Hook:
CREATE frontend/src/hooks/useTokens.ts:
  - PATTERN from: frontend/src/hooks/useAuth.tsx (if exists) or similar hooks
  - Import Supabase client
  - Fetch token balance from user_profiles
  - Fetch transactions from transactions table
  - Real-time subscription to balance changes
  - Export functions: {balance, transactions, loading, error, refetch}

Task 7 - Frontend Purchase Components:
CREATE frontend/src/components/purchase/PurchasePage.tsx:
  - Import Stripe Elements
  - Three card options: 100 tokens/$5, 250/$10, 600/$20
  - Call /api/create-payment-intent on selection
  - Use Stripe confirmPayment with return_url
  - PATTERN: Follow AuthForm.tsx for form handling

CREATE frontend/src/components/purchase/PaymentSuccess.tsx:
  - Parse payment_intent from URL params
  - Display success message
  - Show updated token balance using useTokens hook
  - Button to return to chat

CREATE frontend/src/components/purchase/PaymentFailure.tsx:
  - Parse error from URL params
  - Display failure message
  - Retry payment button
  - Contact support option

Task 8 - Frontend Token Display Components:
CREATE frontend/src/components/profile/TokenBalance.tsx:
  - Use useTokens hook for balance
  - Display as "Tokens: {balance}"
  - Purchase button linking to /purchase
  - PATTERN: Simple, clean component

CREATE frontend/src/components/profile/TokenHistory.tsx:
  - Use useTokens hook for transactions
  - Table with columns: Date, Type, Amount, Details
  - Pagination if > 10 records
  - PATTERN: Follow existing table components

Task 9 - Frontend Chat Integration:
MODIFY frontend/src/components/chat/ChatLayout.tsx:
  - FIND: Main chat container or header
  - ADD: Import and render TokenBalance component
  - ADD: Error handling for "Insufficient tokens" message
  - Show purchase link when tokens depleted

Task 10 - Frontend Environment Configuration:
MODIFY frontend/.env.example:
  - ADD at end:
    # Stripe Configuration
    VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

Task 11 - Documentation:
CREATE PRPs/planning/stripe-setup.md:
  - List all environment variables needed
  - Stripe Dashboard webhook setup instructions
  - Test card numbers for development
  - Deployment checklist
```


### Per task pseudocode as needed added to each task
```python

# Task 3 - Token Management Functions Detail
async def check_user_token_balance(supabase: Client, user_id: str) -> int:
    """Check user's current token balance"""
    try:
        response = supabase.table("user_profiles") \
            .select("tokens") \
            .eq("id", user_id) \
            .single() \
            .execute()
        return response.data.get("tokens", 0) if response.data else 0
    except Exception as e:
        print(f"Error checking token balance: {e}")
        return 0

async def deduct_user_token(supabase: Client, user_id: str) -> bool:
    """Atomically deduct one token if balance > 0"""
    try:
        # Use RPC for atomic operation
        response = supabase.rpc("deduct_token", {"p_user_id": user_id}).execute()
        return response.data if response.data is not None else False
    except:
        # Fallback to UPDATE with current balance check
        current = await check_user_token_balance(supabase, user_id)
        if current > 0:
            response = supabase.table("user_profiles") \
                .update({"tokens": current - 1}) \
                .eq("id", user_id) \
                .eq("tokens", current) \
                .execute()
            return len(response.data) > 0 if response.data else False
        return False

# Task 4 - Stripe Webhook Handler Detail
@app.post("/api/webhook/stripe")
async def stripe_webhook(request: Request):
    # CRITICAL: Need raw body for signature
    payload = await request.body()
    sig_header = request.headers.get('Stripe-Signature')
    
    try:
        # Verify webhook signature
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.getenv('STRIPE_WEBHOOK_SECRET')
        )
    except ValueError:
        return {"error": "Invalid payload"}, 400
    except stripe.error.SignatureVerificationError:
        return {"error": "Invalid signature"}, 400
    
    # Handle payment success
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        user_id = payment_intent['metadata']['user_id']
        token_amount = int(payment_intent['metadata']['token_amount'])
        
        # Idempotent token addition
        success = await add_user_tokens(
            supabase, 
            user_id, 
            token_amount,
            payment_intent['id'],
            event['id']  # Use event ID for idempotency
        )
        
        if success:
            # Create transaction record
            await create_transaction_record(supabase, {
                "user_id": user_id,
                "transaction_type": "purchase",
                "token_amount": token_amount,
                "stripe_payment_intent_id": payment_intent['id'],
                "stripe_event_id": event['id'],
                "details": {"amount_paid": payment_intent['amount']}
            })
    
    return {"received": True}

# Task 6 - Frontend useTokens Hook Structure
export function useTokens() {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const supabase = useSupabaseClient();
    
    useEffect(() => {
        // Fetch initial balance
        fetchBalance();
        
        // Subscribe to balance changes
        const subscription = supabase
            .channel('token_updates')
            .on('postgres_changes', 
                { event: 'UPDATE', schema: 'public', table: 'user_profiles' },
                (payload) => {
                    if (payload.new.id === currentUserId) {
                        setBalance(payload.new.tokens);
                    }
                }
            )
            .subscribe();
        
        return () => subscription.unsubscribe();
    }, []);
    
    const purchaseTokens = async (package) => {
        // Call API to create payment intent
        const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token_package: package })
        });
        return response.json();
    };
    
    return { balance, transactions, loading, purchaseTokens, refetch: fetchBalance };
}
```

### Integration Points
```yaml
DATABASE:
  - migration: "ALTER TABLE user_profiles ADD COLUMN tokens INTEGER DEFAULT 0"
  - table: "CREATE TABLE transactions with proper foreign keys and indexes"
  - rpc: "CREATE FUNCTION deduct_token for atomic operations (optional)"
  
CONFIG:
  - add to: backend_agent_api/.env
  - pattern: "STRIPE_SECRET_KEY=sk_test_..."
  - pattern: "STRIPE_WEBHOOK_SECRET=whsec_..."
  
  - add to: frontend/.env  
  - pattern: "VITE_STRIPE_PUBLISHABLE_KEY=pk_test_..."
  
ROUTES:
  - add to: backend_agent_api/agent_api.py
  - pattern: "@app.post('/api/create-payment-intent')"
  - pattern: "@app.post('/api/webhook/stripe')"
  
FRONTEND_ROUTES:
  - add to: frontend routing config
  - pattern: "/purchase -> PurchasePage"
  - pattern: "/payment/success -> PaymentSuccess"  
  - pattern: "/payment/failure -> PaymentFailure"
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Backend - Run these FIRST - fix any errors before proceeding
cd backend_agent_api
ruff check . --fix           # Auto-fix style issues
mypy agent_api.py            # Type checking

# Frontend
cd frontend
npm run lint                 # ESLint check
npm run build               # TypeScript compilation

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Unit Tests each new feature/file/function use existing test patterns
```python
# CREATE backend_agent_api/tests/test_stripe_integration.py:
import pytest
from unittest.mock import patch, MagicMock

def test_check_user_token_balance():
    """Test token balance checking"""
    mock_supabase = MagicMock()
    mock_supabase.table().select().eq().single().execute.return_value.data = {"tokens": 10}
    
    balance = await check_user_token_balance(mock_supabase, "user_123")
    assert balance == 10

def test_deduct_token_success():
    """Test successful token deduction"""
    mock_supabase = MagicMock()
    # Mock successful deduction
    result = await deduct_user_token(mock_supabase, "user_123")
    assert result == True

def test_deduct_token_insufficient():
    """Test deduction with zero balance"""
    mock_supabase = MagicMock()
    # Mock zero balance scenario
    result = await deduct_user_token(mock_supabase, "user_123")
    assert result == False

def test_webhook_signature_verification():
    """Test Stripe webhook signature verification"""
    # Test with invalid signature
    with pytest.raises(stripe.error.SignatureVerificationError):
        stripe.Webhook.construct_event(payload, bad_sig, secret)

def test_payment_intent_creation():
    """Test payment intent endpoint"""
    with patch('stripe.PaymentIntent.create') as mock_create:
        mock_create.return_value = {"client_secret": "pi_secret", "id": "pi_123"}
        response = client.post("/api/create-payment-intent", 
                              json={"token_package": "basic"},
                              headers={"Authorization": "Bearer token"})
        assert response.status_code == 200
        assert "client_secret" in response.json()
```

```bash
# Run backend tests
cd backend_agent_api
pytest tests/test_stripe_integration.py -v

# Run frontend tests  
cd frontend
npm test
```

## Final validation Checklist
- [ ] Backend tests pass: `cd backend_agent_api && pytest tests/ -v`
- [ ] Frontend builds without errors: `cd frontend && npm run build`
- [ ] No linting errors: `ruff check backend_agent_api/` and `npm run lint`
- [ ] Payment flow works end-to-end with test card
- [ ] Webhook processes payments and credits tokens
- [ ] Token deduction works on agent requests
- [ ] Insufficient token error displays properly
- [ ] Token balance updates in real-time
- [ ] Transaction history displays correctly
- [ ] RLS policies prevent cross-user data access
- [ ] Idempotency prevents duplicate token grants
- [ ] All environment variables documented in .env.example files

---

## Anti-Patterns to Avoid
- ❌ Don't hardcode Stripe keys - use environment variables
- ❌ Don't skip webhook signature verification - security critical
- ❌ Don't process webhooks without idempotency checks - causes duplicate tokens
- ❌ Don't mix service keys and anon keys - backend vs frontend 
- ❌ Don't forget atomic operations for token deduction - prevents race conditions
- ❌ Don't create new database patterns - follow existing conventions
- ❌ Don't skip error handling - provide clear user feedback
- ❌ Don't forget to update .env.example files - deployment will fail