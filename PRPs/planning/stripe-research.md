# Stripe Documentation and Implementation Patterns Research

## Overview

This document provides comprehensive research findings on Stripe implementation patterns for payment processing, webhook handling, frontend integration, and security best practices based on official Stripe documentation and industry best practices.

## 1. Payment Intent Flow

### Core Concepts

A PaymentIntent guides you through the process of collecting a payment from your customer. Each PaymentIntent should correlate with exactly one order or customer session in your system. The PaymentIntent encapsulates details about the transaction, such as supported payment methods, amount to collect, and desired currency.

### Creating Payment Intents

**Official Documentation:** https://docs.stripe.com/api/payment_intents/create

**Required Parameters:**
- `amount`: Positive integer in smallest currency unit (e.g., 100 cents = $1.00)
- `currency`: Three-letter ISO currency code (lowercase)

**Key Implementation Points:**
- Create exactly one PaymentIntent per order/session
- Use `client_secret` for frontend completion (never store/log this value)
- Enable TLS on any page that includes the client secret
- PaymentIntent transitions through multiple statuses during its lifecycle

**Basic Creation Example (Python):**
```python
import stripe

stripe.api_key = "sk_test_..."

payment_intent = stripe.PaymentIntent.create(
    amount=2000,  # $20.00
    currency='usd',
    automatic_payment_methods={
        'enabled': True,
    },
)
```

### Client-Side Payment Confirmation

**Documentation:** https://docs.stripe.com/payments/payment-intents

Client-side confirmation uses the `client_secret` from the PaymentIntent:

```javascript
// React/TypeScript example
const result = await stripe.confirmPayment({
    elements,
    confirmParams: {
        return_url: "https://example.com/order/123/complete",
    },
});

if (result.error) {
    // Show error to customer
    console.log(result.error.message);
} else {
    // Customer redirected to return_url
}
```

### Payment Success/Failure Handling

**Status Lifecycle Documentation:** https://docs.stripe.com/payments/paymentintents/lifecycle

**Key Statuses:**
- `succeeded`: Payment complete, funds in account
- `requires_action`: Additional authentication needed
- `canceled`: PaymentIntent invalidated
- `processing`: Payment initiated but not complete

**Best Practices:**
- Use webhooks for order fulfillment, not client-side completion
- Monitor `payment_intent.succeeded` webhook event
- Handle fulfillment asynchronously on server-side
- Never attempt fulfillment on client-side due to potential page abandonment

## 2. Webhook Implementation

### Webhook Endpoint Setup

**Official Documentation:** https://docs.stripe.com/webhooks

**Core Components Required:**
1. Raw request body (unmanipulated)
2. `Stripe-Signature` header
3. Webhook endpoint secret

### Signature Verification Implementation

**Security Documentation:** https://docs.stripe.com/webhooks/signature

**Python/FastAPI Implementation:**
```python
import stripe
from fastapi import Request, HTTPException

@app.post('/stripe-webhook')
async def stripe_webhook(request: Request):
    webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=sig_header,
            secret=webhook_secret
        )
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        # Handle successful payment
        await handle_successful_payment(payment_intent)

    return {'status': 'success'}
```

### Event Handling Patterns

**Key Events to Handle:**
- `payment_intent.succeeded`: Payment completed successfully
- `payment_intent.payment_failed`: Payment failed
- `invoice.payment_succeeded`: Subscription payment succeeded
- `customer.subscription.updated`: Subscription changes

**Error Handling Best Practices:**
- Return 2xx status code quickly (before complex logic)
- Use official Stripe libraries for signature verification
- Implement proper logging for debugging
- Handle duplicate events gracefully

### Idempotency Key Handling

**Official Documentation:** https://docs.stripe.com/api/idempotent_requests

**Key Concepts:**
- Use for all POST requests to prevent duplicate operations
- Generate using UUID v4 or high-entropy random strings
- Stripe caches first response (including errors) for same key
- Send in `Idempotency-Key` header

**Python Implementation Pattern:**
```python
import uuid
import stripe

# Generate idempotency key
idempotency_key = str(uuid.uuid4())

# Use in API calls
payment_intent = stripe.PaymentIntent.create(
    amount=2000,
    currency='usd',
    idempotency_key=idempotency_key,
)
```

### Retry Logic and Error Handling

**Error Handling Documentation:** https://docs.stripe.com/error-low-level

