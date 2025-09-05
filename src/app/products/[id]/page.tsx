import ProductDetailClient from '@/components/products/ProductDetailClient';

// We are moving to client-side fetching for this page, so generateStaticParams is no longer needed.
// It was causing build issues because it tried to access Firestore at build time.

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // The client component will now be responsible for fetching the product data.
  // We just need to pass the ID to it.
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProductDetailClient productId={params.id} />
    </div>
  );
}
