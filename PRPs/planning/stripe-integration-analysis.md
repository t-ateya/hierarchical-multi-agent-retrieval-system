# Stripe Payment Integration - Codebase Architecture Analysis

## Project Overview

This document provides a comprehensive analysis of the current codebase structure to guide the implementation of Stripe payment integration for token purchases in the AI Chat application.

## Executive Summary

The application follows a clean three-tier architecture with:
- **Backend Agent API**: FastAPI with Pydantic AI agents, JWT authentication via Supabase
- **Frontend**: React 18 + TypeScript + Shadcn UI with Supabase auth integration
- **Database**: PostgreSQL with Supabase (pgvector), comprehensive RLS policies

Key integration points identified:
- Payment frontend components can extend existing settings modal pattern
- Backend can leverage current FastAPI structure with new payment endpoints
- Database schema needs new tables for tokens, purchases, subscription plans
- Current user authentication system ready for subscription management

---

## 1. Backend Architecture Analysis

### 1.1 API Structure (`C:\Users\colem\dynamous-community\ai-coding-workshop\backend_agent_api\`)

**Main Entry Point**: `agent_api.py`
- **Port**: 8001
- **Framework**: FastAPI with async/await patterns
- **Authentication**: JWT token verification via Supabase auth API
- **Middleware**: CORS enabled for all origins
- **Health Checks**: `/health` endpoint with service dependency validation

**Key Authentication Pattern**:
```python
async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> Dict[str, Any]:
    # Validates JWT tokens via Supabase auth API
    # Returns user data for request context
```

**Request/Response Patterns**:
- Pydantic models for request validation (`AgentRequest`, `FileAttachment`)
- Streaming responses for real-time chat (`StreamingResponse`)
- Error handling with structured JSON responses
- Request tracking and rate limiting built-in

### 1.2 Database Integration (`db_utils.py`)

**Current Supabase Integration**:
- Direct table operations using Supabase client
- RLS policy enforcement at database level
- Async patterns throughout
- Built-in error handling with HTTP exceptions

**Key Functions**:
- `store_message()` - Message persistence pattern
- `create_conversation()` - Resource creation pattern
- `check_rate_limit()` - Usage tracking pattern (relevant for token consumption)
- `store_request()` - Request logging pattern

**Rate Limiting Implementation**: Already tracks user requests with timestamps - can be extended for token usage tracking.

### 1.3 Dependencies and Tech Stack

**Key Dependencies** (from `requirements.txt`):
- `fastapi==0.115.12` - Web framework
- `supabase==2.15.1` - Database client
- `pydantic==2.11.4` - Data validation
- `httpx==0.28.1` - HTTP client (for external APIs)
- `RestrictedPython==8.0` - Code execution security
- `uvicorn==0.34.2` - ASGI server

**Integration Readiness**:
- HTTP client available for Stripe API calls
- Pydantic ready for webhook payload validation
- FastAPI supports webhook endpoints and middleware

---

## 2. Frontend Architecture Analysis

### 2.1 Application Structure (`C:\Users\colem\dynamous-community\ai-coding-workshop\frontend\src\`)

**Routing System** (`App.tsx`):
- React Router v6 with protected routes
- Current routes: `/login`, `/`, `/admin`, `/auth/callback`
- **Integration Point**: Can add `/billing`, `/subscription`, `/purchase` routes

**Authentication Context** (`hooks/useAuth.tsx`):
- Supabase auth integration with session management
- Google OAuth support
- Profile synchronization with `user_profiles` table
- **Integration Point**: Can extend for subscription status checks

### 2.2 User Interface Patterns

**Settings Modal** (`components/sidebar/SettingsModal.tsx`):
- Form validation with `react-hook-form`
- Supabase direct updates to `user_profiles` table
- Error handling with toast notifications
- **Integration Point**: Perfect pattern for billing/subscription settings

**Chat Sidebar** (`components/sidebar/ChatSidebar.tsx`):
- User profile display with avatar
- Settings button triggering modal
- **Integration Point**: Can add token balance display and purchase button

**Component Architecture**:
- Shadcn UI components (Radix UI primitives)
- Consistent error handling patterns
- Mobile-responsive design with `useIsMobile` hook

### 2.3 Current User Profile Features

**Existing Profile Management**:
- Full name editing
- Google profile synchronization
- Real-time updates with optimistic UI
- **Extension Points**: Add token balance, subscription tier, payment methods

### 2.4 Frontend Tech Stack

