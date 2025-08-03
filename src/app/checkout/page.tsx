'use client';

import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate payment processing
    toast({
      title: 'Processing Payment...',
      description: 'Please wait while we process your order.',
    });
    setTimeout(() => {
      clearCart();
      router.push('/checkout/success');
    }, 1500);
  };

  if (items.length === 0) {
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
              <CardTitle className="font-headline text-2xl">Shipping & Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <form id="payment-form" onSubmit={handlePayment} className="space-y-6">
                <fieldset className="space-y-4">
                  <legend className="font-semibold text-lg mb-2">Shipping Information</legend>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Jane Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Glow St" required />
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" placeholder="Beautyville" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input id="state" placeholder="CA" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="zip">ZIP Code</Label>
                            <Input id="zip" placeholder="90210" required />
                        </div>
                    </div>
                </fieldset>
                
                <fieldset className="space-y-4">
                  <legend className="font-semibold text-lg mb-2">Payment Details (Simulated)</legend>
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="**** **** **** 1234" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry</Label>
                      <Input id="expiry" placeholder="MM/YY" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" required />
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
                  <p className="font-semibold">${((item.product.salePrice ?? item.product.price) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex-col items-stretch space-y-4">
                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                </div>
                <Button type="submit" form="payment-form" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Pay Now
                </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
