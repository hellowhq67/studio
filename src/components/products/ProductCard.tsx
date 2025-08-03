'use client';

import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { Star, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useCurrency } from '@/hooks/useCurrency';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} was added to your cart.`,
    });
  };

  const hasSale = product.salePrice && product.salePrice < product.price;
  const displayPrice = hasSale ? product.salePrice : product.price;
  const salePercentage = hasSale ? Math.round(((product.price - product.salePrice!) / product.price) * 100) : 0;

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl border-transparent bg-card text-card-foreground group">
      <Link href={`/products/${product.id}`} className="contents">
        <CardHeader className="p-0 relative">
          <div className="aspect-square w-full overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={`${product.category} product`}
            />
          </div>
          {hasSale && (
            <Badge variant="destructive" className="absolute top-2 left-2">-{salePercentage}%</Badge>
          )}
           <Button 
            onClick={handleAddToCart}
            size="icon" 
            className="absolute bottom-2 right-2 h-10 w-10 rounded-full bg-primary/80 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm hover:bg-primary"
            aria-label="Add to cart"
            >
                <ShoppingBag size={20}/>
           </Button>
        </CardHeader>
        <CardContent className="p-4 text-center flex-grow">
          <p className="text-xs text-muted-foreground uppercase">{product.brand}</p>
          <CardTitle className="font-semibold text-base mt-1 mb-2 leading-tight">{product.name}</CardTitle>
          <div className="flex justify-center items-baseline gap-2">
            <p className={`font-bold text-lg ${hasSale ? 'text-destructive' : ''}`}>{formatPrice(displayPrice ?? 0)}</p>
            {hasSale && <p className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</p>}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
