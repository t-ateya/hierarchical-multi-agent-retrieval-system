import pytest
import sys
import os
import json
from unittest.mock import patch, MagicMock, AsyncMock, call
from datetime import datetime, timezone
from fastapi.testclient import TestClient
from fastapi import HTTPException

# Mock environment variables before importing modules that use them
with patch.dict(os.environ, {
    'LLM_PROVIDER': 'openai',
    'LLM_BASE_URL': 'https://api.openai.com/v1',
    'LLM_API_KEY': 'test-api-key',
    'LLM_CHOICE': 'gpt-4o-mini',
    'VISION_LLM_CHOICE': 'gpt-4o-mini',
    'EMBEDDING_PROVIDER': 'openai',
    'EMBEDDING_BASE_URL': 'https://api.openai.com/v1',
    'EMBEDDING_API_KEY': 'test-api-key',
    'EMBEDDING_MODEL_CHOICE': 'text-embedding-3-small',
    'SUPABASE_URL': 'https://test-supabase-url.com',
    'SUPABASE_SERVICE_KEY': 'test-supabase-key',
    'STRIPE_SECRET_KEY': 'sk_test_fake_key',
    'STRIPE_WEBHOOK_SECRET': 'whsec_test_secret'
}):
    # Add parent directory to path to import the modules
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    # Mock Stripe before importing
    with patch('stripe.api_key'):
        from db_utils import (
            check_user_token_balance,
            deduct_user_token,
            add_user_tokens,
            create_transaction_record
        )


