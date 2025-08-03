'use client';

import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import CartItemCard from './CartItemCard';
import Link from 'next/link';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';

export default function CartSheetContent() {
  const { items, cartTotal, itemCount, loading } = useCart();
  const { formatPrice } = useCurrency();

  return (
    <>
      <SheetHeader>
        <SheetTitle>My Cart ({itemCount})</SheetTitle>
      </SheetHeader>
      
      <div className="flex flex-col h-full">
        {loading ? (
            <div className="flex items-center justify-center flex-grow">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        ) : items.length > 0 ? (
          <>
            <ScrollArea className="flex-grow pr-4 -mr-4 my-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItemCard key={item.product.id} item={item} />
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto">
              <div className="w-full space-y-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <SheetClose asChild>
                  <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={items.length === 0}>
                      <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center flex-grow">
              <ShoppingBag className="w-20 h-20 text-muted-foreground/50 mb-4" />
            <p className="font-headline text-xl text-muted-foreground">Your cart is empty</p>
            <p className="text-muted-foreground">Add some products to get started.</p>
            <SheetClose asChild>
                  <Button asChild variant="link" className="text-primary mt-4">
                      <Link href="/">Continue Shopping</Link>
                  </Button>
              </SheetClose>
          </div>
        )}
      </div>
    </>
  );
}
