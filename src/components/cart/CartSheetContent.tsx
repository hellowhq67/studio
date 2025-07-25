'use client';

import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import CartItemCard from './CartItemCard';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function CartSheetContent() {
  const { items, cartTotal, itemCount } = useCart();

  return (
    <>
      <SheetHeader>
        <SheetTitle className="font-headline text-2xl">My Cart ({itemCount})</SheetTitle>
      </SheetHeader>
      {items.length > 0 ? (
        <div className="flex flex-col h-full">
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
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <SheetClose asChild>
                <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </SheetClose>
            </div>
          </SheetFooter>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
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
    </>
  );
}
