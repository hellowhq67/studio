'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { Star, ShoppingBag, Minus, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images[0]);

  useEffect(() => {
    // Track browsing history in localStorage
    const history = JSON.parse(localStorage.getItem('browsingHistory') || '[]');
    const newHistory = [product.name, ...history.filter((p: string) => p !== product.name)].slice(0, 5);
    localStorage.setItem('browsingHistory', JSON.stringify(newHistory));
  }, [product.name]);

  const handleAddToCart = () => {
    addItem(product, quantity);
  };
  
  const hasSale = product.salePrice && product.salePrice < product.price;

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
      <div className="grid gap-4">
        <div className="aspect-square w-full overflow-hidden rounded-lg shadow-lg">
          <Image
            src={activeImage}
            alt={product.name}
            width={800}
            height={800}
            className="w-full h-full object-cover"
            data-ai-hint={`${product.category} product detail`}
          />
        </div>
        {product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                className={`aspect-square w-full rounded-md overflow-hidden ring-offset-background ring-2 ${activeImage === img ? 'ring-primary' : 'ring-transparent'}`}
                onClick={() => setActiveImage(img)}
              >
                <Image
                  src={img}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col h-full">
        <p className="font-semibold text-primary">{product.category}</p>
        <h1 className="font-headline text-4xl md:text-5xl my-2">{product.name}</h1>
        <p className="text-lg text-muted-foreground mb-4">{product.brand}</p>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center text-accent">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-transparent stroke-current'}`} />
            ))}
          </div>
          <span className="text-muted-foreground text-sm">
            {product.rating.toFixed(1)} ({product.reviewCount} reviews)
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-6">
          <p className={`text-3xl font-bold ${hasSale ? 'text-destructive' : ''}`}>${(hasSale ? product.salePrice : product.price)?.toFixed(2)}</p>
          {hasSale && <p className="text-xl text-muted-foreground line-through">${product.price.toFixed(2)}</p>}
        </div>
        
        <p className="text-muted-foreground leading-relaxed">{product.longDescription}</p>
        
        <Separator className="my-6" />

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q-1))}>
                <Minus className="h-4 w-4"/>
            </Button>
            <span className="w-10 text-center font-bold">{quantity}</span>
            <Button variant="outline" size="icon" onClick={() => setQuantity(q => q+1)}>
                <Plus className="h-4 w-4"/>
            </Button>
          </div>
          <Button size="lg" className="flex-grow bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleAddToCart}>
            <ShoppingBag className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
