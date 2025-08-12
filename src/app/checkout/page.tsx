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
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { createOrder } from '@/actions/order-actions';


export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { formatPrice, currency } = useCurrency();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    

    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'You must be logged in to place an order.',
        });
        setIsProcessing(false);
        return;
    }

    if(currency !== 'BDT') {
      toast({
        variant: 'destructive',
        title: 'Currency Not Supported',
        description: 'SSLCommerz only supports BDT. Please switch your currency.',
      });
      setIsProcessing(false);
      return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    const shippingAddress = {
        name: formData.get('name') as string,
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        zip: formData.get('zip') as string,
        country: 'Bangladesh', // SSLCommerz requires country
    }

    const paymentData = {
      total_amount: cartTotal,
      currency: 'BDT',
      cus_name: shippingAddress.name,
      cus_email: user.email,
      cus_add1: shippingAddress.address,
      cus_city: shippingAddress.city,
      cus_state: shippingAddress.state,
      cus_postcode: shippingAddress.zip,
      cus_country: shippingAddress.country,
      cus_phone: '01711111111', // Placeholder, consider adding a phone field
      shipping_method: 'Courier',
      product_name: items.map(i => i.product.name).join(', '),
      product_category: 'Beauty',
      product_profile: 'general',
      // Pass cart and shipping info to be retrieved in the success callback
      value_a: JSON.stringify(items.map(item => ({productId: item.product.id, quantity: item.quantity, price: item.product.salePrice ?? item.product.price}))),
      value_b: JSON.stringify(shippingAddress),
      value_c: user.uid,
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
        // Redirect to SSLCommerz payment page
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
                <fieldset className="space-y-4">
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
                            <Input id="state" name="state" placeholder="Dhaka" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="zip">ZIP Code</Label>
                            <Input id="zip" name="zip" placeholder="1212" required />
                        </div>
                    </div>
                </fieldset>
              </form>
            </CardContent>
          </Card>
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
                <Button type="submit" form="payment-form" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isProcessing ? 'Processing...' : `Pay with SSLCommerz`}
                </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
