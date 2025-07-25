'use client';

import Image from 'next/image';
import type { CartItem } from '@/lib/types';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface CartItemCardProps {
  item: CartItem;
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeItem } = useCart();
  const displayPrice = item.product.salePrice ?? item.product.price;

  return (
    <div className="flex items-start space-x-4 p-2 rounded-lg border border-border">
      <div className="w-20 h-20 relative flex-shrink-0">
        <Image
          src={item.product.images[0]}
          alt={item.product.name}
          fill
          className="rounded-md object-cover"
          data-ai-hint={`${item.product.category} product`}
        />
      </div>
      <div className="flex-grow">
        <p className="font-semibold text-sm">{item.product.name}</p>
        <p className="text-xs text-muted-foreground">{item.product.brand}</p>
        <div className="flex items-center mt-2">
          <Input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value, 10))}
            className="w-16 h-8 text-center"
            aria-label="Quantity"
          />
           <p className="ml-auto font-semibold text-sm">${(displayPrice * item.quantity).toFixed(2)}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive w-8 h-8 flex-shrink-0"
        onClick={() => removeItem(item.product.id)}
        aria-label="Remove item"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
