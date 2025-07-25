import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 flex items-center justify-center">
      <Card className="max-w-md w-full text-center">
        <CardHeader className="items-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
          <CardTitle className="font-headline text-3xl">Payment Successful!</CardTitle>
          <CardDescription>Thank you for your order.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your order has been placed and is being processed. You will receive an email confirmation shortly.
          </p>
          <Button asChild className="mt-6 w-full" variant="outline">
            <Link href="/account">View Order History</Link>
          </Button>
          <Button asChild className="mt-2 w-full">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