**Key Dependencies** (from `package.json`):
- `react@18.3.1` + `typescript@5.5.3`
- `@supabase/supabase-js@2.49.4` - Database client
- `react-hook-form@7.53.0` - Form management
- `zod@3.23.8` - Schema validation
- `lucide-react@0.462.0` - Icons
- `tailwindcss@3.4.11` - Styling
- `@radix-ui/*` - UI primitives (modals, buttons, etc.)

**Integration Readiness**:
- Form handling ready for payment forms
- Toast system for payment status notifications
- Modal system for checkout flows
- HTTP client via fetch for Stripe frontend calls

---

## 3. Database Schema Analysis

### 3.1 Current Schema (`C:\Users\colem\dynamous-community\ai-coding-workshop\sql\0-all-tables.sql`)

**User Profiles Table**:
```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

**Requests Table** (Rate Limiting):
```sql
CREATE TABLE requests (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_query TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);
```

### 3.2 RLS Security Patterns

**Comprehensive Policies**:
- Users can only access their own data
- Admin override capabilities
- No deletion policies (data preservation)
- Service role bypass for backend operations

**Example User Data Access**:
```sql
CREATE POLICY "Users can view their own profile"
ON user_profiles
FOR SELECT
USING (auth.uid() = id);
```

### 3.3 Schema Extension Points

**New Tables Needed**:
1. **`subscription_plans`** - Plan definitions (free/pro/enterprise)
2. **`user_subscriptions`** - Active user subscriptions
3. **`token_purchases`** - One-time token purchases
4. **`token_usage`** - Token consumption tracking
5. **`stripe_customers`** - Stripe customer ID mapping
6. **`payment_transactions`** - Payment history and webhook events

**Integration Pattern**: Follow existing RLS patterns with user-scoped access and admin overrides.

---

## 4. Configuration Management

### 4.1 Environment Variables (`.env.example`)

**Current Configuration Sections**:
- **LLM Configuration**: Provider, API keys, model choices
- **Database Configuration**: Supabase URLs and keys
- **Frontend Configuration**: Build-time environment variables
- **Deployment Configuration**: Docker and reverse proxy settings

**Stripe Integration Additions Needed**:
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SUCCESS_URL=http://localhost:8082/billing/success
STRIPE_CANCEL_URL=http://localhost:8082/billing/cancel

# Frontend Build Variables
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 4.2 Docker Configuration (`docker-compose.yml`)

**Current Services**:
- **agent-api**: Port 8001, health checks, environment variables
- **rag-pipeline**: Document processing
- **frontend**: Port 8082, build-time variables

**Integration Points**:
- Add Stripe environment variables to `agent-api` service
- Add Stripe publishable key to frontend build args
- Webhook endpoints will be available at `http://agent-api:8001/webhooks/stripe`

---

## 5. API Integration Patterns

### 5.1 Current Agent Endpoint (`/api/pydantic-agent`)

**Authentication Flow**:
1. Frontend sends JWT token in Authorization header
2. Backend validates token via Supabase auth API
3. User ID extracted and validated against request
4. Rate limiting checked before processing

**Request Processing Pattern**:
1. Rate limit validation
2. Conversation/message storage
3. Async agent processing with streaming
4. Response storage and cleanup

### 5.2 Payment Endpoint Architecture

**Recommended New Endpoints**:
- `POST /api/payments/create-checkout` - Create Stripe checkout session
- `POST /api/payments/webhook` - Handle Stripe webhook events
- `GET /api/billing/subscription` - Get user subscription status
- `GET /api/billing/usage` - Get token usage statistics
- `POST /api/billing/purchase-tokens` - One-time token purchase

**Authentication Pattern**: Reuse existing `verify_token` dependency for protected endpoints.

---

## 6. Error Handling and Validation

### 6.1 Current Error Patterns

**Backend Error Handling**:
- HTTPException with structured error messages
- Logging with print statements (could be enhanced)
- Graceful degradation for service failures
- Health check endpoints for monitoring

**Frontend Error Handling**:
- Toast notifications for user feedback
- Form validation with clear error messages
- Loading states for async operations
- Fallback UI for failed requests

### 6.2 Payment-Specific Error Handling

**Required Error Scenarios**:
- Stripe API failures
- Webhook signature validation failures
- Payment declined scenarios
- Subscription status conflicts
- Token balance insufficient scenarios

**Pattern**: Extend existing toast system for payment status updates and error notifications.

