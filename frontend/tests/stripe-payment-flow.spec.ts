import { test, expect } from '@playwright/test';

// Mock Stripe responses for testing
const MOCK_PAYMENT_INTENT_RESPONSE = {
  client_secret: 'pi_test_1234567890_secret_test123',
  payment_intent_id: 'pi_test_1234567890'
};

const MOCK_STRIPE_PUBLISHABLE_KEY = 'pk_test_51234567890abcdefghijklmnopqrstuvwxyz';

test.describe('Stripe Payment Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Mock environment variables
    await page.addInitScript(() => {
      window.ENV = {
        VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_51234567890abcdefghijklmnopqrstuvwxyz',
        VITE_AGENT_ENDPOINT: 'http://localhost:8001'
      };
    });

    // Mock Stripe.js
    await page.addInitScript(() => {
      window.Stripe = () => ({
        elements: () => ({
          create: () => ({
            mount: () => {},
            on: () => {},
            unmount: () => {}
          }),
          getElement: () => ({})
        }),
        confirmCardPayment: async (clientSecret: string) => {
          if (clientSecret.includes('fail')) {
            return {
              error: {
                message: 'Your card was declined.'
              }
            };
          }
          return {
            paymentIntent: {
              id: 'pi_test_success',
              status: 'succeeded'
            }
          };
        }
      });
    });

    // Mock authentication
    await page.addInitScript(() => {
      window.localStorage.setItem('sb-test-auth-token', JSON.stringify({
        access_token: 'mock-token',
        user: { id: 'user-123', email: 'test@example.com' }
      }));
    });
  });

  test('should display token packages and allow selection', async ({ page }) => {
    await page.goto('/purchase');

    // Check that packages are displayed
    await expect(page.getByText('Basic')).toBeVisible();
    await expect(page.getByText('Standard')).toBeVisible();
    await expect(page.getByText('Premium')).toBeVisible();

    // Check pricing
    await expect(page.getByText('$5')).toBeVisible();
    await expect(page.getByText('$10')).toBeVisible();
    await expect(page.getByText('$20')).toBeVisible();

    // Check token amounts
    await expect(page.getByText('100').first()).toBeVisible(); // Basic tokens
    await expect(page.getByText('250')).toBeVisible(); // Standard tokens
    await expect(page.getByText('600')).toBeVisible(); // Premium tokens
  });

  test('should show checkout form when package is selected', async ({ page }) => {
    await page.goto('/purchase');

    // Select basic package
    await page.getByText('Basic').click();

    // Should show checkout form
    await expect(page.getByText('Complete Purchase')).toBeVisible();
    await expect(page.getByText('You are purchasing 100 tokens for $5')).toBeVisible();
    await expect(page.getByRole('button', { name: /Pay \$5/ })).toBeVisible();
  });

  test('should process successful payment flow', async ({ page }) => {
    // Mock successful API responses
    await page.route('**/api/create-payment-intent', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_PAYMENT_INTENT_RESPONSE)
      });
    });

    await page.goto('/purchase');

    // Select package
    await page.getByText('Standard').click();

    // Fill in mock card details (these would be Stripe Elements in real scenario)
    await page.getByRole('button', { name: /Pay \$10/ }).click();

    // Should show success message
    await expect(page.getByText('Payment successful!')).toBeVisible();
    await expect(page.getByText('250 tokens have been added to your account.')).toBeVisible();

    // Should redirect to success page
    await page.waitForURL('**/payment/success');
  });

  test('should handle payment intent creation failure', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/create-payment-intent', (route) => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid request' })
      });
    });

    await page.goto('/purchase');

    // Select package and attempt payment
    await page.getByText('Basic').click();
    await page.getByRole('button', { name: /Pay \$5/ }).click();

    // Should show error message
    await expect(page.getByText('Failed to create payment intent')).toBeVisible();
  });

  test('should handle Stripe payment failure', async ({ page }) => {
    // Mock payment intent creation success but payment failure
    await page.route('**/api/create-payment-intent', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          client_secret: 'pi_test_fail_secret',
          payment_intent_id: 'pi_test_fail'
        })
      });
    });

    await page.goto('/purchase');

    // Select package and attempt payment
    await page.getByText('Premium').click();
    await page.getByRole('button', { name: /Pay \$20/ }).click();

    // Should show payment failure message
    await expect(page.getByText('Your card was declined.')).toBeVisible();
  });

  test('should update package selection correctly', async ({ page }) => {
    await page.goto('/purchase');

    // Select basic first
    await page.getByText('Basic').click();
    await expect(page.getByText('You are purchasing 100 tokens for $5')).toBeVisible();

    // Change to premium
    await page.getByText('Premium').click();
    await expect(page.getByText('You are purchasing 600 tokens for $20')).toBeVisible();

    // Verify button text updates
    await expect(page.getByRole('button', { name: /Pay \$20/ })).toBeVisible();
  });

  test('should show loading state during payment processing', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/create-payment-intent', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_PAYMENT_INTENT_RESPONSE)
      });
    });

    await page.goto('/purchase');

    // Select package
    await page.getByText('Basic').click();

    // Click pay button
    await page.getByRole('button', { name: /Pay \$5/ }).click();

    // Should show processing state
    await expect(page.getByText('Processing...')).toBeVisible();

    // Button should be disabled
    const payButton = page.getByRole('button', { name: /Processing/ });
    await expect(payButton).toBeDisabled();
  });

  test('should display current token balance', async ({ page }) => {
    // Mock token balance API
    await page.route('**/rest/v1/user_profiles*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          tokens: 75
        })
      });
    });

    await page.goto('/purchase');

    // Should show current balance
    await expect(page.getByText('Current balance:')).toBeVisible();
    await expect(page.getByText('75 tokens')).toBeVisible();
  });

  test('should handle authentication requirements', async ({ page }) => {
    // Clear authentication
    await page.evaluate(() => {
      window.localStorage.removeItem('sb-test-auth-token');
    });

    await page.goto('/purchase');

    // Should redirect to login or show auth required message
    // This depends on your auth implementation
    await expect(page.url()).toContain('login');
  });

  test('should be accessible via keyboard navigation', async ({ page }) => {
    await page.goto('/purchase');

    // Navigate through packages with keyboard
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Select package with Enter
    await page.keyboard.press('Enter');

    // Should show checkout form
    await expect(page.getByText('Complete Purchase')).toBeVisible();

    // Navigate to pay button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Verify pay button is focused
    const payButton = page.getByRole('button', { name: /Pay \$/ });
    await expect(payButton).toBeFocused();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('**/api/create-payment-intent', (route) => {
      route.abort('failed');
    });

    await page.goto('/purchase');

    // Select package and attempt payment
    await page.getByText('Basic').click();
    await page.getByRole('button', { name: /Pay \$5/ }).click();

    // Should show network error message
    await expect(page.getByText(/error/i)).toBeVisible();
  });

  test('should validate package selection', async ({ page }) => {
    await page.goto('/purchase');

    // Should not show checkout form without selection
    await expect(page.getByText('Complete Purchase')).not.toBeVisible();

    // Select package
    await page.getByText('Standard').click();

    // Now should show checkout form
    await expect(page.getByText('Complete Purchase')).toBeVisible();
  });

  test('should calculate pricing correctly', async ({ page }) => {
    await page.goto('/purchase');

    // Check pricing per 100 tokens calculations
    await expect(page.getByText('$5.0 per 100 tokens')).toBeVisible(); // Basic
    await expect(page.getByText('$4.0 per 100 tokens')).toBeVisible(); // Standard
    await expect(page.getByText('$3.3 per 100 tokens')).toBeVisible(); // Premium
  });

  test('should highlight most popular package', async ({ page }) => {
    await page.goto('/purchase');

    // Should show "Most Popular" badge on standard package
    await expect(page.getByText('Most Popular')).toBeVisible();

    // Badge should be near Standard package
    const standardCard = page.getByText('Standard').locator('..');
    await expect(standardCard.getByText('Most Popular')).toBeVisible();
  });
});

