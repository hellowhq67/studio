
'use client';

import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { Star, ShoppingCart, Heart } from 'lucide-react';
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
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg border bg-card text-card-foreground group">
      <Link href={`/products/${product.id}`} className="contents">
        <CardHeader className="p-0 relative">
          <div className="aspect-[4/3] w-full overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              width={600}
              height={450}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={`${product.category} product`}
            />
          </div>
          {hasSale && (
            <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">-{salePercentage}%</Badge>
          )}
           <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button size="icon" variant="outline" className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm">
                    <Heart size={16} />
                </Button>
                 <Button 
                    onClick={handleAddToCart}
                    size="icon" 
                    variant="outline"
                    className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                    aria-label="Add to cart"
                    >
                        <ShoppingCart size={16}/>
                </Button>
           </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow flex flex-col">
          <p className="text-sm text-muted-foreground">{product.category}</p>
          <CardTitle className="font-semibold text-base mt-1 mb-2 leading-tight flex-grow">{product.name}</CardTitle>
          <div className="flex items-center justify-between mt-auto">
             <div className="flex items-baseline gap-2">
                <p className="font-bold text-lg text-primary">{formatPrice(displayPrice ?? 0)}</p>
                {hasSale && <p className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</p>}
             </div>
             <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'fill-current' : 'stroke-current'} />
                ))}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
