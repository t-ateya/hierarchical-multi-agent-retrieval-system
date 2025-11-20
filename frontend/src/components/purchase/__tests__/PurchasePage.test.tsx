import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { PurchasePage } from '../PurchasePage';
import { useAuth } from '../../../hooks/useAuth';
import { useTokens } from '../../../hooks/useTokens';
import { useToast } from '../../../hooks/use-toast';

// Mock dependencies
vi.mock('../../../hooks/useAuth');
vi.mock('../../../hooks/useTokens');
vi.mock('../../../hooks/use-toast');
vi.mock('@stripe/stripe-js');
vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: { children: React.ReactNode }) => <div data-testid="stripe-elements">{children}</div>,
  CardElement: () => <div data-testid="card-element">Mock Card Element</div>,
  useStripe: () => ({
    confirmCardPayment: vi.fn(),
  }),
  useElements: () => ({
    getElement: vi.fn().mockReturnValue({}),
  }),
}));

const mockUseAuth = vi.mocked(useAuth);
const mockUseTokens = vi.mocked(useTokens);
const mockUseToast = vi.mocked(useToast);

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock fetch
global.fetch = vi.fn();

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PurchasePage', () => {
  const mockSession = {
    access_token: 'mock-token',
    user: { id: 'user-123' },
  };

  const mockToast = vi.fn();

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      session: mockSession,
      user: { id: 'user-123' },
    });

    mockUseTokens.mockReturnValue({
      balance: 50,
      transactions: [],
      loading: false,
      error: null,
      refetchBalance: vi.fn(),
      refetchTransactions: vi.fn(),
    });

    mockUseToast.mockReturnValue({
      toast: mockToast,
    });

    // Mock environment variable
    vi.stubEnv('VITE_AGENT_ENDPOINT', 'http://localhost:8001');
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  describe('Package Selection', () => {
    it('should render all token packages', () => {
      renderWithRouter(<PurchasePage />);

      expect(screen.getByText('Basic')).toBeInTheDocument();
      expect(screen.getByText('Standard')).toBeInTheDocument();
      expect(screen.getByText('Premium')).toBeInTheDocument();

      expect(screen.getByText('100')).toBeInTheDocument(); // Basic tokens
      expect(screen.getByText('250')).toBeInTheDocument(); // Standard tokens
      expect(screen.getByText('600')).toBeInTheDocument(); // Premium tokens

      expect(screen.getByText('$5')).toBeInTheDocument(); // Basic price
      expect(screen.getByText('$10')).toBeInTheDocument(); // Standard price
      expect(screen.getByText('$20')).toBeInTheDocument(); // Premium price
    });

    it('should display current token balance', () => {
      renderWithRouter(<PurchasePage />);

      expect(screen.getByText('Current balance:')).toBeInTheDocument();
      expect(screen.getByText('50 tokens')).toBeInTheDocument();
    });

    it('should highlight most popular package', () => {
      renderWithRouter(<PurchasePage />);

      expect(screen.getByText('Most Popular')).toBeInTheDocument();
    });

    it('should allow package selection', () => {
      renderWithRouter(<PurchasePage />);

      const basicPackage = screen.getByText('Basic').closest('div[class*="cursor-pointer"]');
      fireEvent.click(basicPackage!);

      expect(screen.getByText('Complete Purchase')).toBeInTheDocument();
      expect(screen.getByText('You are purchasing 100 tokens for $5')).toBeInTheDocument();
    });

    it('should show checkout form when package is selected', () => {
      renderWithRouter(<PurchasePage />);

      const standardPackage = screen.getByText('Standard').closest('div[class*="cursor-pointer"]');
      fireEvent.click(standardPackage!);

      expect(screen.getByTestId('stripe-elements')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Pay \$10/i })).toBeInTheDocument();
    });

    it('should update package selection', () => {
      renderWithRouter(<PurchasePage />);

      // Select basic first
      const basicPackage = screen.getByText('Basic').closest('div[class*="cursor-pointer"]');
      fireEvent.click(basicPackage!);
      expect(screen.getByText('You are purchasing 100 tokens for $5')).toBeInTheDocument();

      // Change to premium
      const premiumPackage = screen.getByText('Premium').closest('div[class*="cursor-pointer"]');
      fireEvent.click(premiumPackage!);
      expect(screen.getByText('You are purchasing 600 tokens for $20')).toBeInTheDocument();
    });
  });

  describe('Payment Processing', () => {
    it('should create payment intent and process payment', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          client_secret: 'pi_test_secret',
        }),
      } as Response);

      // Mock Stripe
      const mockConfirmCardPayment = vi.fn().mockResolvedValue({
        paymentIntent: {
          id: 'pi_test_123',
          status: 'succeeded',
        },
      });

      vi.doMock('@stripe/react-stripe-js', () => ({
        Elements: ({ children }: { children: React.ReactNode }) => children,
        CardElement: () => <div data-testid="card-element">Mock Card Element</div>,
        useStripe: () => ({
          confirmCardPayment: mockConfirmCardPayment,
        }),
        useElements: () => ({
          getElement: vi.fn().mockReturnValue({}),
        }),
      }));

      renderWithRouter(<PurchasePage />);

      // Select package
      const basicPackage = screen.getByText('Basic').closest('div[class*="cursor-pointer"]');
      fireEvent.click(basicPackage!);

      // Submit form
      const payButton = screen.getByRole('button', { name: /Pay \$5/i });
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:8001/api/create-payment-intent',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer mock-token',
            },
            body: JSON.stringify({
              token_package: 'basic',
            }),
          })
        );
      });
    });

    it('should handle payment intent creation failure', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      } as Response);

      renderWithRouter(<PurchasePage />);

      // Select package and submit
      const basicPackage = screen.getByText('Basic').closest('div[class*="cursor-pointer"]');
      fireEvent.click(basicPackage!);

      const payButton = screen.getByRole('button', { name: /Pay \$5/i });
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Error',
          description: 'Failed to create payment intent',
          variant: 'destructive',
        });
      });
    });

    it('should handle Stripe payment failure', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          client_secret: 'pi_test_secret',
        }),
      } as Response);

      const mockConfirmCardPayment = vi.fn().mockResolvedValue({
        error: {
          message: 'Your card was declined.',
        },
      });

      vi.doMock('@stripe/react-stripe-js', () => ({
        Elements: ({ children }: { children: React.ReactNode }) => children,
        CardElement: () => <div data-testid="card-element">Mock Card Element</div>,
        useStripe: () => ({
          confirmCardPayment: mockConfirmCardPayment,
        }),
        useElements: () => ({
          getElement: vi.fn().mockReturnValue({}),
        }),
      }));

      renderWithRouter(<PurchasePage />);

      // Select package and submit
      const basicPackage = screen.getByText('Basic').closest('div[class*="cursor-pointer"]');
      fireEvent.click(basicPackage!);

      const payButton = screen.getByRole('button', { name: /Pay \$5/i });
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Payment failed',
          description: 'Your card was declined.',
          variant: 'destructive',
        });
      });
    });

    it('should handle successful payment', async () => {
      const mockRefetchBalance = vi.fn();
      mockUseTokens.mockReturnValue({
        balance: 50,
        transactions: [],
        loading: false,
        error: null,
        refetchBalance: mockRefetchBalance,
        refetchTransactions: vi.fn(),
      });

      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          client_secret: 'pi_test_secret',
        }),
      } as Response);

      const mockConfirmCardPayment = vi.fn().mockResolvedValue({
        paymentIntent: {
          id: 'pi_test_123',
          status: 'succeeded',
        },
      });

      vi.doMock('@stripe/react-stripe-js', () => ({
        Elements: ({ children }: { children: React.ReactNode }) => children,
        CardElement: () => <div data-testid="card-element">Mock Card Element</div>,
        useStripe: () => ({
          confirmCardPayment: mockConfirmCardPayment,
        }),
        useElements: () => ({
          getElement: vi.fn().mockReturnValue({}),
        }),
      }));

      renderWithRouter(<PurchasePage />);

      // Select package and submit
      const basicPackage = screen.getByText('Basic').closest('div[class*="cursor-pointer"]');
      fireEvent.click(basicPackage!);

      const payButton = screen.getByRole('button', { name: /Pay \$5/i });
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Payment successful!',
          description: '100 tokens have been added to your account.',
        });
      });

      // Should refetch balance after delay
      await waitFor(() => {
        expect(mockRefetchBalance).toHaveBeenCalled();
      }, { timeout: 2000 });

      expect(mockNavigate).toHaveBeenCalledWith('/payment/success', {
        state: {
          paymentIntentId: 'pi_test_123',
          tokens: 100,
        },
      });
    });

    it('should disable pay button while processing', async () => {
      renderWithRouter(<PurchasePage />);

      // Select package
      const basicPackage = screen.getByText('Basic').closest('div[class*="cursor-pointer"]');
      fireEvent.click(basicPackage!);

      const payButton = screen.getByRole('button', { name: /Pay \$5/i });
      expect(payButton).not.toBeDisabled();

      // Mock slow response to test loading state
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

      fireEvent.click(payButton);

      // Should show processing state
      expect(screen.getByText('Processing...')).toBeInTheDocument();
      expect(payButton).toBeDisabled();
    });

    it('should not submit without package selection', () => {
      renderWithRouter(<PurchasePage />);

      // No package selected, should not show checkout form
      expect(screen.queryByText('Complete Purchase')).not.toBeInTheDocument();
    });

    it('should not submit without authentication', () => {
      mockUseAuth.mockReturnValue({
        session: null,
        user: null,
      });

      renderWithRouter(<PurchasePage />);

      // Select package
      const basicPackage = screen.getByText('Basic').closest('div[class*="cursor-pointer"]');
      fireEvent.click(basicPackage!);

      const payButton = screen.getByRole('button', { name: /Pay \$5/i });
      fireEvent.click(payButton);

      // Should not make any API calls
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  describe('Package Pricing Display', () => {
    it('should display correct pricing per 100 tokens', () => {
      renderWithRouter(<PurchasePage />);

      // Basic: $5 for 100 tokens = $5.0 per 100 tokens
      expect(screen.getByText('$5.0 per 100 tokens')).toBeInTheDocument();

      // Standard: $10 for 250 tokens = $4.0 per 100 tokens
      expect(screen.getByText('$4.0 per 100 tokens')).toBeInTheDocument();

      // Premium: $20 for 600 tokens = $3.3 per 100 tokens
      expect(screen.getByText('$3.3 per 100 tokens')).toBeInTheDocument();
    });

    it('should show check mark for selected package', () => {
      renderWithRouter(<PurchasePage />);

      // Initially no check mark
      expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();

      // Select basic package
      const basicPackage = screen.getByText('Basic').closest('div[class*="cursor-pointer"]');
      fireEvent.click(basicPackage!);

      // Should show check mark
      const checkIcons = screen.getAllByTestId('lucide-check');
      expect(checkIcons.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      renderWithRouter(<PurchasePage />);

      // Select package and submit
      const basicPackage = screen.getByText('Basic').closest('div[class*="cursor-pointer"]');
      fireEvent.click(basicPackage!);

      const payButton = screen.getByRole('button', { name: /Pay \$5/i });
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Error',
          description: 'Network error',
          variant: 'destructive',
        });
      });
    });

    it('should handle missing Stripe configuration', () => {
      // Mock missing environment variable
      vi.stubEnv('VITE_STRIPE_PUBLISHABLE_KEY', '');

      renderWithRouter(<PurchasePage />);

      // Should still render but Stripe won't work
      expect(screen.getByText('Purchase Tokens')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      renderWithRouter(<PurchasePage />);

      // Check for proper button roles
      const packageCards = screen.getAllByRole('button');
      expect(packageCards.length).toBeGreaterThan(0);

      // Check for form elements
      const basicPackage = screen.getByText('Basic').closest('div[class*="cursor-pointer"]');
      fireEvent.click(basicPackage!);

      const payButton = screen.getByRole('button', { name: /Pay \$5/i });
      expect(payButton).toBeInTheDocument();
    });

    it('should be keyboard navigable', () => {
      renderWithRouter(<PurchasePage />);

      // Package cards should be focusable
      const basicCard = screen.getByText('Basic').closest('div[class*="cursor-pointer"]');
      expect(basicCard).toBeVisible();

      // After selection, pay button should be focusable
      fireEvent.click(basicCard!);
      const payButton = screen.getByRole('button', { name: /Pay \$5/i });
      expect(payButton).toBeVisible();
    });
  });
});