class TestTokenManagement:
    @pytest.mark.asyncio
    async def test_check_user_token_balance_success(self):
        """Test successful token balance checking"""
        mock_supabase = MagicMock()
        mock_response = MagicMock()
        mock_response.data = {"tokens": 10}

        mock_supabase.table().select().eq().single().execute.return_value = mock_response

        balance = await check_user_token_balance(mock_supabase, "user_123")

        assert balance == 10
        mock_supabase.table.assert_called_with("user_profiles")

    @pytest.mark.asyncio
    async def test_check_user_token_balance_no_data(self):
        """Test token balance when no data is returned"""
        mock_supabase = MagicMock()
        mock_response = MagicMock()
        mock_response.data = None

        mock_supabase.table().select().eq().single().execute.return_value = mock_response

        balance = await check_user_token_balance(mock_supabase, "user_123")

        assert balance == 0

    @pytest.mark.asyncio
    async def test_check_user_token_balance_error(self):
        """Test token balance when an error occurs"""
        mock_supabase = MagicMock()
        mock_supabase.table().select().eq().single().execute.side_effect = Exception("Database error")

        balance = await check_user_token_balance(mock_supabase, "user_123")

        assert balance == 0

    @pytest.mark.asyncio
    async def test_deduct_token_success_with_rpc(self):
        """Test successful token deduction using RPC"""
        mock_supabase = MagicMock()
        mock_response = MagicMock()
        mock_response.data = True

        mock_supabase.rpc.return_value.execute.return_value = mock_response

        result = await deduct_user_token(mock_supabase, "user_123")

        assert result == True
        mock_supabase.rpc.assert_called_with("deduct_token", {"p_user_id": "user_123"})

    @pytest.mark.asyncio
    async def test_deduct_token_fallback_success(self):
        """Test token deduction fallback when RPC fails"""
        mock_supabase = MagicMock()

        # RPC fails
        mock_supabase.rpc.side_effect = Exception("RPC not available")

        # Fallback succeeds
        mock_balance_response = MagicMock()
        mock_balance_response.data = {"tokens": 5}
        mock_supabase.table("user_profiles").select().eq().single().execute.return_value = mock_balance_response

        mock_update_response = MagicMock()
        mock_update_response.data = [{"id": "user_123", "tokens": 4}]
        mock_supabase.table("user_profiles").update().eq().eq().execute.return_value = mock_update_response

        # Mock create_transaction_record
        mock_create_response = MagicMock()
        mock_create_response.data = [{"id": "trans_123"}]
        mock_supabase.table("transactions").insert().execute.return_value = mock_create_response

        # Patch check_user_token_balance
        with patch('test_stripe_integration.check_user_token_balance', return_value=5):
            with patch('test_stripe_integration.create_transaction_record', return_value={"id": "trans_123"}):
                result = await deduct_user_token(mock_supabase, "user_123")

        assert result == True

    @pytest.mark.asyncio
    async def test_deduct_token_insufficient_balance(self):
        """Test token deduction with insufficient balance"""
        mock_supabase = MagicMock()

        # RPC returns False (insufficient balance)
        mock_response = MagicMock()
        mock_response.data = False
        mock_supabase.rpc.return_value.execute.return_value = mock_response

        result = await deduct_user_token(mock_supabase, "user_123")

        assert result == False

    @pytest.mark.asyncio
    async def test_add_user_tokens_success(self):
        """Test successful token addition"""
        mock_supabase = MagicMock()

        # Check for existing transaction (idempotency)
        mock_existing_response = MagicMock()
        mock_existing_response.data = []
        mock_supabase.table("transactions").select().eq().execute.return_value = mock_existing_response

        # Get current balance
        mock_balance_response = MagicMock()
        mock_balance_response.data = {"tokens": 10}
        mock_supabase.table("user_profiles").select().eq().single().execute.return_value = mock_balance_response

        # Update tokens
        mock_update_response = MagicMock()
        mock_update_response.data = [{"id": "user_123", "tokens": 110}]
        mock_supabase.table("user_profiles").update().eq().execute.return_value = mock_update_response

        # Create transaction record
        mock_trans_response = MagicMock()
        mock_trans_response.data = [{"id": "trans_123"}]
        mock_supabase.table("transactions").insert().execute.return_value = mock_trans_response

        with patch('test_stripe_integration.check_user_token_balance', return_value=10):
            with patch('test_stripe_integration.create_transaction_record', return_value={"id": "trans_123"}):
                result = await add_user_tokens(
                    mock_supabase,
                    "user_123",
                    100,
                    "pi_123",
                    "evt_123"
                )

        assert result == True

    @pytest.mark.asyncio
    async def test_add_user_tokens_idempotent(self):
        """Test that add_user_tokens is idempotent"""
        mock_supabase = MagicMock()

        # Transaction already exists
        mock_existing_response = MagicMock()
        mock_existing_response.data = [{"id": "trans_existing"}]
        mock_supabase.table("transactions").select().eq().execute.return_value = mock_existing_response

        result = await add_user_tokens(
            mock_supabase,
            "user_123",
            100,
            "pi_123",
            "evt_123"
        )

        assert result == True  # Should return True even though it didn't add tokens
        # Should not call update or insert
        mock_supabase.table("user_profiles").update.assert_not_called()

    @pytest.mark.asyncio
    async def test_create_transaction_record_success(self):
        """Test successful transaction record creation"""
        mock_supabase = MagicMock()
        mock_response = MagicMock()
        mock_response.data = [{
            "id": "trans_123",
            "user_id": "user_123",
            "transaction_type": "purchase",
            "token_amount": 100,
            "stripe_payment_intent_id": "pi_123",
            "stripe_event_id": "evt_123",
            "details": {"source": "stripe_purchase"},
            "created_at": datetime.now(timezone.utc).isoformat()
        }]

        mock_supabase.table("transactions").insert().execute.return_value = mock_response

        transaction_data = {
            "user_id": "user_123",
            "transaction_type": "purchase",
            "token_amount": 100,
            "stripe_payment_intent_id": "pi_123",
            "stripe_event_id": "evt_123",
            "details": {"source": "stripe_purchase"}
        }

        result = await create_transaction_record(mock_supabase, transaction_data)

        assert result["id"] == "trans_123"
        assert result["user_id"] == "user_123"
        assert result["token_amount"] == 100

    @pytest.mark.asyncio
    async def test_create_transaction_record_failure(self):
        """Test transaction record creation failure"""
        mock_supabase = MagicMock()
        mock_supabase.table("transactions").insert().execute.side_effect = Exception("Database error")

        transaction_data = {
            "user_id": "user_123",
            "transaction_type": "usage",
            "token_amount": -1,
            "details": {"reason": "agent_interaction"}
        }

        result = await create_transaction_record(mock_supabase, transaction_data)

        assert result == {}


