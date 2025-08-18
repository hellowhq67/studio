
'use client';

import { useState, useMemo } from 'react';
import { products as allProducts } from '@/lib/products';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';
import type { Product } from '@/lib/types';

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    category: 'all',
    brand: 'all',
    priceRange: [0, 100],
    rating: 0,
  });
  const [sortKey, setSortKey] = useState('newest');

  const categories = useMemo(() => ['all', ...Array.from(new Set(allProducts.map(p => p.category)))], []);
  const brands = useMemo(() => ['all', ...Array.from(new Set(allProducts.map(p => p.brand)))], []);
  const maxPrice = useMemo(() => Math.max(...allProducts.map(p => p.price)), []);
  
  // Update initial price range filter to cover all products
  useState(() => {
    setFilters(f => ({...f, priceRange: [0, Math.ceil(maxPrice)]}));
    return null;
  });

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

  }, [filters]);
  
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
            // Assuming products are already somewhat sorted by newest if they have IDs or dates
            // For this static list, we'll just keep the original order.
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
                />
            </aside>
            <main className="md:col-span-3">
                <ProductGrid products={sortedProducts} />
            </main>
        </div>
    </div>
  );
}
