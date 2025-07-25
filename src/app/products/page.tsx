'use client';

import { products } from '@/lib/products';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Link from 'next/link';

export default function ProductsPage() {
  const discoverProducts = products.slice(0, 6);
  const newArrivals = products.slice(6, 12);

  const searchHistory = ["Brow Pencil", "Glow Foundation", "Matte Lipstick", "Primer Serum", "Blush Stick"];
  const recommendations = ["Blush Stick", "Brow Pencil", "Setting Spray", "Primer Serum", "Face Mask", "Glow Foundation"];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-10 h-12" />
        </div>
        <Button variant="outline" size="icon" className="h-12 w-12">
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Search history</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {searchHistory.map(item => (
                <Button key={item} variant="outline" className="rounded-full whitespace-nowrap">{item}</Button>
            ))}
        </div>
      </section>

       <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Recommendations</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {recommendations.map(item => (
                <Button key={item} variant="outline" className="rounded-full whitespace-nowrap">{item}</Button>
            ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Discover</h2>
           <Link href="#" className="text-primary font-semibold">View all</Link>
        </div>
        <Carousel opts={{
          align: "start",
          loop: true,
        }}
        className="w-full">
          <CarouselContent>
            {discoverProducts.map((product, index) => (
              <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">New Arrivals</h2>
           <Link href="#" className="text-primary font-semibold">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {newArrivals.slice(0,4).map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>
    </div>
  );
}