**Retry Strategy:**
- First retry: Quick (immediate or minimal delay)
- Subsequent retries: Exponential backoff with jitter
- Use same idempotency key and parameters for retries
- Configure Stripe SDK for automatic retries

**Error Categories:**
- **User Errors (4xx)**: Don't retry, fix request parameters
- **Server Errors (5xx)**: Safe to retry with same idempotency key
- **Network Errors**: Retry with exponential backoff

## 3. Stripe Elements/Checkout

### Frontend Integration Options

**React Documentation:** https://docs.stripe.com/sdks/stripejs-react

**Installation:**
```bash
npm install @stripe/react-stripe-js @stripe/stripe-js
```

### React Component Patterns

**TypeScript Support:** Full TypeScript declarations included

**Basic Setup:**
```typescript
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_...');

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: 'https://example.com/complete',
            },
        });

        if (result.error) {
            // Handle error
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button disabled={!stripe}>Pay</button>
        </form>
    );
}

function App() {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
}
```

### Security Best Practices

**Key Security Measures:**
- Always load Stripe.js from `js.stripe.com` (for PCI compliance)
- Never bundle or host Stripe.js yourself
- Use publishable keys (pk_) on frontend only
- Keep secret keys (sk_) server-side only
- Validate payments server-side via webhooks

### PCI Compliance Considerations

**Documentation:** https://docs.stripe.com/security

**Key Points:**
- Stripe Elements are PCI DSS compliant out of the box
- Elements run in secure iframes
- No sensitive payment data touches your servers
- Use Stripe's hosted payment forms when possible
- Implement proper HTTPS throughout your application

## 4. API Key Management

### Test vs Production Keys

**Key Types:**
- **Publishable Keys (pk_)**: Safe for client-side use
- **Secret Keys (sk_)**: Server-side only, never expose
- **Restricted Keys**: Limited permissions for specific use cases

**Key Patterns:**
- Test: `pk_test_...` and `sk_test_...`
- Live: `pk_live_...` and `sk_live_...`

### Environment Variable Setup

**Best Practices Documentation:** https://docs.stripe.com/keys-best-practices

**Secure Storage:**
```bash
# .env file (add to .gitignore)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Framework-Specific Warnings:**
- Avoid prefixes like `VITE_` or `NEXT_PUBLIC_` for secret keys
- These prefixes expose variables to browser
- Use server-only environment variable names

### Security Best Practices

**Core Principles:**
1. **Never commit keys to version control**
2. **Use environment variables or secure key management systems**
3. **Implement IP restrictions for additional security**
4. **Follow principle of least privilege with restricted keys**
5. **Establish regular key rotation schedule**

**IP Restrictions:**
- Limit API keys to specific IP addresses
- Provides protection even if keys are compromised
- Recommended for stable server infrastructure

**Key Rotation:**
- Define regular rotation schedule
- Prepare organization for emergency key rotation
- Monitor API usage for suspicious activity
- Use audit logs to track key usage

**Restricted Keys:**
- Create keys with minimal required permissions
- Use for third-party integrations
- Limit access to specific API resources
- Example: Read-only access for monitoring services

## Implementation URLs and Resources

### Official Documentation
- **API Reference:** https://docs.stripe.com/api
- **Payment Intents:** https://docs.stripe.com/payments/payment-intents
- **Webhooks:** https://docs.stripe.com/webhooks
- **React SDK:** https://docs.stripe.com/sdks/stripejs-react
- **Security:** https://docs.stripe.com/keys-best-practices
- **Idempotency:** https://docs.stripe.com/api/idempotent_requests

### GitHub Examples
- **React Stripe.js:** https://github.com/stripe/react-stripe-js
- **Next.js TypeScript Example:** https://github.com/vercel/next.js/tree/canary/examples/with-stripe-typescript

### Key Implementation Considerations

1. **Payment Flow:** Create PaymentIntent server-side, confirm client-side, fulfill via webhooks
2. **Security:** Use webhooks for fulfillment, implement signature verification, manage keys securely
3. **Error Handling:** Implement retry logic with idempotency keys, handle all error types appropriately
4. **Frontend:** Use official React components, maintain PCI compliance, validate server-side
5. **Production:** Implement monitoring, key rotation, IP restrictions, and proper logging

This research provides the foundation for implementing a secure, robust Stripe payment system following official best practices and industry standards.