---

## 7. Development Workflow

### 7.1 Current Development Setup

**Backend Development**:
```bash
cd backend_agent_api
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn agent_api:app --reload --port 8001
```

**Frontend Development**:
```bash
cd frontend
npm install && npm run dev  # Port 8082
```

**Testing**:
- Backend: pytest with async support
- Frontend: Playwright for E2E testing

### 7.2 Stripe Integration Development

**Development Environment**:
- Use Stripe test mode keys
- ngrok for webhook testing during development
- Stripe CLI for webhook forwarding: `stripe listen --forward-to localhost:8001/api/payments/webhook`

---

## 8. Security Considerations

### 8.1 Current Security Measures

**Authentication Security**:
- JWT token validation via Supabase
- RLS policies enforcing data access
- CORS middleware configured
- No sensitive data in frontend environment

**Code Security**:
- RestrictedPython for code execution
- Pydantic validation for all inputs
- Service account access patterns

### 8.2 Payment Security Requirements

**Critical Security Measures**:
- Webhook signature verification (prevent replay attacks)
- Server-side price validation (prevent frontend manipulation)
- PCI compliance through Stripe (no card data storage)
- Secure Stripe customer ID mapping
- Audit trails for all payment transactions

---

## 9. Recommended Implementation Approach

### 9.1 Phase 1: Backend Foundation
1. Add Stripe configuration to environment
2. Create payment-related database tables with RLS policies
3. Implement webhook endpoint with signature verification
4. Add subscription/token balance checks to existing endpoints

### 9.2 Phase 2: Frontend Integration
1. Add Stripe Elements for payment forms
2. Extend settings modal for billing management
3. Add token balance display to sidebar
4. Implement checkout flow components

### 9.3 Phase 3: Usage Integration
1. Integrate token consumption into agent endpoint
2. Add usage tracking and limits
3. Implement subscription-based rate limiting
4. Add billing history and invoice access

### 9.4 Phase 4: Enhancement
1. Add email notifications for billing events
2. Implement usage analytics dashboard
3. Add promotional codes and discounts
4. Implement team/organizational billing

---

## 10. File Organization

### 10.1 Backend Files to Create/Modify

**New Files**:
- `backend_agent_api/stripe_client.py` - Stripe API wrapper
- `backend_agent_api/payment_models.py` - Pydantic models for payments
- `backend_agent_api/billing_utils.py` - Billing and subscription utilities
- `backend_agent_api/webhook_handlers.py` - Stripe webhook processing

**Files to Modify**:
- `backend_agent_api/agent_api.py` - Add payment endpoints
- `backend_agent_api/db_utils.py` - Add billing database functions
- `backend_agent_api/requirements.txt` - Add stripe dependency

### 10.2 Frontend Files to Create/Modify

**New Files**:
- `frontend/src/components/billing/CheckoutForm.tsx` - Stripe checkout
- `frontend/src/components/billing/SubscriptionStatus.tsx` - Status display
- `frontend/src/components/billing/TokenBalance.tsx` - Balance component
- `frontend/src/pages/Billing.tsx` - Billing management page
- `frontend/src/hooks/useBilling.ts` - Billing state management

**Files to Modify**:
- `frontend/src/App.tsx` - Add billing route
- `frontend/src/components/sidebar/ChatSidebar.tsx` - Add token display
- `frontend/src/components/sidebar/SettingsModal.tsx` - Add billing section
- `frontend/package.json` - Add @stripe/stripe-js dependency

### 10.3 Database Files

**New SQL Files**:
- `sql/10-billing-tables.sql` - Payment and subscription tables
- `sql/11-billing-rls.sql` - Row level security for billing
- `sql/12-billing-functions.sql` - Stored procedures for billing operations

---

## Conclusion

The current codebase is well-architected for Stripe integration with:

✅ **Strong Authentication**: Supabase JWT with user validation
✅ **Flexible Database**: PostgreSQL with RLS policies
✅ **Modern Frontend**: React + TypeScript with form handling
✅ **Scalable Backend**: FastAPI with async patterns
✅ **Security Foundation**: Input validation and error handling

**Key Success Factors**:
1. Follow existing patterns for consistency
2. Leverage current authentication system
3. Extend RLS policies for billing data
4. Use existing UI component patterns
5. Implement comprehensive webhook handling
6. Maintain security-first approach

The architecture supports both subscription-based and pay-per-use token models, with clear upgrade paths for enterprise features.