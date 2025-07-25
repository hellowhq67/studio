import { products } from '@/lib/products';
import type { Product } from '@/lib/types';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import AiRecommendations from '@/components/products/AiRecommendations';

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProductDetailClient product={product} />
      <div className="mt-16">
        <h2 className="font-headline text-3xl text-center mb-8">You Might Also Like</h2>
        <AiRecommendations currentProduct={product} />
      </div>
    </div>
  );
}
