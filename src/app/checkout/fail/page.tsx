// src/app/checkout/fail/page.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutFailPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 flex items-center justify-center">
      <Card className="max-w-md w-full text-center">
        <CardHeader className="items-center">
          <XCircle className="w-16 h-16 text-destructive mb-4" />
          <CardTitle className="font-headline text-3xl">Payment Failed</CardTitle>
          <CardDescription>We were unable to process your payment.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Unfortunately, your order could not be placed. Please try again with a different payment method or contact support if the issue persists.
          </p>
          <Button asChild className="mt-6 w-full" variant="outline">
            <Link href="/checkout">Try Again</Link>
          </Button>
          <Button asChild className="mt-2 w-full">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