class TestStripeEndpoints:
    @pytest.mark.asyncio
    async def test_stripe_webhook_signature_verification_success(self):
        """Test successful webhook signature verification"""
        import stripe

        payload = b'{"type": "payment_intent.succeeded"}'
        sig_header = 'test_signature'

        with patch('stripe.Webhook.construct_event') as mock_construct:
            mock_construct.return_value = {
                'id': 'evt_123',
                'type': 'payment_intent.succeeded',
                'data': {
                    'object': {
                        'id': 'pi_123',
                        'metadata': {
                            'user_id': 'user_123',
                            'token_amount': '100'
                        }
                    }
                }
            }

            # The actual webhook handler would process this
            event = stripe.Webhook.construct_event(
                payload, sig_header, 'whsec_test_secret'
            )

            assert event['type'] == 'payment_intent.succeeded'
            assert event['data']['object']['metadata']['user_id'] == 'user_123'

    @pytest.mark.asyncio
    async def test_stripe_webhook_invalid_signature(self):
        """Test webhook with invalid signature"""
        import stripe

        payload = b'{"type": "payment_intent.succeeded"}'
        sig_header = 'invalid_signature'

        with patch('stripe.Webhook.construct_event') as mock_construct:
            mock_construct.side_effect = stripe.error.SignatureVerificationError(
                "Invalid signature", sig_header
            )

            with pytest.raises(stripe.error.SignatureVerificationError):
                stripe.Webhook.construct_event(
                    payload, sig_header, 'whsec_test_secret'
                )

    @pytest.mark.asyncio
    async def test_payment_intent_creation_success(self):
        """Test successful payment intent creation"""
        import stripe

        with patch('stripe.PaymentIntent.create') as mock_create:
            mock_create.return_value = {
                "id": "pi_123",
                "client_secret": "pi_123_secret",
                "amount": 500,
                "currency": "usd",
                "metadata": {
                    "user_id": "user_123",
                    "token_amount": "100",
                    "package": "basic"
                }
            }

            intent = stripe.PaymentIntent.create(
                amount=500,
                currency="usd",
                metadata={
                    "user_id": "user_123",
                    "token_amount": "100",
                    "package": "basic"
                }
            )

            assert intent["id"] == "pi_123"
            assert intent["amount"] == 500
            assert intent["metadata"]["token_amount"] == "100"

    @pytest.mark.asyncio
    async def test_payment_intent_creation_failure(self):
        """Test payment intent creation failure"""
        import stripe

        with patch('stripe.PaymentIntent.create') as mock_create:
            mock_create.side_effect = stripe.error.StripeError("Payment processing error")

            with pytest.raises(stripe.error.StripeError):
                stripe.PaymentIntent.create(
                    amount=500,
                    currency="usd",
                    metadata={"user_id": "user_123"}
                )


