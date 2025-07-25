'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
  };

  const hasSale = product.salePrice && product.salePrice < product.price;
  const salePercentage = hasSale ? Math.round(((product.price - product.salePrice!) / product.price) * 100) : 0;

  return (
    <Link href={`/products/${product.id}`} className="group">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-transparent hover:border-primary/20 bg-card">
        <CardHeader className="p-0 relative">
          <div className="aspect-square w-full overflow-hidden rounded-t-lg">
            <Image
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
        </CardHeader>
        <CardContent className="p-3 flex-grow">
          <CardTitle className="font-semibold text-sm mt-1 mb-2 leading-tight">{product.name}</CardTitle>
        </CardContent>
        <CardFooter className="p-3 flex justify-between items-center">
          <div className="flex items-baseline gap-2">
            <p className={`font-bold ${hasSale ? 'text-destructive' : ''}`}>${(hasSale ? product.salePrice : product.price)?.toFixed(2)}</p>
            {hasSale && <p className="text-xs text-muted-foreground line-through">${product.price.toFixed(2)}</p>}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
