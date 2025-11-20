import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTokens } from '../useTokens';
import { useAuth } from '../useAuth';
import { supabase } from '../../lib/supabase';

// Mock dependencies
vi.mock('../useAuth');
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    channel: vi.fn(),
  },
}));

const mockUseAuth = vi.mocked(useAuth);
const mockSupabase = vi.mocked(supabase);

describe('useTokens', () => {
  const mockUser = { id: 'user-123', email: 'test@example.com' };
  let mockChannel: any;
  let mockUnsubscribe: any;

  beforeEach(() => {
    mockUnsubscribe = vi.fn();
    mockChannel = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnValue(mockChannel),
      unsubscribe: mockUnsubscribe,
    };

    mockSupabase.channel.mockReturnValue(mockChannel);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Token Balance Fetching', () => {
    it('should fetch token balance successfully', async () => {
      mockUseAuth.mockReturnValue({ user: mockUser });

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue({
          data: { tokens: 150 },
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockFrom);

      const { result } = renderHook(() => useTokens());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.balance).toBe(150);
      expect(result.current.error).toBe(null);
      expect(mockSupabase.from).toHaveBeenCalledWith('user_profiles');
    });

    it('should handle balance fetch error', async () => {
      mockUseAuth.mockReturnValue({ user: mockUser });

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        execute: vi.fn().mockRejectedValue(new Error('Database error')),
      };

      mockSupabase.from.mockReturnValue(mockFrom);

      const { result } = renderHook(() => useTokens());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.balance).toBe(0);
      expect(result.current.error).toBe('Failed to fetch token balance');
    });

    it('should not fetch balance when user is not authenticated', async () => {
      mockUseAuth.mockReturnValue({ user: null });

      const { result } = renderHook(() => useTokens());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockSupabase.from).not.toHaveBeenCalled();
      expect(result.current.balance).toBe(0);
    });
  });

  describe('Transaction History', () => {
    it('should fetch transaction history successfully', async () => {
      mockUseAuth.mockReturnValue({ user: mockUser });

      const mockTransactions = [
        {
          id: 'trans-1',
          user_id: 'user-123',
          transaction_type: 'purchase',
          token_amount: 100,
          created_at: '2023-01-01T00:00:00Z',
          details: { source: 'stripe_purchase' },
        },
        {
          id: 'trans-2',
          user_id: 'user-123',
          transaction_type: 'usage',
          token_amount: -1,
          created_at: '2023-01-02T00:00:00Z',
          details: { reason: 'agent_interaction' },
        },
      ];

      const mockFromBalance = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue({ data: { tokens: 99 }, error: null }),
      };

      const mockFromTransactions = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue({ data: mockTransactions, error: null }),
      };

      mockSupabase.from
        .mockReturnValueOnce(mockFromBalance) // First call for balance
        .mockReturnValueOnce(mockFromTransactions); // Second call for transactions

      const { result } = renderHook(() => useTokens());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.transactions).toEqual(mockTransactions);
      expect(result.current.transactions).toHaveLength(2);
      expect(result.current.transactions[0].transaction_type).toBe('purchase');
    });

    it('should handle transaction fetch error', async () => {
      mockUseAuth.mockReturnValue({ user: mockUser });

      const mockFromBalance = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue({ data: { tokens: 100 }, error: null }),
      };

      const mockFromTransactions = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        execute: vi.fn().mockRejectedValue(new Error('Database error')),
      };

      mockSupabase.from
        .mockReturnValueOnce(mockFromBalance)
        .mockReturnValueOnce(mockFromTransactions);

      const { result } = renderHook(() => useTokens());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.transactions).toEqual([]);
      expect(result.current.error).toBe('Failed to fetch transaction history');
    });
  });

  describe('Real-time Subscriptions', () => {
    it('should set up real-time subscriptions for balance and transactions', async () => {
      mockUseAuth.mockReturnValue({ user: mockUser });

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      mockSupabase.from.mockReturnValue(mockFrom);

      renderHook(() => useTokens());

      await waitFor(() => {
        expect(mockSupabase.channel).toHaveBeenCalledWith(`token_balance_${mockUser.id}`);
        expect(mockSupabase.channel).toHaveBeenCalledWith(`transactions_${mockUser.id}`);
      });

      expect(mockChannel.on).toHaveBeenCalledWith(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_profiles',
          filter: `id=eq.${mockUser.id}`,
        },
        expect.any(Function)
      );

      expect(mockChannel.on).toHaveBeenCalledWith(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${mockUser.id}`,
        },
        expect.any(Function)
      );
    });

    it('should update balance on real-time events', async () => {
      mockUseAuth.mockReturnValue({ user: mockUser });

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue({ data: { tokens: 100 }, error: null }),
      };

      mockSupabase.from.mockReturnValue(mockFrom);

      let balanceUpdateCallback: Function;
      mockChannel.on.mockImplementation((event, config, callback) => {
        if (config.table === 'user_profiles') {
          balanceUpdateCallback = callback;
        }
        return mockChannel;
      });

      const { result } = renderHook(() => useTokens());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Simulate real-time balance update
      balanceUpdateCallback!({ new: { tokens: 150 } });

      expect(result.current.balance).toBe(150);
    });

    it('should add new transactions on real-time events', async () => {
      mockUseAuth.mockReturnValue({ user: mockUser });

      const initialTransactions = [
        {
          id: 'trans-1',
          user_id: 'user-123',
          transaction_type: 'purchase',
          token_amount: 100,
          created_at: '2023-01-01T00:00:00Z',
        },
      ];

      const mockFromBalance = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue({ data: { tokens: 100 }, error: null }),
      };

      const mockFromTransactions = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue({ data: initialTransactions, error: null }),
      };

      mockSupabase.from
        .mockReturnValueOnce(mockFromBalance)
        .mockReturnValueOnce(mockFromTransactions);

      let transactionInsertCallback: Function;
      mockChannel.on.mockImplementation((event, config, callback) => {
        if (config.table === 'transactions') {
          transactionInsertCallback = callback;
        }
        return mockChannel;
      });

      const { result } = renderHook(() => useTokens());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Simulate new transaction
      const newTransaction = {
        id: 'trans-2',
        user_id: 'user-123',
        transaction_type: 'usage',
        token_amount: -1,
        created_at: '2023-01-02T00:00:00Z',
      };

      transactionInsertCallback!({ new: newTransaction });

      expect(result.current.transactions).toHaveLength(2);
      expect(result.current.transactions[0]).toEqual(newTransaction);
    });

    it('should unsubscribe from channels on unmount', async () => {
      mockUseAuth.mockReturnValue({ user: mockUser });

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      mockSupabase.from.mockReturnValue(mockFrom);

      const { unmount } = renderHook(() => useTokens());

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalledTimes(2); // Balance + transactions channels
    });
  });

  describe('Refetch Functions', () => {
    it('should provide refetch functions that work correctly', async () => {
      mockUseAuth.mockReturnValue({ user: mockUser });

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        execute: vi.fn()
          .mockResolvedValueOnce({ data: { tokens: 100 }, error: null }) // Initial balance
          .mockResolvedValueOnce({ data: [], error: null }) // Initial transactions
          .mockResolvedValueOnce({ data: { tokens: 150 }, error: null }), // Refetched balance
      };

      mockSupabase.from.mockReturnValue(mockFrom);

      const { result } = renderHook(() => useTokens());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.balance).toBe(100);

      // Test refetch balance
      await result.current.refetchBalance();

      expect(result.current.balance).toBe(150);
      expect(mockFrom.execute).toHaveBeenCalledTimes(3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing token field in balance data', async () => {
      mockUseAuth.mockReturnValue({ user: mockUser });

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue({
          data: {}, // No tokens field
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockFrom);

      const { result } = renderHook(() => useTokens());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.balance).toBe(0);
    });

    it('should handle null data in balance response', async () => {
      mockUseAuth.mockReturnValue({ user: mockUser });

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockFrom);

      const { result } = renderHook(() => useTokens());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.balance).toBe(0);
    });

    it('should handle user change during subscription', async () => {
      const { rerender } = renderHook(
        ({ user }) => {
          mockUseAuth.mockReturnValue({ user });
          return useTokens();
        },
        { initialProps: { user: mockUser } }
      );

      // Change user
      rerender({ user: { id: 'user-456', email: 'other@example.com' } });

      // Should set up new subscriptions for new user
      expect(mockSupabase.channel).toHaveBeenCalledWith('token_balance_user-456');
      expect(mockSupabase.channel).toHaveBeenCalledWith('transactions_user-456');
    });
  });
});