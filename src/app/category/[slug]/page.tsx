
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductGrid from '@/components/products/ProductGrid';
import type { Product } from '@/lib/types';
import { getProducts } from '@/actions/product-actions';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const products = await getProducts();
      setAllProducts(products);
      setLoading(false);
    };
    fetchProducts();
  }, []);
  
  const categoryName = slug ? decodeURIComponent(slug).replace(/-/g, ' ') : '';
  const filteredProducts = allProducts.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline capitalize">{categoryName}</h1>
            <p className="text-lg text-muted-foreground mt-4">Browse all products in the {categoryName} category.</p>
        </div>
        <main>
          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </main>
    </div>
  );
}
