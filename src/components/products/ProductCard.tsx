'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
  };

  return (
    <Link href={`/products/${product.id}`} className="group">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-transparent hover:border-primary/20">
        <CardHeader className="p-0">
          <div className="aspect-square w-full overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={`${product.category} product`}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <p className="text-sm text-muted-foreground">{product.brand}</p>
          <CardTitle className="font-headline text-lg mt-1 mb-2 leading-tight">{product.name}</CardTitle>
          <div className="flex items-center">
            <div className="flex items-center text-accent">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-transparent stroke-current'}`} />
                ))}
            </div>
            <span className="text-xs text-muted-foreground ml-2">({product.reviewCount})</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 flex justify-between items-center">
          <p className="font-semibold text-lg">${product.price.toFixed(2)}</p>
          <Button onClick={handleAddToCart} variant="secondary" className="bg-accent/20 hover:bg-accent/40 text-accent-foreground">
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
