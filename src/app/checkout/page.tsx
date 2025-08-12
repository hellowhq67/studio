'use client';

import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/hooks/useCurrency';
import { useAuth } from '@/hooks/useAuth';
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';


// It's best to load Stripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) 
    : Promise.resolve(null);

const StripeCheckoutForm = ({ clientSecret }: { clientSecret: string }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);
    const { clearCart } = useCart();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            return;
        }

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL where the customer should be redirected after the PaymentIntent is confirmed.
                return_url: `${window.location.origin}/checkout/success`,
            },
            redirect: 'if_required', // Don't redirect immediately
        });

        if (error) {
            toast({
                variant: 'destructive',
                title: 'Payment Failed',
                description: error.message,
            });
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            toast({
                title: 'Payment Successful!',
                description: 'Your order has been placed.',
            });
            clearCart();
            router.push('/checkout/success');
        } else {
             toast({
                variant: 'destructive',
                title: 'Payment Failed',
                description: 'An unexpected error occurred.',
            });
            setIsProcessing(false);
        }
    };

    return (
        <form id="stripe-payment-form" onSubmit={handleSubmit}>
            <PaymentElement />
             <Button type="submit" size="lg" className="w-full mt-6 bg-accent text-accent-foreground hover:bg-accent/90" disabled={isProcessing || !stripe || !elements}>
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isProcessing ? 'Processing...' : `Pay Now`}
            </Button>
        </form>
    );
};


export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { formatPrice, currency, exchangeRate } = useCurrency();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const getShippingAddress = (form: HTMLFormElement) => {
      const formData = new FormData(form);
      return {
          name: formData.get('name') as string,
          address: formData.get('address') as string,
          city: formData.get('city') as string,
          state: formData.get('state') as string,
          zip: formData.get('zip') as string,
          country: currency === 'BDT' ? 'Bangladesh' : 'United States', 
      };
  }
  
  const handleSslCommerzPayment = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsProcessing(true);
      
      const shippingAddress = getShippingAddress(e.target as HTMLFormElement);

      const paymentData = {
        total_amount: cartTotal * exchangeRate, // Convert to BDT
        currency: 'BDT',
        cus_name: shippingAddress.name,
        cus_email: user!.email,
        cus_add1: shippingAddress.address,
        cus_city: shippingAddress.city,
        cus_state: shippingAddress.state,
        cus_postcode: shippingAddress.zip,
        cus_country: shippingAddress.country,
        cus_phone: '01711111111', 
        shipping_method: 'Courier',
        product_name: items.map(i => i.product.name).join(', '),
        product_category: 'Beauty',
        product_profile: 'general',
        value_a: JSON.stringify(items.map(item => ({productId: item.product.id, quantity: item.quantity, price: (item.product.salePrice ?? item.product.price) * exchangeRate }))),
        value_b: JSON.stringify(shippingAddress),
        value_c: user!.uid,
      };

      try {
         toast({
            title: 'Redirecting to Payment...',
            description: 'You will be redirected to SSLCommerz to complete your payment.',
          });

        const response = await fetch('/api/checkout/sslcommerz/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paymentData),
        });

        const data = await response.json();

        if (data.GatewayPageURL) {
          window.location.href = data.GatewayPageURL;
        } else {
          throw new Error(data.message || 'Failed to initialize payment.');
        }

      } catch (error: any) {
          console.error('Payment initialization error:', error);
           toast({
              variant: 'destructive',
              title: 'Payment Failed',
              description: error.message || 'There was a problem initiating the payment. Please try again.',
          });
          setIsProcessing(false);
      }
  }

  const handleStripePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const shippingAddress = getShippingAddress(e.target as HTMLFormElement);

    try {
        const response = await fetch('/api/checkout/stripe/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: Math.round(cartTotal * 100), // Stripe requires amount in cents
                currency: 'usd',
                items: items.map(item => ({productId: item.product.id, quantity: item.quantity, price: item.product.salePrice ?? item.product.price})),
                shippingAddress: shippingAddress,
                firebaseUid: user!.uid,
            }),
        });

        if (!response.ok) {
           const { error } = await response.json();
           throw new Error(error || 'Failed to create payment intent.');
        }
        
        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: error.message,
        });
    } finally {
        setIsProcessing(false);
    }
  }


  const handlePayment = async (e: React.FormEvent) => {
     if (!user) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'You must be logged in to place an order.',
        });
        setIsProcessing(false);
        return;
    }

    if (currency === 'BDT') {
        await handleSslCommerzPayment(e);
    } else {
        await handleStripePayment(e);
    }
  };


  if (items.length === 0 && !isProcessing) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="font-headline text-4xl">Your Cart is Empty</h1>
            <p className="mt-4 text-muted-foreground">You can't checkout with an empty cart.</p>
            <Button asChild className="mt-6">
                <a href="/">Continue Shopping</a>
            </Button>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-headline text-4xl text-center mb-8">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form id="payment-form" onSubmit={handlePayment} className="space-y-6">
                <fieldset className="space-y-4" disabled={!!clientSecret}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" defaultValue={user?.displayName || ''} placeholder="Jane Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" placeholder="123 Glow St" required />
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" name="city" placeholder="Beautyville" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State / Division</Label>
                            <Input id="state" name="state" placeholder={currency === 'BDT' ? 'Dhaka' : 'CA'} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="zip">ZIP Code</Label>
                            <Input id="zip" name="zip" placeholder={currency === 'BDT' ? '1212' : '90210'} required />
                        </div>
                    </div>
                </fieldset>
              </form>
            </CardContent>
          </Card>
           {currency === 'USD' && (
             <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Payment Details</CardTitle>
                </CardHeader>
                <CardContent>
                    {stripePromise && clientSecret ? (
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                           <StripeCheckoutForm clientSecret={clientSecret} />
                        </Elements>
                    ) : (
                       <p className="text-muted-foreground">Please fill out your shipping information to proceed to payment.</p>
                    )}
                </CardContent>
             </Card>
           )}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">{formatPrice((item.product.salePrice ?? item.product.price) * item.quantity)}</p>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex-col items-stretch space-y-4">
                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(cartTotal)}</span>
                </div>
                {currency === 'BDT' ? (
                     <Button type="submit" form="payment-form" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isProcessing ? 'Processing...' : `Pay with SSLCommerz`}
                    </Button>
                ) : clientSecret ? (
                    <Button type="submit" form="stripe-payment-form" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        Pay Now
                    </Button>
                ) : (
                    <Button type="submit" form="payment-form" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isProcessing ? 'Processing...' : `Continue to Payment`}
                    </Button>
                )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
