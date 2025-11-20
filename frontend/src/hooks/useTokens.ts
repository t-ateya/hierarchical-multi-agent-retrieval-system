import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface Transaction {
  id: string;
  user_id: string;
  transaction_type: 'purchase' | 'usage';
  token_amount: number;
  stripe_payment_intent_id?: string;
  details: Record<string, any>;
  created_at: string;
}

interface UseTokensReturn {
  balance: number;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refetchBalance: () => Promise<void>;
  refetchTransactions: () => Promise<void>;
}

export const useTokens = (): UseTokensReturn => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('tokens')
        .eq('id', user.id)
        .single();

      if (fetchError) throw fetchError;
      setBalance(data?.tokens || 0);
      setError(null);
    } catch (err) {
      console.error('Error fetching token balance:', err);
      setError('Failed to fetch token balance');
      setBalance(0);
    }
  }, [user?.id]);

  const fetchTransactions = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;
      setTransactions(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transaction history');
      setTransactions([]);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchBalance(), fetchTransactions()]);
      setLoading(false);
    };

    loadData();

    // Subscribe to balance changes
    const balanceChannel = supabase
      .channel(`token_balance_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_profiles',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          if (payload.new && 'tokens' in payload.new) {
            setBalance(payload.new.tokens as number);
          }
        }
      )
      .subscribe();

    // Subscribe to new transactions
    const transactionChannel = supabase
      .channel(`transactions_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.new) {
            setTransactions(prev => [payload.new as Transaction, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      balanceChannel.unsubscribe();
      transactionChannel.unsubscribe();
    };
  }, [user?.id, fetchBalance, fetchTransactions]);

  return {
    balance,
    transactions,
    loading,
    error,
    refetchBalance: fetchBalance,
    refetchTransactions: fetchTransactions
  };
};