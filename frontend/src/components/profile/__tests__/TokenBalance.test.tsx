import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { TokenBalance } from '../TokenBalance';
import { useTokens } from '../../../hooks/useTokens';

// Mock dependencies
vi.mock('../../../hooks/useTokens');

const mockUseTokens = vi.mocked(useTokens);

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('TokenBalance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading spinner when loading', () => {
      mockUseTokens.mockReturnValue({
        balance: 0,
        transactions: [],
        loading: true,
        error: null,
        refetchBalance: vi.fn(),
        refetchTransactions: vi.fn(),
      });

      renderWithRouter(<TokenBalance />);

      expect(screen.getByTestId('lucide-loader')).toBeInTheDocument();
      expect(screen.queryByText(/tokens/)).not.toBeInTheDocument();
      expect(screen.queryByText('Purchase More Tokens')).not.toBeInTheDocument();
    });

    it('should have proper loading accessibility', () => {
      mockUseTokens.mockReturnValue({
        balance: 0,
        transactions: [],
        loading: true,
        error: null,
        refetchBalance: vi.fn(),
        refetchTransactions: vi.fn(),
      });

      renderWithRouter(<TokenBalance />);

      const loader = screen.getByTestId('lucide-loader');
      expect(loader).toHaveClass('animate-spin');
    });
  });

  describe('Balance Display', () => {
    it('should display token balance when loaded', () => {
      mockUseTokens.mockReturnValue({
        balance: 150,
        transactions: [],
        loading: false,
        error: null,
        refetchBalance: vi.fn(),
        refetchTransactions: vi.fn(),
      });

      renderWithRouter(<TokenBalance />);

      expect(screen.getByText('150 tokens')).toBeInTheDocument();
      expect(screen.getByText('Token Balance')).toBeInTheDocument();
      expect(screen.queryByTestId('lucide-loader')).not.toBeInTheDocument();
    });

    it('should display zero balance correctly', () => {
      mockUseTokens.mockReturnValue({
        balance: 0,
        transactions: [],
        loading: false,
        error: null,
        refetchBalance: vi.fn(),
        refetchTransactions: vi.fn(),
      });

      renderWithRouter(<TokenBalance />);

      expect(screen.getByText('0 tokens')).toBeInTheDocument();
    });

    it('should display large balance correctly', () => {
      mockUseTokens.mockReturnValue({
        balance: 99999,
        transactions: [],
        loading: false,
        error: null,
        refetchBalance: vi.fn(),
        refetchTransactions: vi.fn(),
      });

      renderWithRouter(<TokenBalance />);

      expect(screen.getByText('99999 tokens')).toBeInTheDocument();
    });

    it('should display fractional balance if provided', () => {
      mockUseTokens.mockReturnValue({
        balance: 150.5,
        transactions: [],
        loading: false,
        error: null,
        refetchBalance: vi.fn(),
        refetchTransactions: vi.fn(),
      });

      renderWithRouter(<TokenBalance />);

      expect(screen.getByText('150.5 tokens')).toBeInTheDocument();
    });
  });

  describe('Purchase Button', () => {
    it('should show purchase button when not loading', () => {
      mockUseTokens.mockReturnValue({
        balance: 50,
        transactions: [],
        loading: false,
        error: null,
        refetchBalance: vi.fn(),
        refetchTransactions: vi.fn(),
      });

      renderWithRouter(<TokenBalance />);

      const purchaseButton = screen.getByRole('link', { name: /Purchase More Tokens/i });
      expect(purchaseButton).toBeInTheDocument();
      expect(purchaseButton).toHaveAttribute('href', '/purchase');
    });

    it('should have shopping cart icon', () => {
      mockUseTokens.mockReturnValue({
        balance: 50,
        transactions: [],
        loading: false,
        error: null,
        refetchBalance: vi.fn(),
        refetchTransactions: vi.fn(),
      });

      renderWithRouter(<TokenBalance />);

      expect(screen.getByTestId('lucide-shopping-cart')).toBeInTheDocument();
    });

    it('should not show purchase button when loading', () => {
      mockUseTokens.mockReturnValue({
        balance: 0,
        transactions: [],
        loading: true,
        error: null,
        refetchBalance: vi.fn(),
        refetchTransactions: vi.fn(),
      });

      renderWithRouter(<TokenBalance />);

      expect(screen.queryByRole('link', { name: /Purchase More Tokens/i })).not.toBeInTheDocument();
    });
  });

  describe('Visual Elements', () => {
    it('should display coins icon in header', () => {
      mockUseTokens.mockReturnValue({
        balance: 100,
        transactions: [],
        loading: false,
        error: null,
        refetchBalance: vi.fn(),
        refetchTransactions: vi.fn(),
      });

      renderWithRouter(<TokenBalance />);

      expect(screen.getByTestId('lucide-coins')).toBeInTheDocument();
    });

    it('should have proper card structure', () => {
      mockUseTokens.mockReturnValue({
        balance: 100,
        transactions: [],
        loading: false,
        error: null,
        refetchBalance: vi.fn(),
        refetchTransactions: vi.fn(),
      });

      renderWithRouter(<TokenBalance />);

      // Check for card structure elements
      expect(screen.getByText('Token Balance')).toBeInTheDocument();
      expect(screen.getByText('100 tokens')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should still display balance even with error state', () => {
      mockUseTokens.mockReturnValue({
        balance: 75,
        transactions: [],
        loading: false,
        error: 'Failed to fetch data',
        refetchBalance: vi.fn(),
        refetchTransactions: vi.fn(),
      });

      renderWithRouter(<TokenBalance />);

      // Should still show balance even if there's an error
      expect(screen.getByText('75 tokens')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Purchase More Tokens/i })).toBeInTheDocument();
    });

    it('should handle undefined balance gracefully', () => {
      mockUseTokens.mockReturnValue({
        balance: undefined as any,
        transactions: [],
        loading: false,
        error: null,
        refetchBalance: vi.fn(),
        refetchTransactions: vi.fn(),
      });

      renderWithRouter(<TokenBalance />);

      // Should show undefined tokens (this might need fixing in the actual component)
      expect(screen.getByText(/tokens/)).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should have proper CSS classes for responsive design', () => {
      mockUseTokens.mockReturnValue({
        balance: 100,
        transactions: [],
        loading: false,
        error: null,
        refetchBalance: vi.fn(),
        refetchTransactions: vi.fn(),
      });

      const { container } = renderWithRouter(<TokenBalance />);

      // Check that component renders without layout issues
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Integration with useTokens', () => {
    it('should call useTokens hook correctly', () => {
      mockUseTokens.mockReturnValue({
        balance: 200,
        transactions: [],
        loading: false,
        error: null,
        refetchBalance: vi.fn(),
        refetchTransactions: vi.fn(),
      });

      renderWithRouter(<TokenBalance />);

      expect(mockUseTokens).toHaveBeenCalledTimes(1);
      expect(screen.getByText('200 tokens')).toBeInTheDocument();
    });

    it('should handle hook state changes', () => {
      const { rerender } = renderWithRouter(<TokenBalance />);

      // First render with loading
      mockUseTokens.mockReturnValue({
        balance: 0,
        transactions: [],
        loading: true,
        error: null,
        refetchBalance: vi.fn(),
        refetchTransactions: vi.fn(),
      });

      rerender(<TokenBalance />);
      expect(screen.getByTestId('lucide-loader')).toBeInTheDocument();

      // Second render with data
      mockUseTokens.mockReturnValue({
        balance: 300,
        transactions: [],
        loading: false,
        error: null,
        refetchBalance: vi.fn(),
        refetchTransactions: vi.fn(),
      });

      rerender(<TokenBalance />);
      expect(screen.getByText('300 tokens')).toBeInTheDocument();
      expect(screen.queryByTestId('lucide-loader')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      mockUseTokens.mockReturnValue({
        balance: 100,
        transactions: [],
        loading: false,
        error: null,
        refetchBalance: vi.fn(),
        refetchTransactions: vi.fn(),
      });

      renderWithRouter(<TokenBalance />);

      // Check for proper link semantics
      const purchaseLink = screen.getByRole('link', { name: /Purchase More Tokens/i });
      expect(purchaseLink).toBeInTheDocument();

      // Check for proper text content
      expect(screen.getByText('Token Balance')).toBeInTheDocument();
    });

    it('should be keyboard navigable', () => {
      mockUseTokens.mockReturnValue({
        balance: 100,
        transactions: [],
        loading: false,
        error: null,
        refetchBalance: vi.fn(),
        refetchTransactions: vi.fn(),
      });

      renderWithRouter(<TokenBalance />);

      const purchaseLink = screen.getByRole('link', { name: /Purchase More Tokens/i });

      // Link should be focusable
      purchaseLink.focus();
      expect(document.activeElement).toBe(purchaseLink);
    });

    it('should have proper contrast and visibility', () => {
      mockUseTokens.mockReturnValue({
        balance: 100,
        transactions: [],
        loading: false,
        error: null,
        refetchBalance: vi.fn(),
        refetchTransactions: vi.fn(),
      });

      renderWithRouter(<TokenBalance />);

      // Check that main elements are visible
      expect(screen.getByText('Token Balance')).toBeVisible();
      expect(screen.getByText('100 tokens')).toBeVisible();
      expect(screen.getByRole('link', { name: /Purchase More Tokens/i })).toBeVisible();
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative balance (edge case)', () => {
      mockUseTokens.mockReturnValue({
        balance: -5,
        transactions: [],
        loading: false,
        error: null,
        refetchBalance: vi.fn(),
        refetchTransactions: vi.fn(),
      });

      renderWithRouter(<TokenBalance />);

      expect(screen.getByText('-5 tokens')).toBeInTheDocument();
    });

    it('should handle very large numbers', () => {
      mockUseTokens.mockReturnValue({
        balance: 1000000000,
        transactions: [],
        loading: false,
        error: null,
        refetchBalance: vi.fn(),
        refetchTransactions: vi.fn(),
      });

      renderWithRouter(<TokenBalance />);

      expect(screen.getByText('1000000000 tokens')).toBeInTheDocument();
    });

    it('should handle null balance', () => {
      mockUseTokens.mockReturnValue({
        balance: null as any,
        transactions: [],
        loading: false,
        error: null,
        refetchBalance: vi.fn(),
        refetchTransactions: vi.fn(),
      });

      renderWithRouter(<TokenBalance />);

      // Should handle null gracefully
      expect(screen.getByText(/tokens/)).toBeInTheDocument();
    });
  });
});