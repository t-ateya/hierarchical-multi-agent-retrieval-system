import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTokens } from '@/hooks/useTokens';
import { Coins, ShoppingCart, Loader } from 'lucide-react';

export const TokenBalance = () => {
  const { balance, loading } = useTokens();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Token Balance</CardTitle>
        <Coins className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold mb-4">{balance} tokens</div>
            <Link to="/purchase">
              <Button className="w-full" size="sm">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Purchase More Tokens
              </Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
};