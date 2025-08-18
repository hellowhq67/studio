import { products } from '@/lib/products';
import ProductGrid from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { ArrowRight, Star, Heart, ShoppingCart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProductCard from '@/components/products/ProductCard';

const CategoryCard = ({ img, title, dataAiHint }: { img: string, title: string, dataAiHint: string }) => (
    <div className="text-center group">
        <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all duration-300">
            <img src={img} alt={title} className="w-full h-full object-cover" data-ai-hint={dataAiHint} />
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
    </div>
)

export default function Home() {
  const beautyCareProducts = products.slice(0, 8);

  return (
    <div className="bg-[#F8F8F8] dark:bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="md:col-start-1">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight mb-4">
              Ecomarts Beauty Cosmetics
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover our new cosmetics, we believe in the power of nature to reveal your natural beauty.
            </p>
            <Button size="lg" asChild>
              <Link href="/products">Explore Collection <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
          <div className="relative flex items-center justify-center gap-4">
            <div className="relative w-40 h-64 rounded-t-full rounded-b-lg overflow-hidden shadow-lg">
                 <img src="https://placehold.co/300x400.png" alt="Beauty model" className="w-full h-full object-cover" data-ai-hint="beauty model portrait" />
            </div>
            <div className="relative w-64 h-96 rounded-t-full rounded-b-lg overflow-hidden shadow-2xl">
                 <img src="https://placehold.co/400x600.png" alt="Beauty model 2" className="w-full h-full object-cover" data-ai-hint="beauty model face" />
            </div>
             <div className="absolute top-1/2 -right-16 bg-white dark:bg-card p-4 rounded-lg shadow-lg w-48">
                <p className="font-bold">Luxurious Beauty Product</p>
                 <div className="w-full h-24 my-2 rounded-md overflow-hidden">
                    <img src="https://placehold.co/200x200.png" alt="Luxury product" className="w-full h-full object-cover" data-ai-hint="cosmetic product bottle"/>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-bold text-lg">$25.00</p>
                        <div className="flex text-yellow-400">
                           <Star size={16} fill="currentColor" />
                           <Star size={16} fill="currentColor" />
                           <Star size={16} fill="currentColor" />
                           <Star size={16} fill="currentColor" />
                           <Star size={16} />
                        </div>
                    </div>
                    <Button size="sm">Buy Now</Button>
                </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Categories */}
      <section className="py-16 bg-white dark:bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <Button variant="outline" className="rounded-full pointer-events-none mb-2">Shop by categories</Button>
                <h2 className="text-4xl font-bold text-center">Popular Categories</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <CategoryCard img="https://placehold.co/200x200.png" title="Eye Shadow" dataAiHint="eyeshadow makeup" />
                <CategoryCard img="https://placehold.co/200x200.png" title="Face Cream" dataAiHint="face cream product" />
                <CategoryCard img="https://placehold.co/200x200.png" title="Skin Care" dataAiHint="woman skincare routine" />
                <CategoryCard img="https://placehold.co/200x200.png" title="Body Spray" dataAiHint="perfume bottle" />
              </div>
          </div>
      </section>

      {/* Beauty Care Products */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Button variant="outline" className="rounded-full pointer-events-none mb-2">Top Brands</Button>
            <h2 className="text-4xl font-bold">Beauty Care Products</h2>
          </div>
          <ProductGrid products={beautyCareProducts} />
           <div className="text-center mt-12">
                <Button variant="outline" asChild>
                    <Link href="/products">View All Products</Link>
                </Button>
           </div>
        </div>
      </section>

       {/* Featured Banners */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-card p-8 rounded-lg flex items-center">
            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-2">Flawless Finish Powder!</h3>
              <p className="text-muted-foreground mb-4">New product with 10% off</p>
              <Button>Shop Now</Button>
            </div>
            <div className="flex-1">
                <img src="https://placehold.co/300x300.png" alt="Flawless Finish Powder" className="w-full object-contain" data-ai-hint="cosmetic powder jar" />
            </div>
          </div>
          <div className="grid gap-8">
              <div className="bg-white dark:bg-card p-6 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold">Stripes Are Back!</h4>
                  <p className="text-muted-foreground">Why Stripes is the best!</p>
                </div>
                <img src="https://placehold.co/150x150.png" alt="Stripes" className="w-28 h-28 object-contain" data-ai-hint="beauty cream jar" />
              </div>
              <div className="bg-white dark:bg-card p-6 rounded-lg flex items-center justify-between">
                 <div>
                  <h4 className="text-2xl font-bold">Body Lotion</h4>
                  <p className="text-muted-foreground">Check Now</p>
                </div>
                <img src="https://placehold.co/150x150.png" alt="Body Lotion" className="w-28 h-28 object-contain" data-ai-hint="applying body lotion" />
              </div>
          </div>
        </div>
      </section>
      
       {/* Highly Performing CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-lg overflow-hidden">
            <img src="https://placehold.co/1200x400.png" alt="Makeup products" className="w-full h-full object-cover" data-ai-hint="makeup products flatlay" />
            <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-start p-12">
               <h2 className="text-4xl font-bold text-white max-w-md">Highly Performing Beauty Formula</h2>
               <p className="text-white/80 my-4 max-w-md">Discover our new cosmetics, we believe in the power of nature to reveal your natural beauty.</p>
               <Button size="lg">Shop Now</Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
       <section className="py-16 bg-white dark:bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <Button variant="outline" className="rounded-full pointer-events-none mb-2">Testimonial</Button>
                <h2 className="text-4xl font-bold">What Our Clients Say</h2>
            </div>
             <div className="relative">
                <div className="text-center max-w-2xl mx-auto">
                    <p className="text-lg text-muted-foreground mb-6">"This is the best beauty product I've ever used. My skin feels amazing and looks so radiant. I highly recommend it to everyone!"</p>
                    <div className="flex justify-center items-center gap-4">
                        <Avatar>
                            <AvatarImage src="https://placehold.co/100x100.png" alt="Jenny Wilson" data-ai-hint="woman smiling"/>
                            <AvatarFallback>JW</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-bold">Jenny Wilson</p>
                            <p className="text-sm text-muted-foreground">Marketing Coordinator</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
       </section>
       
       {/* Blog Section */}
        <section className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="text-center mb-12">
                    <Button variant="outline" className="rounded-full pointer-events-none mb-2">Recent News</Button>
                    <h2 className="text-4xl font-bold">From The Blog</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white dark:bg-card rounded-lg overflow-hidden shadow-sm">
                            <img src={`https://placehold.co/400x300.png`} alt="Blog post" className="w-full h-48 object-cover" data-ai-hint="beauty lifestyle" />
                            <div className="p-6">
                                <p className="text-sm text-muted-foreground mb-2">Dec 22, 2022 - By Admin</p>
                                <h3 className="font-bold text-lg mb-4">Including Animation in Your Design System</h3>
                                <Link href="#" className="text-primary font-semibold flex items-center gap-2">
                                    Read More <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

    </div>
  );
}
