import { getProductById, getProducts } from '@/actions/product-actions';
import type { Product } from '@/lib/types';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import AiRecommendations from '@/components/products/AiRecommendations';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

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
