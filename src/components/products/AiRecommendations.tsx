'use client';

import { useState, useEffect } from 'react';
import { getProductRecommendations } from '@/ai/flows/product-recommendations';
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/lib/types';
import { getProducts } from '@/actions/product-actions';


interface AiRecommendationsProps {
  currentProduct: Product;
}

export default function AiRecommendations({ currentProduct }: AiRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

   useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        setAllProducts(products);
      } catch (err) {
        console.error('Failed to fetch products for recommendations', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (allProducts.length === 0) return;

    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        const browsingHistory = JSON.parse(localStorage.getItem('browsingHistory') || '[]').join(', ');
        
        const result = await getProductRecommendations({
          browsingHistory,
          productDescription: currentProduct.longDescription,
        });

        if (result && result.recommendedProducts) {
          const recommended = result.recommendedProducts
            .map(name => allProducts.find(p => p.name.toLowerCase() === name.toLowerCase()))
            .filter((p): p is Product => !!p && p.id !== currentProduct.id)
            .slice(0, 3); // Limit to 3 recommendations
          setRecommendations(recommended);
        } else {
          setRecommendations([]);
        }
      } catch (err) {
        console.error('Error fetching AI recommendations:', err);
        setError('Could not load recommendations.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentProduct, allProducts]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-destructive">{error}</p>;
  }

  if (recommendations.length === 0 && allProducts.length > 0) {
     // Fallback to showing 3 random products from the same category if no recommendations
    const categoryProducts = allProducts
      .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    if(categoryProducts.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
  }


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {recommendations.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