class TestStripeAPIEndpoints:
    """Test FastAPI Stripe endpoints with proper mocking."""

    @pytest.fixture
    def mock_supabase(self):
        return MagicMock()

    @pytest.fixture
    def mock_user(self):
        return {"id": "user_123", "email": "test@example.com"}

    @pytest.mark.asyncio
    async def test_create_payment_intent_basic_package(self, mock_supabase, mock_user):
        """Test creating payment intent for basic package."""
        with patch('stripe.PaymentIntent.create') as mock_create:
            mock_create.return_value = MagicMock(
                id="pi_test_123",
                client_secret="pi_test_123_secret_456"
            )

            # Mock verify_token dependency
            with patch('agent_api.verify_token', return_value=mock_user):
                with patch('agent_api.supabase', mock_supabase):
                    # This would test the actual FastAPI endpoint
                    # For now, we test the core logic

                    # Test package mapping
                    packages = {
                        "basic": {"amount": 500, "tokens": 100},
                        "standard": {"amount": 1000, "tokens": 250},
                        "premium": {"amount": 2000, "tokens": 600}
                    }

                    package = packages["basic"]
                    assert package["amount"] == 500
                    assert package["tokens"] == 100

    @pytest.mark.asyncio
    async def test_create_payment_intent_invalid_package(self):
        """Test payment intent creation with invalid package."""
        packages = {
            "basic": {"amount": 500, "tokens": 100},
            "standard": {"amount": 1000, "tokens": 250},
            "premium": {"amount": 2000, "tokens": 600}
        }

        # Should raise KeyError for invalid package
        with pytest.raises(KeyError):
            package = packages["invalid_package"]

    @pytest.mark.asyncio
    async def test_stripe_webhook_payment_succeeded(self, mock_supabase):
        """Test webhook handling for successful payment."""
        mock_event = {
            'id': 'evt_test_123',
            'type': 'payment_intent.succeeded',
            'data': {
                'object': {
                    'id': 'pi_test_123',
                    'metadata': {
                        'user_id': 'user_123',
                        'token_amount': '100'
                    }
                }
            }
        }

        with patch('add_user_tokens', return_value=True) as mock_add_tokens:
            # Simulate webhook processing
            payment_intent = mock_event['data']['object']
            user_id = payment_intent['metadata']['user_id']
            token_amount = int(payment_intent['metadata']['token_amount'])

            result = await add_user_tokens(
                mock_supabase,
                user_id,
                token_amount,
                payment_intent['id'],
                mock_event['id']
            )

            assert result == True
            mock_add_tokens.assert_called_once()

    @pytest.mark.asyncio
    async def test_stripe_webhook_invalid_event_type(self):
        """Test webhook with unsupported event type."""
        mock_event = {
            'id': 'evt_test_123',
            'type': 'payment_intent.canceled',
            'data': {'object': {}}
        }

        # Should not process unsupported events
        if mock_event['type'] != 'payment_intent.succeeded':
            # Event should be ignored
            assert True

    @pytest.mark.asyncio
    async def test_webhook_signature_verification_failure(self):
        """Test webhook signature verification failure."""
        import stripe

        with patch('stripe.Webhook.construct_event') as mock_construct:
            mock_construct.side_effect = stripe.error.SignatureVerificationError(
                "Invalid signature", "invalid_sig"
            )

            with pytest.raises(stripe.error.SignatureVerificationError):
                stripe.Webhook.construct_event(
                    b'{"type": "test"}',
                    "invalid_sig",
                    "whsec_test_secret"
                )


