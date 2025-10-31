import pytest
import sys
import os
import json
from unittest.mock import patch, MagicMock, AsyncMock
from fastapi.testclient import TestClient
from fastapi import HTTPException
import stripe

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

    # Mock dependencies before importing app
    with patch('stripe.api_key'):
        with patch('agent_api.get_agent_clients'):
            with patch('agent_api.verify_token'):
                from agent_api import app


class TestStripeEndpointsIntegration:
    """Integration tests for Stripe API endpoints."""

    @pytest.fixture
    def client(self):
        return TestClient(app)

    @pytest.fixture
    def mock_user(self):
        return {"id": "user_123", "email": "test@example.com"}

    @pytest.fixture
    def mock_supabase(self):
        supabase_mock = MagicMock()
        with patch('agent_api.supabase', supabase_mock):
            yield supabase_mock

    @pytest.mark.asyncio
    async def test_create_payment_intent_basic_package(self, client, mock_user, mock_supabase):
        """Test creating payment intent for basic package."""
        with patch('agent_api.verify_token', return_value=mock_user):
            with patch('stripe.PaymentIntent.create') as mock_create:
                mock_create.return_value = MagicMock(
                    id="pi_test_123",
                    client_secret="pi_test_123_secret_456"
                )

                response = client.post(
                    "/api/create-payment-intent",
                    json={"token_package": "basic"},
                    headers={"Authorization": "Bearer test-token"}
                )

                assert response.status_code == 200
                data = response.json()
                assert data["client_secret"] == "pi_test_123_secret_456"
                assert data["payment_intent_id"] == "pi_test_123"

                # Verify Stripe was called with correct parameters
                mock_create.assert_called_once_with(
                    amount=500,
                    currency="usd",
                    metadata={
                        "user_id": "user_123",
                        "token_amount": "100",
                        "package": "basic"
                    }
                )

    @pytest.mark.asyncio
    async def test_create_payment_intent_standard_package(self, client, mock_user, mock_supabase):
        """Test creating payment intent for standard package."""
        with patch('agent_api.verify_token', return_value=mock_user):
            with patch('stripe.PaymentIntent.create') as mock_create:
                mock_create.return_value = MagicMock(
                    id="pi_test_456",
                    client_secret="pi_test_456_secret_789"
                )

                response = client.post(
                    "/api/create-payment-intent",
                    json={"token_package": "standard"},
                    headers={"Authorization": "Bearer test-token"}
                )

                assert response.status_code == 200
                data = response.json()
                assert data["payment_intent_id"] == "pi_test_456"

                mock_create.assert_called_once_with(
                    amount=1000,
                    currency="usd",
                    metadata={
                        "user_id": "user_123",
                        "token_amount": "250",
                        "package": "standard"
                    }
                )

    @pytest.mark.asyncio
    async def test_create_payment_intent_premium_package(self, client, mock_user, mock_supabase):
        """Test creating payment intent for premium package."""
        with patch('agent_api.verify_token', return_value=mock_user):
            with patch('stripe.PaymentIntent.create') as mock_create:
                mock_create.return_value = MagicMock(
                    id="pi_test_789",
                    client_secret="pi_test_789_secret_012"
                )

                response = client.post(
                    "/api/create-payment-intent",
                    json={"token_package": "premium"},
                    headers={"Authorization": "Bearer test-token"}
                )

                assert response.status_code == 200
                mock_create.assert_called_once_with(
                    amount=2000,
                    currency="usd",
                    metadata={
                        "user_id": "user_123",
                        "token_amount": "600",
                        "package": "premium"
                    }
                )

    @pytest.mark.asyncio
    async def test_create_payment_intent_invalid_package(self, client, mock_user, mock_supabase):
        """Test creating payment intent with invalid package."""
        with patch('agent_api.verify_token', return_value=mock_user):
            response = client.post(
                "/api/create-payment-intent",
                json={"token_package": "invalid"},
                headers={"Authorization": "Bearer test-token"}
            )

            assert response.status_code == 422  # KeyError should result in 422

    @pytest.mark.asyncio
    async def test_create_payment_intent_stripe_error(self, client, mock_user, mock_supabase):
        """Test payment intent creation with Stripe error."""
        with patch('agent_api.verify_token', return_value=mock_user):
            with patch('stripe.PaymentIntent.create') as mock_create:
                mock_create.side_effect = stripe.error.CardError(
                    "Your card was declined", "card_declined", "card_declined"
                )

                response = client.post(
                    "/api/create-payment-intent",
                    json={"token_package": "basic"},
                    headers={"Authorization": "Bearer test-token"}
                )

                assert response.status_code == 400
                assert "card was declined" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_create_payment_intent_unauthorized(self, client, mock_supabase):
        """Test payment intent creation without authentication."""
        with patch('agent_api.verify_token', side_effect=HTTPException(status_code=401, detail="Unauthorized")):
            response = client.post(
                "/api/create-payment-intent",
                json={"token_package": "basic"}
            )

            assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_stripe_webhook_payment_succeeded(self, client, mock_supabase):
        """Test webhook handling for successful payment."""
        webhook_payload = {
            "id": "evt_test_123",
            "type": "payment_intent.succeeded",
            "data": {
                "object": {
                    "id": "pi_test_123",
                    "metadata": {
                        "user_id": "user_123",
                        "token_amount": "100"
                    }
                }
            }
        }

        with patch('stripe.Webhook.construct_event') as mock_construct:
            mock_construct.return_value = webhook_payload

            with patch('agent_api.add_user_tokens', return_value=True) as mock_add_tokens:
                response = client.post(
                    "/api/webhook/stripe",
                    data=json.dumps(webhook_payload),
                    headers={
                        "Stripe-Signature": "test_signature",
                        "Content-Type": "application/json"
                    }
                )

                assert response.status_code == 200
                assert response.json() == {"received": True}

                # Verify add_user_tokens was called correctly
                mock_add_tokens.assert_called_once_with(
                    mock_supabase,
                    "user_123",
                    100,
                    "pi_test_123",
                    "evt_test_123"
                )

    @pytest.mark.asyncio
    async def test_stripe_webhook_invalid_signature(self, client, mock_supabase):
        """Test webhook with invalid signature."""
        with patch('stripe.Webhook.construct_event') as mock_construct:
            mock_construct.side_effect = stripe.error.SignatureVerificationError(
                "Invalid signature", "invalid_sig"
            )

            response = client.post(
                "/api/webhook/stripe",
                data='{"type": "test"}',
                headers={
                    "Stripe-Signature": "invalid_signature",
                    "Content-Type": "application/json"
                }
            )

            assert response.status_code == 400
            assert "Invalid signature" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_stripe_webhook_invalid_payload(self, client, mock_supabase):
        """Test webhook with invalid payload."""
        with patch('stripe.Webhook.construct_event') as mock_construct:
            mock_construct.side_effect = ValueError("Invalid payload")

            response = client.post(
                "/api/webhook/stripe",
                data='invalid json',
                headers={
                    "Stripe-Signature": "test_signature",
                    "Content-Type": "application/json"
                }
            )

            assert response.status_code == 400
            assert "Invalid payload" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_stripe_webhook_unsupported_event(self, client, mock_supabase):
        """Test webhook with unsupported event type."""
        webhook_payload = {
            "id": "evt_test_456",
            "type": "payment_intent.canceled",
            "data": {"object": {}}
        }

        with patch('stripe.Webhook.construct_event') as mock_construct:
            mock_construct.return_value = webhook_payload

            response = client.post(
                "/api/webhook/stripe",
                data=json.dumps(webhook_payload),
                headers={
                    "Stripe-Signature": "test_signature",
                    "Content-Type": "application/json"
                }
            )

            assert response.status_code == 200
            assert response.json() == {"received": True}
            # Should not process unsupported events

    @pytest.mark.asyncio
    async def test_stripe_webhook_token_addition_failure(self, client, mock_supabase):
        """Test webhook when token addition fails."""
        webhook_payload = {
            "id": "evt_test_789",
            "type": "payment_intent.succeeded",
            "data": {
                "object": {
                    "id": "pi_test_789",
                    "metadata": {
                        "user_id": "user_123",
                        "token_amount": "250"
                    }
                }
            }
        }

        with patch('stripe.Webhook.construct_event') as mock_construct:
            mock_construct.return_value = webhook_payload

            with patch('agent_api.add_user_tokens', return_value=False) as mock_add_tokens:
                response = client.post(
                    "/api/webhook/stripe",
                    data=json.dumps(webhook_payload),
                    headers={
                        "Stripe-Signature": "test_signature",
                        "Content-Type": "application/json"
                    }
                )

                # Should still return 200 to avoid Stripe retries causing issues
                assert response.status_code == 200
                assert response.json() == {"received": True}

                mock_add_tokens.assert_called_once_with(
                    mock_supabase,
                    "user_123",
                    250,
                    "pi_test_789",
                    "evt_test_789"
                )

    @pytest.mark.asyncio
    async def test_stripe_webhook_missing_signature(self, client, mock_supabase):
        """Test webhook without signature header."""
        response = client.post(
            "/api/webhook/stripe",
            data='{"type": "test"}',
            headers={"Content-Type": "application/json"}
        )

        assert response.status_code == 400

    @pytest.mark.asyncio
    async def test_multiple_packages_pricing(self, client, mock_user, mock_supabase):
        """Test that all packages have correct pricing."""
        with patch('agent_api.verify_token', return_value=mock_user):
            with patch('stripe.PaymentIntent.create') as mock_create:
                mock_create.return_value = MagicMock(
                    id="pi_test",
                    client_secret="pi_test_secret"
                )

                # Test all packages
                packages = [
                    ("basic", 500, "100"),
                    ("standard", 1000, "250"),
                    ("premium", 2000, "600")
                ]

                for package_name, expected_amount, expected_tokens in packages:
                    response = client.post(
                        "/api/create-payment-intent",
                        json={"token_package": package_name},
                        headers={"Authorization": "Bearer test-token"}
                    )

                    assert response.status_code == 200

                    # Check the last call to stripe
                    last_call = mock_create.call_args
                    assert last_call[1]["amount"] == expected_amount
                    assert last_call[1]["metadata"]["token_amount"] == expected_tokens
                    assert last_call[1]["metadata"]["package"] == package_name

    @pytest.mark.asyncio
    async def test_webhook_idempotency_check(self, client, mock_supabase):
        """Test that webhook events are processed idempotently."""
        webhook_payload = {
            "id": "evt_test_idempotent",
            "type": "payment_intent.succeeded",
            "data": {
                "object": {
                    "id": "pi_test_idempotent",
                    "metadata": {
                        "user_id": "user_123",
                        "token_amount": "100"
                    }
                }
            }
        }

        with patch('stripe.Webhook.construct_event') as mock_construct:
            mock_construct.return_value = webhook_payload

            with patch('agent_api.add_user_tokens') as mock_add_tokens:
                # First call succeeds
                mock_add_tokens.return_value = True

                response1 = client.post(
                    "/api/webhook/stripe",
                    data=json.dumps(webhook_payload),
                    headers={
                        "Stripe-Signature": "test_signature",
                        "Content-Type": "application/json"
                    }
                )

                # Second call with same event (idempotent)
                response2 = client.post(
                    "/api/webhook/stripe",
                    data=json.dumps(webhook_payload),
                    headers={
                        "Stripe-Signature": "test_signature",
                        "Content-Type": "application/json"
                    }
                )

                assert response1.status_code == 200
                assert response2.status_code == 200

                # add_user_tokens should handle idempotency internally
                assert mock_add_tokens.call_count == 2

    @pytest.mark.asyncio
    async def test_payment_intent_metadata_completeness(self, client, mock_user, mock_supabase):
        """Test that payment intent includes all required metadata."""
        with patch('agent_api.verify_token', return_value=mock_user):
            with patch('stripe.PaymentIntent.create') as mock_create:
                mock_create.return_value = MagicMock(
                    id="pi_metadata_test",
                    client_secret="pi_metadata_test_secret"
                )

                response = client.post(
                    "/api/create-payment-intent",
                    json={"token_package": "standard"},
                    headers={"Authorization": "Bearer test-token"}
                )

                assert response.status_code == 200

                # Verify all required metadata is included
                call_args = mock_create.call_args
                metadata = call_args[1]["metadata"]

                assert "user_id" in metadata
                assert "token_amount" in metadata
                assert "package" in metadata
                assert metadata["user_id"] == "user_123"
                assert metadata["token_amount"] == "250"
                assert metadata["package"] == "standard"

    @pytest.mark.asyncio
    async def test_concurrent_payment_intents(self, client, mock_user, mock_supabase):
        """Test handling of concurrent payment intent requests."""
        with patch('agent_api.verify_token', return_value=mock_user):
            with patch('stripe.PaymentIntent.create') as mock_create:
                mock_create.return_value = MagicMock(
                    id="pi_concurrent",
                    client_secret="pi_concurrent_secret"
                )

                # Simulate concurrent requests
                import threading
                import queue

                results = queue.Queue()

                def make_request():
                    try:
                        response = client.post(
                            "/api/create-payment-intent",
                            json={"token_package": "basic"},
                            headers={"Authorization": "Bearer test-token"}
                        )
                        results.put(response.status_code)
                    except Exception as e:
                        results.put(str(e))

                # Create multiple threads
                threads = []
                for _ in range(5):
                    thread = threading.Thread(target=make_request)
                    threads.append(thread)
                    thread.start()

                # Wait for all threads to complete
                for thread in threads:
                    thread.join()

                # Check all requests succeeded
                status_codes = []
                while not results.empty():
                    status_codes.append(results.get())

                assert all(code == 200 for code in status_codes)
                assert len(status_codes) == 5