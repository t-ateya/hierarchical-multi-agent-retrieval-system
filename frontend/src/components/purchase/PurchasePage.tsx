import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useTokens } from '@/hooks/useTokens';
import { useToast } from '@/hooks/use-toast';
import { Loader, Coins, Check } from 'lucide-react';
import { createApiUrl } from '@/lib/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface TokenPackage {
  id: 'basic' | 'standard' | 'premium';
  name: string;
  tokens: number;
  price: number;
  popular?: boolean;
}

const packages: TokenPackage[] = [
  { id: 'basic', name: 'Basic', tokens: 100, price: 5 },
  { id: 'standard', name: 'Standard', tokens: 250, price: 10, popular: true },
  { id: 'premium', name: 'Premium', tokens: 600, price: 20 }
];

const CheckoutForm = ({ selectedPackage }: { selectedPackage: TokenPackage | null }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { refetchBalance } = useTokens();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !selectedPackage || !session) {
      return;
    }

    setProcessing(true);

    try {
      // Create payment intent using the helper function
      const response = await fetch(createApiUrl('/api/create-payment-intent'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          token_package: selectedPackage.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { client_secret } = await response.json();

      // Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      });

      if (result.error) {
        toast({
          title: 'Payment failed',
          description: result.error.message,
          variant: 'destructive'
        });
      } else if (result.paymentIntent?.status === 'succeeded') {
        toast({
          title: 'Payment successful!',
          description: `${selectedPackage.tokens} tokens have been added to your account.`
        });

        // Refetch balance after a short delay
        setTimeout(() => {
          refetchBalance();
        }, 1000);

        navigate('/payment/success', {
          state: {
            paymentIntentId: result.paymentIntent.id,
            tokens: selectedPackage.tokens
          }
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Something went wrong',
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      <Button
        type="submit"
        disabled={!stripe || processing || !selectedPackage}
        className="w-full"
      >
        {processing ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${selectedPackage?.price || 0}`
        )}
      </Button>
    </form>
  );
};

export const PurchasePage = () => {
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null);
  const { balance } = useTokens();

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Purchase Tokens</h1>
        <p className="text-muted-foreground">
          Current balance: <span className="font-semibold">{balance} tokens</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`cursor-pointer transition-all ${
              selectedPackage?.id === pkg.id ? 'ring-2 ring-primary' : ''
            } ${pkg.popular ? 'relative' : ''}`}
            onClick={() => setSelectedPackage(pkg)}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Coins className="h-5 w-5" />
                {pkg.name}
              </CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold">{pkg.tokens}</span> tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4">
                <span className="text-2xl font-bold">${pkg.price}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                ${(pkg.price / pkg.tokens * 100).toFixed(1)} per 100 tokens
              </div>
              {selectedPackage?.id === pkg.id && (
                <div className="mt-4">
                  <Check className="h-6 w-6 mx-auto text-primary" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPackage && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Complete Purchase</CardTitle>
            <CardDescription>
              You are purchasing {selectedPackage.tokens} tokens for ${selectedPackage.price}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Elements stripe={stripePromise}>
              <CheckoutForm selectedPackage={selectedPackage} />
            </Elements>
          </CardContent>
        </Card>
      )}
    </div>
  );
};