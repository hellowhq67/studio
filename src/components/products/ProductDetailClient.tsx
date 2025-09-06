
'use client';

import { useState, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { Star, ShoppingBag, Minus, Plus, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useCurrency } from '@/hooks/useCurrency';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { getProductById } from '@/actions/product-actions';
import AiRecommendations from './AiRecommendations';
import { notFound } from 'next/navigation';

export default function ProductDetailClient({ productId }: { productId: string }) {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const fetchedProduct = await getProductById(productId);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        // Track browsing history in localStorage
        const history = JSON.parse(localStorage.getItem('browsingHistory') || '[]');
        const newHistory = [fetchedProduct.name, ...history.filter((p: string) => p !== fetchedProduct.name)].slice(0, 5);
        localStorage.setItem('browsingHistory', JSON.stringify(newHistory));
      } else {
        // If product not found, you can handle it here, e.g., redirect or show a 'not found' message.
        notFound();
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
        addItem(product, quantity);
    }
  };
  
  if (loading) {
    return (
        <div className="flex justify-center items-center h-[50vh]">
            <Loader2 className="w-10 h-10 animate-spin" />
        </div>
    );
  }

  if (!product) {
    return null; // Or a 'Product not found' component
  }
  
  const hasSale = product.salePrice && product.salePrice < product.price;
  const displayPrice = hasSale ? product.salePrice : product.price;

  return (
    <>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div className="grid gap-4">
            <Carousel className="w-full">
                <CarouselContent>
                    {product.images.map((img, index) => (
                        <CarouselItem key={index}>
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-0">
                                   <img
                                      src={img}
                                      alt={`${product.name} image ${index + 1}`}
                                      width={800}
                                      height={800}
                                      className="w-full h-full object-cover rounded-lg"
                                      data-ai-hint={`${product.category} product detail`}
                                    />
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
            </Carousel>
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
              <p className={`text-3xl font-bold ${hasSale ? 'text-destructive' : ''}`}>{formatPrice(displayPrice ?? 0)}</p>
              {hasSale && <p className="text-xl text-muted-foreground line-through">{formatPrice(product.price)}</p>}
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
        <div className="mt-16">
            <h2 className="font-headline text-3xl text-center mb-8">You Might Also Like</h2>
            <AiRecommendations currentProduct={product} />
        </div>
    </>
  );
}
