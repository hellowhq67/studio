import { products } from '@/lib/products';
import ProductGrid from '@/components/products/ProductGrid';
import PopupBanner from '@/components/home/PopupBanner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const featuredProducts = products.slice(0, 3);

  return (
    <div>
      <PopupBanner />
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-gray-900 text-white flex items-center justify-center">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Luxury cosmetics on display"
          layout="fill"
          objectFit="cover"
          className="opacity-40"
          data-ai-hint="luxury cosmetics display"
        />
        <div className="relative z-10 text-center p-4">
          <h1 className="font-headline text-5xl md:text-7xl text-white mb-4">
            Elegance in Every Drop
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Discover the secret to timeless beauty.
          </p>
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/products">Shop The Collection</Link>
          </Button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-headline text-4xl text-center mb-12">Featured Products</h2>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* Blog Section */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-headline text-4xl text-center mb-12">From Our Blog</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg overflow-hidden shadow-lg">
              <Image src="https://placehold.co/600x400.png" alt="Skincare routine" width={600} height={400} data-ai-hint="skincare routine products" />
              <div className="p-6">
                <h3 className="font-headline text-xl mb-2">The Ultimate Morning Skincare Routine</h3>
                <p className="text-muted-foreground mb-4">Start your day with a glow. Here are the essential steps for a perfect morning skincare ritual that will leave your skin radiant and protected.</p>
                <Button variant="link" className="p-0 text-primary">Read More</Button>
              </div>
            </div>
            <div className="bg-card rounded-lg overflow-hidden shadow-lg">
              <Image src="https://placehold.co/600x400.png" alt="Makeup trends" width={600} height={400} data-ai-hint="makeup trends model" />
              <div className="p-6">
                <h3 className="font-headline text-xl mb-2">Summer Makeup Trends to Try Now</h3>
                <p className="text-muted-foreground mb-4">From bold lips to shimmering eyes, discover the hottest makeup looks for the summer season and how to achieve them effortlessly.</p>
                <Button variant="link" className="p-0 text-primary">Read More</Button>
              </div>
            </div>
            <div className="bg-card rounded-lg overflow-hidden shadow-lg">
              <Image src="https://placehold.co/600x400.png" alt="Healthy hair" width={600} height={400} data-ai-hint="healthy shiny hair" />
              <div className="p-6">
                <h3 className="font-headline text-xl mb-2">5 Secrets to Healthy, Shiny Hair</h3>
                <p className="text-muted-foreground mb-4">Unlock the secrets to luscious locks. We're sharing our top five tips for maintaining healthy, strong, and incredibly shiny hair.</p>
                <Button variant="link" className="p-0 text-primary">Read More</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
