
'use client';

import { useState, useMemo, useEffect } from 'react';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';
import type { Product } from '@/lib/types';
import { getProducts } from '@/actions/product-actions';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    category: 'all',
    brand: 'all',
    priceRange: [0, 500],
    rating: 0,
  });
  const [sortKey, setSortKey] = useState('newest');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const products = await getProducts();
      setAllProducts(products);
      if (products.length > 0) {
        const maxPrice = Math.max(...products.map(p => p.price));
        setFilters(f => ({ ...f, priceRange: [0, Math.ceil(maxPrice)] }));
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => ['all', ...Array.from(new Set(allProducts.map(p => p.category)))], [allProducts]);
  const brands = useMemo(() => ['all', ...Array.from(new Set(allProducts.map(p => p.brand)))], [allProducts]);
  const maxPrice = useMemo(() => allProducts.length > 0 ? Math.max(...allProducts.map(p => p.price)) : 500, [allProducts]);
  
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSortChange = (key: string) => {
    setSortKey(key);
  };
  
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    if (filters.brand !== 'all') {
      filtered = filtered.filter(p => p.brand === filters.brand);
    }
    filtered = filtered.filter(p => {
        const price = p.salePrice ?? p.price;
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });
    filtered = filtered.filter(p => p.rating >= filters.rating);
    
    return filtered;

  }, [filters, allProducts]);
  
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortKey) {
        case 'price-asc':
            sorted.sort((a,b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
            break;
        case 'price-desc':
            sorted.sort((a,b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
            break;
        case 'rating-desc':
            sorted.sort((a,b) => b.rating - a.rating);
            break;
        case 'newest':
        default:
            // Assuming products are already sorted by createdAt from the server
            break;
    }
    return sorted;
  }, [filteredProducts, sortKey])


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">All Products</h1>
            <p className="text-lg text-muted-foreground mt-4">Find your new favorite beauty essentials.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
            <aside className="md:col-span-1">
                <ProductFilters
                    categories={categories}
                    brands={brands}
                    maxPrice={Math.ceil(maxPrice)}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                    disabled={loading}
                />
            </aside>
            <main className="md:col-span-3">
              {loading ? (
                 <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
              ) : (
                <ProductGrid products={sortedProducts} />
              )}
            </main>
        </div>
    </div>
  );
}
