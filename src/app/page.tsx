'use client';

import { useState, useMemo, useCallback } from 'react';
import { products as allProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';
import PopupBanner from '@/components/home/PopupBanner';

export default function Home() {
  const [filters, setFilters] = useState({
    category: 'all',
    brand: 'all',
    priceRange: [0, 500],
    rating: 0,
  });
  const [sort, setSort] = useState('newest');

  const filteredAndSortedProducts = useMemo(() => {
    let products: Product[] = [...allProducts];

    products = products.filter((product) => {
      const categoryMatch = filters.category === 'all' || product.category === filters.category;
      const brandMatch = filters.brand === 'all' || product.brand === filters.brand;
      const priceMatch = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const ratingMatch = product.rating >= filters.rating;
      return categoryMatch && brandMatch && priceMatch && ratingMatch;
    });

    switch (sort) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        // Assuming the original order is newest first.
        break;
    }

    return products;
  }, [filters, sort]);

  const handleFilterChange = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const uniqueCategories = useMemo(() => ['all', ...Array.from(new Set(allProducts.map((p) => p.category)))], []);
  const uniqueBrands = useMemo(() => ['all', ...Array.from(new Set(allProducts.map((p) => p.brand)))], []);
  
  const maxPrice = useMemo(() => Math.max(...allProducts.map(p => p.price)), []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PopupBanner />
      <header className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-6xl text-primary">Discover Your Glow</h1>
        <p className="mt-4 text-lg text-muted-foreground">High-quality beauty products curated just for you.</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <ProductFilters
            categories={uniqueCategories}
            brands={uniqueBrands}
            onFilterChange={handleFilterChange}
            onSortChange={setSort}
            maxPrice={maxPrice}
            filters={filters}
          />
        </aside>
        <section className="lg:col-span-3">
          <ProductGrid products={filteredAndSortedProducts} />
        </section>
      </div>
    </div>
  );
}
