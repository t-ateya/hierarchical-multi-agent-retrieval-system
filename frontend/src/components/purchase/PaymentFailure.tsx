import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, RefreshCw, HelpCircle } from 'lucide-react';

export const PaymentFailure = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const error = location.state?.error || 'Your payment could not be processed';

  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Payment Failed</CardTitle>
          <CardDescription>
            We couldn't process your payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={() => navigate('/purchase')}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/')}
            >
              Return to Chat
            </Button>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <HelpCircle className="h-4 w-4" />
              <span>
                Need help? Contact{' '}
                <a href="mailto:support@example.com" className="text-primary hover:underline">
                  support@example.com
                </a>
              </span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Common issues:</p>
            <ul className="mt-2 space-y-1 text-left">
              <li>• Insufficient funds on your card</li>
              <li>• Card declined by your bank</li>
              <li>• Incorrect card details</li>
              <li>• Network connection issues</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};