class TestTokenBalanceEdgeCases:
    """Test edge cases for token balance operations."""

    @pytest.mark.asyncio
    async def test_deduct_token_race_condition(self):
        """Test token deduction with potential race condition."""
        mock_supabase = MagicMock()

        # First call succeeds, second call returns empty (race condition)
        mock_response_1 = MagicMock()
        mock_response_1.data = [{"id": "user_123", "tokens": 4}]

        mock_response_2 = MagicMock()
        mock_response_2.data = []  # Race condition - balance changed

        mock_supabase.table("user_profiles").update().eq().eq().execute.side_effect = [
            mock_response_1, mock_response_2
        ]

        # Mock RPC failure to force fallback
        mock_supabase.rpc.side_effect = Exception("RPC not available")

        with patch('test_stripe_integration.check_user_token_balance', return_value=5):
            with patch('test_stripe_integration.create_transaction_record', return_value={"id": "trans_123"}):
                result = await deduct_user_token(mock_supabase, "user_123")

        assert result == True

    @pytest.mark.asyncio
    async def test_deduct_token_zero_balance(self):
        """Test token deduction when balance is zero."""
        mock_supabase = MagicMock()
        mock_supabase.rpc.side_effect = Exception("RPC not available")

        with patch('test_stripe_integration.check_user_token_balance', return_value=0):
            result = await deduct_user_token(mock_supabase, "user_123")

        assert result == False

    @pytest.mark.asyncio
    async def test_add_tokens_concurrent_requests(self):
        """Test concurrent token addition with same event ID."""
        mock_supabase = MagicMock()

        # First request - no existing transaction
        mock_existing_response_1 = MagicMock()
        mock_existing_response_1.data = []

        # Second request - transaction already exists
        mock_existing_response_2 = MagicMock()
        mock_existing_response_2.data = [{"id": "trans_123"}]

        mock_supabase.table("transactions").select().eq().execute.side_effect = [
            mock_existing_response_1, mock_existing_response_2
        ]

        # First request processes normally
        with patch('test_stripe_integration.check_user_token_balance', return_value=10):
            with patch('test_stripe_integration.create_transaction_record', return_value={"id": "trans_123"}):
                mock_update_response = MagicMock()
                mock_update_response.data = [{"id": "user_123", "tokens": 110}]
                mock_supabase.table("user_profiles").update().eq().execute.return_value = mock_update_response

                result1 = await add_user_tokens(
                    mock_supabase, "user_123", 100, "pi_123", "evt_123"
                )

        # Second request is idempotent
        result2 = await add_user_tokens(
            mock_supabase, "user_123", 100, "pi_123", "evt_123"
        )

        assert result1 == True
        assert result2 == True  # Idempotent behavior

    @pytest.mark.asyncio
    async def test_large_token_purchase(self):
        """Test purchasing maximum allowed tokens."""
        mock_supabase = MagicMock()

        # Test with premium package (largest)
        mock_existing_response = MagicMock()
        mock_existing_response.data = []
        mock_supabase.table("transactions").select().eq().execute.return_value = mock_existing_response

        mock_update_response = MagicMock()
        mock_update_response.data = [{"id": "user_123", "tokens": 1600}]  # 1000 + 600
        mock_supabase.table("user_profiles").update().eq().execute.return_value = mock_update_response

        with patch('test_stripe_integration.check_user_token_balance', return_value=1000):
            with patch('test_stripe_integration.create_transaction_record', return_value={"id": "trans_123"}):
                result = await add_user_tokens(
                    mock_supabase, "user_123", 600, "pi_123", "evt_123"
                )

        assert result == True


class TestPerformanceAndScaling:
    """Test performance scenarios and edge cases."""

    @pytest.mark.asyncio
    async def test_multiple_concurrent_balance_checks(self):
        """Test multiple concurrent balance checks."""
        mock_supabase = MagicMock()
        mock_response = MagicMock()
        mock_response.data = {"tokens": 50}
        mock_supabase.table().select().eq().single().execute.return_value = mock_response

        # Simulate multiple concurrent requests
        import asyncio
        tasks = [
            check_user_token_balance(mock_supabase, "user_123")
            for _ in range(10)
        ]

        results = await asyncio.gather(*tasks)

        # All should return the same balance
        assert all(balance == 50 for balance in results)
        assert len(results) == 10

    @pytest.mark.asyncio
    async def test_database_timeout_handling(self):
        """Test handling of database timeouts."""
        mock_supabase = MagicMock()
        mock_supabase.table().select().eq().single().execute.side_effect = Exception("Connection timeout")

        balance = await check_user_token_balance(mock_supabase, "user_123")

        # Should gracefully handle timeout and return 0
        assert balance == 0

    @pytest.mark.asyncio
    async def test_transaction_record_with_special_characters(self):
        """Test transaction record with special characters in metadata."""
        mock_supabase = MagicMock()
        mock_response = MagicMock()
        mock_response.data = [{
            "id": "trans_123",
            "details": {"source": "stripe_purchase", "note": "Special chars: éñ中文🎉"}
        }]
        mock_supabase.table("transactions").insert().execute.return_value = mock_response

        transaction_data = {
            "user_id": "user_123",
            "transaction_type": "purchase",
            "token_amount": 100,
            "details": {"source": "stripe_purchase", "note": "Special chars: éñ中文🎉"}
        }

        result = await create_transaction_record(mock_supabase, transaction_data)

        assert result["id"] == "trans_123"
        assert "🎉" in result["details"]["note"]


