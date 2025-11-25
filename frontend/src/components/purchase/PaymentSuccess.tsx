import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTokens } from '@/hooks/useTokens';
import { CheckCircle, ArrowRight, Coins, RefreshCw } from 'lucide-react';

export const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { balance, refetchBalance } = useTokens();
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    // Retry fetching the balance multiple times with delays
    // to ensure webhook has processed
    const fetchUpdatedBalance = async () => {
      setIsRefreshing(true);
      let retries = 0;
      const maxRetries = 5;

      const attemptFetch = async () => {
        await refetchBalance();
        retries++;

        // Keep trying for up to 5 seconds (5 attempts with 1 second delays)
        if (retries < maxRetries) {
          setTimeout(attemptFetch, 1000);
        } else {
          setIsRefreshing(false);
        }
      };

      // Initial delay to let webhook process
      setTimeout(attemptFetch, 500);
    };

    fetchUpdatedBalance();
  }, []);

  const tokens = location.state?.tokens || 0;

  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Your tokens have been added to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="h-5 w-5" />
              <span className="text-lg font-semibold">{tokens} tokens added</span>
            </div>
            <p className="text-sm text-muted-foreground">
              New balance: {isRefreshing ? (
                <span className="inline-flex items-center gap-1">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Updating...
                </span>
              ) : (
                `${balance} tokens`
              )}
            </p>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={() => navigate('/')}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Continue to Chat
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/purchase')}
            >
              Purchase More Tokens
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              You can view your transaction history in your{' '}
              <Link to="/profile" className="text-primary hover:underline">
                profile
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};