test.describe('Token Balance Component', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      window.localStorage.setItem('sb-test-auth-token', JSON.stringify({
        access_token: 'mock-token',
        user: { id: 'user-123', email: 'test@example.com' }
      }));
    });
  });

  test('should display token balance correctly', async ({ page }) => {
    // Mock balance API
    await page.route('**/rest/v1/user_profiles*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          tokens: 150
        })
      });
    });

    await page.goto('/profile'); // Assuming balance is shown on profile page

    await expect(page.getByText('150 tokens')).toBeVisible();
    await expect(page.getByText('Token Balance')).toBeVisible();
  });

  test('should show loading state', async ({ page }) => {
    // Mock slow API response
    await page.route('**/rest/v1/user_profiles*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ tokens: 100 })
      });
    });

    await page.goto('/profile');

    // Should show loading spinner
    await expect(page.locator('[data-testid="lucide-loader"]')).toBeVisible();
  });

  test('should link to purchase page', async ({ page }) => {
    // Mock balance API
    await page.route('**/rest/v1/user_profiles*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ tokens: 50 })
      });
    });

    await page.goto('/profile');

    // Click purchase button
    await page.getByRole('link', { name: /Purchase More Tokens/ }).click();

    // Should navigate to purchase page
    await page.waitForURL('**/purchase');
  });
});

test.describe('Real-time Updates', () => {
  test('should update balance in real-time after purchase', async ({ page }) => {
    // Mock successful payment and real-time update
    await page.route('**/api/create-payment-intent', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_PAYMENT_INTENT_RESPONSE)
      });
    });

    // Mock initial balance
    await page.route('**/rest/v1/user_profiles*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ tokens: 50 })
      });
    });

    await page.goto('/purchase');

    // Check initial balance
    await expect(page.getByText('50 tokens')).toBeVisible();

    // Make purchase
    await page.getByText('Basic').click();
    await page.getByRole('button', { name: /Pay \$5/ }).click();

    // Wait for success
    await expect(page.getByText('Payment successful!')).toBeVisible();

    // Mock updated balance for refetch
    await page.route('**/rest/v1/user_profiles*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ tokens: 150 }) // 50 + 100
      });
    });

    // Balance should update (might need to wait for refetch)
    await expect(page.getByText('150 tokens')).toBeVisible({ timeout: 5000 });
  });
});