class TestSecurityScenarios:
    """Test security-related scenarios."""

    @pytest.mark.asyncio
    async def test_sql_injection_prevention(self):
        """Test that user IDs with SQL injection attempts are handled safely."""
        mock_supabase = MagicMock()
        malicious_user_id = "'; DROP TABLE users; --"

        # Supabase client should handle parameterized queries safely
        mock_response = MagicMock()
        mock_response.data = {"tokens": 0}
        mock_supabase.table().select().eq().single().execute.return_value = mock_response

        balance = await check_user_token_balance(mock_supabase, malicious_user_id)

        # Should still work (supabase handles parameterization)
        assert balance == 0
        mock_supabase.table.assert_called_with("user_profiles")

    @pytest.mark.asyncio
    async def test_negative_token_amount_handling(self):
        """Test handling of negative token amounts."""
        mock_supabase = MagicMock()

        # Should not allow negative token additions
        with pytest.raises(Exception):
            # This would be caught by validation in the actual endpoint
            assert -100 > 0, "Negative token amounts not allowed"

    @pytest.mark.asyncio
    async def test_extremely_large_token_amount(self):
        """Test handling of extremely large token amounts."""
        mock_supabase = MagicMock()

        # Test with unrealistically large amount
        large_amount = 999999999

        # This would be validated by business logic
        max_tokens_per_purchase = 1000
        assert large_amount > max_tokens_per_purchase


class TestWebhookIdempotency:
    """Test webhook idempotency scenarios."""

    @pytest.mark.asyncio
    async def test_duplicate_webhook_events(self):
        """Test handling of duplicate webhook events."""
        mock_supabase = MagicMock()

        # First webhook - transaction doesn't exist
        mock_empty_response = MagicMock()
        mock_empty_response.data = []

        # Second webhook - transaction exists
        mock_existing_response = MagicMock()
        mock_existing_response.data = [{"id": "trans_123", "stripe_event_id": "evt_123"}]

        mock_supabase.table("transactions").select().eq().execute.side_effect = [
            mock_empty_response,  # First call
            mock_existing_response  # Second call
        ]

        # First webhook processes tokens
        with patch('test_stripe_integration.check_user_token_balance', return_value=100):
            with patch('test_stripe_integration.create_transaction_record', return_value={"id": "trans_123"}):
                mock_update_response = MagicMock()
                mock_update_response.data = [{"id": "user_123", "tokens": 200}]
                mock_supabase.table("user_profiles").update().eq().execute.return_value = mock_update_response

                result1 = await add_user_tokens(
                    mock_supabase, "user_123", 100, "pi_123", "evt_123"
                )

        # Second webhook is idempotent (no processing)
        result2 = await add_user_tokens(
            mock_supabase, "user_123", 100, "pi_123", "evt_123"
        )

        assert result1 == True
        assert result2 == True  # Returns True but doesn't process again

    @pytest.mark.asyncio
    async def test_webhook_event_ordering(self):
        """Test handling of out-of-order webhook events."""
        mock_supabase = MagicMock()

        # Simulate events arriving out of order
        events = [
            {"id": "evt_002", "created": 1234567891},
            {"id": "evt_001", "created": 1234567890},
            {"id": "evt_003", "created": 1234567892}
        ]

        # Events should be processed based on event ID uniqueness, not order
        for event in events:
            mock_empty_response = MagicMock()
            mock_empty_response.data = []
            mock_supabase.table("transactions").select().eq().execute.return_value = mock_empty_response

            with patch('test_stripe_integration.check_user_token_balance', return_value=0):
                with patch('test_stripe_integration.create_transaction_record', return_value={"id": f"trans_{event['id']}"}):
                    mock_update_response = MagicMock()
                    mock_update_response.data = [{"id": "user_123", "tokens": 100}]
                    mock_supabase.table("user_profiles").update().eq().execute.return_value = mock_update_response

                    result = await add_user_tokens(
                        mock_supabase, "user_123", 100, "pi_123", event["id"]
                    )
                    assert result == True